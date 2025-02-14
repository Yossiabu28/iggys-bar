const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Initialize two separate Express applications
const app1 = express(); // For index.html
const app2 = express(); // For order-queue.html

const PORT_1 = 3000; // Port for index.html
const PORT_2 = 4000; // Port for order-queue.html

// Middleware for both servers
app1.use(cors());
app1.use(bodyParser.json());
app2.use(cors());

// Serve static files for both servers
app1.use(express.static(path.join(__dirname, 'public', 'index')));
app2.use(express.static(path.join(__dirname, 'public', 'queue')));

// Serve index.html on port 3000
app1.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index', 'index.html'));
});

// Serve order-queue.html on port 4000
app2.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'queue', 'order-queue.html'));
});

// Endpoint for submitting orders (for index.html)
app1.post('/submit-order', (req, res) => {
    const order = req.body;
    const timestamp = new Date().toISOString();
    order.timestamp = timestamp;

    // Read existing orders from orders.json
    fs.readFile('orders.json', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Unable to read orders file' });
        }
        let orders = JSON.parse(data);
        orders.push(order);

        // Save updated orders back to orders.json
        fs.writeFile('orders.json', JSON.stringify(orders), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Unable to save order' });
            }
            res.status(200).json({ message: 'Order submitted successfully!' });
        });
    });
});


// Use body-parser middleware to parse JSON requests
app2.use(bodyParser.json());

// Endpoint for fetching orders (for order-queue.html)
app2.get('/get-orders', (req, res) => {
    fs.readFile('orders.json', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Unable to read orders file' });
        }
        const orders = JSON.parse(data);
        res.json(orders);
    });
});


// Endpoint to mark an order as done (for order-queue.html)
app2.post('/mark-done', (req, res) => {
    const { timestamp } = req.body;  // Get the timestamp from the request body

    // Read existing orders from orders.json
    fs.readFile('orders.json', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Unable to read orders file' });
        }

        let orders = JSON.parse(data);

        // Find the order by its timestamp
        const orderIndex = orders.findIndex(order => order.timestamp === timestamp);

        if (orderIndex !== -1) {
            // Mark the order as done
            orders[orderIndex].status = 'Done';

            // Remove the order from the queue (optional, if you want to delete it)
            orders.splice(orderIndex, 1);

            // Save the updated orders back to orders.json
            fs.writeFile('orders.json', JSON.stringify(orders), (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Unable to update orders' });
                }
                res.status(200).json({ message: 'Order marked as done and removed from the queue!' });
            });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    });
});



// Ensure orders.json exists if it doesn't
fs.existsSync('orders.json') || fs.writeFileSync('orders.json', JSON.stringify([]));

// Start servers for both HTML files
app1.listen(PORT_1, '10.0.0.6', () => {
    console.log(`Server is running on http://10.0.0.6:${PORT_1}`);
});

app2.listen(PORT_2, '10.0.0.6', () => {
    console.log(`Server is running on http://10.0.0.6:${PORT_2}`);
});



