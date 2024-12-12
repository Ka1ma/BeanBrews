document.getElementById("trackOrderBtn").addEventListener("click", () => {
    const orderId = document.getElementById("orderIdInput").value;
    const orderStatus = document.getElementById("orderDetails");

    if (!orderId) {
        orderStatus.textContent = "Please enter a valid Order ID.";
        return;
    }

    const mockOrders = {
        "12345": "Preparing your order.",
        "67890": "Out for delivery.",
        "11223": "Delivered."
    };

    if (mockOrders[orderId]) {
        orderStatus.textContent = `Order Status: ${mockOrders[orderId]}`;
    } else {
        orderStatus.textContent = "Order not found. Please check the Order ID.";
    }
});
