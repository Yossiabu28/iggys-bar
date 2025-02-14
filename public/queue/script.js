// Global variable to store orders
let orders = [];

// Function to fetch orders from the server and render them
function fetchOrders() {
    fetch('http://10.0.0.6:4000/get-orders') // Change this URL as needed
        .then(response => response.json())
        .then(fetchedOrders => {
            orders = fetchedOrders;  // Update the global orders array
            renderOrders(orders);     // Pass orders to render function
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
            alert('Error fetching orders');
        });
}

// Function to render the orders
function renderOrders(orders) {
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = ''; // Clear the previous list

    if (orders.length === 0) {
        orderList.innerHTML = '<p>No orders found.</p>';
        return;
    }

    // Loop through each order and create a new div
    orders.forEach((order, index) => {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('order');

        orderDiv.innerHTML = `
            <h4>${order.cocktail}</h4>
            <p><strong>Customer:</strong> ${order.name}</p>
            <p><strong>Notes:</strong> ${order.notes}</p>
            <p><strong>Time:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
            <p class="status">Status: ${order.status || 'Pending'}</p>
            <button onclick="markAsDone(${index})">Mark as Done</button>
        `;

        orderList.appendChild(orderDiv);
    });
}

// Function to mark an order as done
function markAsDone(orderIndex) {
    const order = orders[orderIndex];
    if (!order) {
        alert("Order not found!");
        return;
    }

    order.status = 'Done'; // Update the order's status

    // Send updated order status to the server
    fetch('http://10.0.0.6:4000/mark-done', {  // Adjust the endpoint as needed
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  // Ensure this is set correctly
        },
        body: JSON.stringify({ timestamp: order.timestamp })
    })
    .then(response => response.json())
    .then(data => {
        alert('Order marked as done!');
        fetchOrders();  // Re-fetch orders to reflect the changes
    })
    .catch(error => {
        console.error('Error marking order as done:', error);
        alert('Error marking order as done');
    });
}

// Fetch orders when the page loads
window.onload = fetchOrders;

// Refresh the order list dynamically every 5 seconds
setInterval(fetchOrders, 5000);
