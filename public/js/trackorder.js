document.getElementById("trackOrderBtn").addEventListener("click", () => {
    const orderId = document.getElementById("orderIdInput").value;

    // Clear previous messages
    document.getElementById("orderDetails").style.display = "none";
    document.getElementById("orderError").style.display = "none";

    if (!orderId) {
        document.getElementById("orderError").textContent = "Please enter a valid Order ID.";
        document.getElementById("orderError").style.display = "block";
        return;
    }

    // Fetch order data from the server
    fetch(`/api/orders/${orderId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Order not found");
            }
            return response.json();
        })
        .then((order) => {
            document.getElementById("orderId").textContent = order.id;
            document.getElementById("orderStatus").textContent = order.status;
            document.getElementById("orderDate").textContent = order.date;

            document.getElementById("orderDetails").style.display = "block";
        })
        .catch((error) => {
            document.getElementById("orderError").textContent = error.message;
            document.getElementById("orderError").style.display = "block";
        });
});