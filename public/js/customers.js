document.addEventListener('DOMContentLoaded', function() {
    loadCustomerStats();
    loadCustomers();

    // Set up search functionality
    const searchInput = document.getElementById('customer-search');
    searchInput.addEventListener('input', debounce(function() {
        loadCustomers(this.value);
    }, 300));
});

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function loadCustomerStats() {
    try {
        const response = await fetch('/api/customers/stats');
        const stats = await response.json();
        
        document.getElementById('total-customers').textContent = stats.totalCustomers;
        document.getElementById('new-customers').textContent = stats.newCustomers;
        document.getElementById('loyalty-members').textContent = stats.loyaltyMembers;
        document.getElementById('avg-order-value').textContent = formatCurrency(stats.avgOrderValue);
    } catch (error) {
        console.error('Error loading customer stats:', error);
    }
}

async function loadCustomers(searchTerm = '') {
    try {
        const response = await fetch(`/api/customers?search=${encodeURIComponent(searchTerm)}`);
        const customers = await response.json();
        displayCustomers(customers);
    } catch (error) {
        console.error('Error loading customers:', error);
        document.getElementById('customers-table').innerHTML = 
            '<div class="alert alert-danger">Error loading customers. Please try again later.</div>';
    }
}

function displayCustomers(customers) {
    const container = document.getElementById('customers-table');
    if (!customers || customers.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No customers found.</div>';
        return;
    }

    let html = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Loyalty Status</th>
                        <th>Total Orders</th>
                        <th>Last Visit</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;

    customers.forEach(customer => {
        html += `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone || '-'}</td>
                <td>
                    <span class="badge bg-${customer.isLoyaltyMember ? 'success' : 'secondary'}">
                        ${customer.isLoyaltyMember ? 'Member' : 'Non-member'}
                    </span>
                </td>
                <td>${customer.totalOrders}</td>
                <td>${formatDate(customer.lastVisit)}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="viewCustomer('${customer._id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-success me-1" onclick="editCustomer('${customer._id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCustomer('${customer._id}')">
                        <i class="bi bi-trash"></i>
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

    container.innerHTML = html;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function openAddCustomerModal() {
    const modal = new bootstrap.Modal(document.getElementById('addCustomerModal'));
    modal.show();
}

async function saveCustomer() {
    const form = document.getElementById('addCustomerForm');
    const formData = new FormData(form);
    
    const customerData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        isLoyaltyMember: formData.get('loyalty') === 'on'
    };

    try {
        const response = await fetch('/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
        });

        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('addCustomerModal'));
            modal.hide();
            form.reset();
            loadCustomers();
            loadCustomerStats();
        } else {
            throw new Error('Failed to save customer');
        }
    } catch (error) {
        console.error('Error saving customer:', error);
        alert('Error saving customer. Please try again.');
    }
}

async function viewCustomer(customerId) {
    // Implement view customer details
    console.log('Viewing customer:', customerId);
}

async function editCustomer(customerId) {
    // Implement edit customer
    console.log('Editing customer:', customerId);
}

async function deleteCustomer(customerId) {
    if (confirm('Are you sure you want to delete this customer?')) {
        try {
            const response = await fetch(`/api/customers/${customerId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                loadCustomers();
                loadCustomerStats();
            } else {
                throw new Error('Failed to delete customer');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            alert('Error deleting customer. Please try again.');
        }
    }
}
