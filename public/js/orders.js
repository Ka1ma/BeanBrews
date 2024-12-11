document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
});

async function loadOrders() {
    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('orders-content').innerHTML = 
            '<div class="alert alert-danger">Error loading orders. Please try again later.</div>';
    }
}

function displayOrders(orders) {
    const ordersContent = document.getElementById('orders-content');
    if (!orders || orders.length === 0) {
        ordersContent.innerHTML = '<div class="alert alert-info">No orders found.</div>';
        return;
    }

    let html = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;

    orders.forEach(order => {
        html += `
            <tr>
                <td>${order.orderId}</td>
                <td>${new Date(order.date).toLocaleString()}</td>
                <td>${order.customer || 'Walk-in'}</td>
                <td>${order.items.length} items</td>
                <td>$${order.total.toFixed(2)}</td>
                <td><span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewOrder('${order.orderId}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-success" onclick="updateStatus('${order.orderId}')">
                        <i class="bi bi-check2"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    ordersContent.innerHTML = html;
}

function getStatusColor(status) {
    const statusColors = {
        'pending': 'warning',
        'processing': 'info',
        'completed': 'success',
        'cancelled': 'danger'
    };
    return statusColors[status.toLowerCase()] || 'secondary';
}

function viewOrder(orderId) {
    // Implement order details view
    console.log('Viewing order:', orderId);
}

function updateStatus(orderId) {
    // Implement status update
    console.log('Updating status for order:', orderId);
}
