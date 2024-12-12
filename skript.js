// Employee form submission
document.getElementById('addEmployeeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const EmployeeData = {
        EmployeeID: document.getElementById('employeeID').value,
        OrderID: document.getElementById('orderID').value || null,  // Handle optional fields
        FirstName: document.getElementById('firstName').value,
        LastName: document.getElementById('lastName').value,
        ContactInfo: document.getElementById('contactInfo').value || null,
        Role: document.getElementById('role').value || null,
        Salary: parseFloat(document.getElementById('salary').value) || null,
        HireDate: document.getElementById('hireDate').value || null,
        Status: document.getElementById('status').value || null,
    Address: document.getElementById('address').value || null,
    Department: document.getElementById('department').value || null,
    };

    try {
        // Replace with the deployed backend API endpoint
        const response = await fetch('https://your-ngrok-domain.ngrok-free.app/addEmployee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(EmployeeData),
        });

        if (response.ok) {
            alert('Employee added successfully!');
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error connecting to the server.');
    }
});

    document.getElementById('financialRecordForm').addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Collect form data
        const formData = {
            Month: document.getElementById('month').value,
            TotalSales: document.getElementById('totalSales').value,
            TotalExpenses: document.getElementById('totalExpenses').value,
            NetProfit: document.getElementById('netProfit').value,
            CategoryBreakdown: document.getElementById('categoryBreakdown').value,
        };

        try {
            // Send data to server
            const response = await fetch('/addFinancialRecord', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // Handle server response
            if (response.ok) {
                alert('Financial Record added successfully!');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error submitting financial record:', error);
            alert('There was an error submitting the form.');
        }
    });



    const formData = {
        InventoryID: document.getElementById('inventoryID').value,
        CurrentStock: document.getElementById('currentStock').value,
        ReOrderLevel: document.getElementById('reOrderLevel').value,
        LastRestockDate: document.getElementById('lastRestockDate').value,
        SupplierID: document.getElementById('supplierID').value,
    };


    document.getElementById('addInventoryForm').addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Collect form data
    try {
        // Send data to server
        const response = await fetch('/addInventory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        // Handle server response
        if (response.ok) {
            alert('Inventory Record added successfully!');
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error submitting inventory record:', error);
        alert('There was an error submitting the form.');
    }
});


document.getElementById('addSupplierForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Collect form data
    const formData = {
        SupplierID: document.getElementById('supplierID').value,
        InventoryID: document.getElementById('inventoryID').value,
        SupplierName: document.getElementById('supplierName').value,
        ContactNumber: document.getElementById('contactNumber').value,
        Address: document.getElementById('address').value,
        SuppliedItems: document.getElementById('suppliedItems').value.split(',').map(item => item.trim()),
};

try {
// Send data to server
const response = await fetch('/addSupplier', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
});

// Handle server response
if (response.ok) {
    alert('Supplier Record added successfully!');
} else {
    const errorData = await response.json();
    alert(`Error: ${errorData.message}`);
}
} catch (error) {
console.error('Error submitting supplier record:', error);
alert('There was an error submitting the form.');
}
});



document.getElementById('productForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Collect form data
    const formData = {
        ProductID: document.getElementById('productID').value.trim(),
        OrderID: document.getElementById('orderID').value.trim(),
        ProductName: document.getElementById('productName').value.trim(),
        Category: document.getElementById('category').value.trim(),
        PriceUnit: parseFloat(document.getElementById('priceUnit').value),
        StockLevel: parseInt(document.getElementById('stockLevel').value, 10),
    };

    // Validate required fields
    if (!formData.ProductID || isNaN(formData.PriceUnit) || isNaN(formData.StockLevel)) {
        alert("Please provide valid ProductID, PriceUnit, and StockLevel.");
        return;
    }

    try {
        // Send data to the server
        const response = await fetch('/addProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        // Handle server response
        if (response.ok) {
            const responseData = await response.json();
            alert(responseData.message); // Show success message
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error submitting product record:', error);
        alert('There was an error submitting the form.');
    }
});




document.getElementById('orderForm').addEventListener('submit', async function (event) {
    event.preventDefault();  // Prevent form from submitting normally

    // Collect form data
    const orderData = {
        orderID: document.getElementById('orderID').value,
        orderDate: document.getElementById('orderDate').value,
        totalAmount: parseFloat(document.getElementById('totalAmount').value),
        paymentMethod: document.getElementById('paymentMethod').value,
        gcashRefNumber: document.getElementById('gcashRefNumber').value,
        products: document.getElementById('products').value.split(',').map(item => item.trim()).map(item => {
            const [product, quantity] = item.split(':');
            return { product: product.trim(), quantity: parseInt(quantity.trim(), 10) };
        })
    };

    // Enable GCash reference number if GCash is selected
    if (orderData.paymentMethod === 'GCash') {
        document.getElementById('gcashRefNumber').disabled = false;
    } else {
        document.getElementById('gcashRefNumber').disabled = true;
    }

    try {
        // Send data to the server
        const response = await fetch('/addOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        // Handle server response
        if (response.ok) {
            const responseData = await response.json();
            alert(responseData.message);  // Show success message
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error submitting order record:', error);
        alert('There was an error submitting the form.');
    }
});


document.getElementById('salesTransactionForm').addEventListener('submit', async function (event) {
    event.preventDefault();  // Prevent the form from submitting normally

    // Collect form data
    const transactionData = {
        TransactionID: document.getElementById('transactionID').value,
        Date: document.getElementById('date').value,
        ProductID: parseInt(document.getElementById('productID').value, 10),
        QuantitySold: parseInt(document.getElementById('quantitySold').value, 10),
        TotalSalesAmount: parseFloat(document.getElementById('totalSalesAmount').value)
    };

    try {
        // Send data to the server
        const response = await fetch('/addSalesTransaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionData),
        });

        // Handle server response
        if (response.ok) {
            const responseData = await response.json();
            alert(responseData.message);  // Show success message
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error submitting sales transaction:', error);
        alert('There was an error submitting the form.');
    }
});