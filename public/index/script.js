// Function to render orders dynamically
function renderOrders() {
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = ''; // Clear previous list

    // Fetch orders from the server
    fetch('http://10.0.0.6:3000/get-orders')
    .then(response => response.json())
    .then(orders => {
        // Sort orders by timestamp
        orders.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // Loop through orders and display them
        orders.forEach((order, index) => {
            const orderDiv = document.createElement('div');
            orderDiv.classList.add('order');

            orderDiv.innerHTML = `
                <h4>${order.cocktail}</h4>
                <p><strong>Name:</strong> ${order.name}</p>
                <p><strong>Note:</strong> ${order.notes}</p>
                <p><strong>Time:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
                <button onclick="markAsDone(${index}, '${order.id}')">Done</button>
                <hr>
            `;

            orderList.appendChild(orderDiv);
        });
    })
    .catch(error => {
        console.error('Error fetching orders:', error);
    });
}

// Function to handle the "Done" button click
function markAsDone(orderIndex) {
    const order = orders[orderIndex];
    if (!order) {
        alert("Order not found!");
        return;
    }

    order.status = 'Done'; // Update the order's status

    // Send updated order status to the server
    fetch('http://10.0.0.6:4000/mark-done', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ timestamp: order.timestamp })
    })
    .then(response => response.json())
    .then(data => {
        alert('Order marked as done and removed from the queue!');
        fetchOrders();  // Re-fetch orders to reflect the changes
    })
    .catch(error => {
        console.error('Error marking order as done:', error);
        alert('Error marking order as done');
    });
}


// Set the interval to refresh the order list every 5 seconds
setInterval(renderOrders, 5000);

// Initial render of orders
renderOrders();
