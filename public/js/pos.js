// Global variables
let menuItems = [];
let currentOrder = [];

// DOM Elements
const menuItemsGrid = document.getElementById('menuItemsGrid');
const categoryList = document.getElementById('categoryList');
const orderItems = document.getElementById('orderItems');
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');
const searchInput = document.getElementById('searchInput');
const darkModeToggle = document.getElementById('darkModeToggle');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearOrderBtn = document.getElementById('clearOrderBtn');

// Payment Modal Elements
const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
const amountPaidInput = document.getElementById('amountPaid');
const changeInput = document.getElementById('change');
const completePaymentBtn = document.getElementById('completePaymentBtn');
const cryptoAmount = document.getElementById('cryptoAmount');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadMenuItems();
    setupEventListeners();
    loadDarkModePreference();
});

// Load menu items from the server
async function loadMenuItems() {
    try {
        const response = await fetch('/api/menu');
        menuItems = await response.json();
        displayMenuItems(menuItems);
        setupCategories();
    } catch (error) {
        console.error('Error loading menu items:', error);
    }
}

// Display menu items in the grid
function displayMenuItems(items) {
    menuItemsGrid.innerHTML = items.map(item => `
        <div class="col-md-4 menu-item" data-category="${item.category}">
            <div class="card h-100">
                <img src="${item.image}" class="card-img-top" alt="${item.name}">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">${item.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="price">$${item.price.toFixed(2)}</span>
                        <button class="btn btn-primary" onclick="addToOrder(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                            Add to Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Setup category filters
function setupCategories() {
    const categories = ['All', ...new Set(menuItems.map(item => item.category))];
    categoryList.innerHTML = categories.map(category => `
        <button class="list-group-item list-group-item-action ${category === 'All' ? 'active' : ''}" 
                data-category="${category}">
            ${category}
        </button>
    `).join('');
}

// Add item to order
function addToOrder(item) {
    const existingItem = currentOrder.find(orderItem => orderItem.id === item._id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        currentOrder.push({
            id: item._id,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }
    updateOrderDisplay();
}

// Update order display
function updateOrderDisplay() {
    orderItems.innerHTML = currentOrder.map(item => `
        <div class="order-item">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span>${item.name}</span>
                <div class="quantity-controls">
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
            <div class="d-flex justify-content-between">
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="btn btn-sm btn-danger" onclick="removeItem('${item.id}')">Remove</button>
            </div>
        </div>
    `).join('');
    updateTotals();
}

// Update item quantity
function updateQuantity(itemId, change) {
    const item = currentOrder.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            currentOrder = currentOrder.filter(item => item.id !== itemId);
        }
        updateOrderDisplay();
    }
}

// Remove item from order
function removeItem(itemId) {
    currentOrder = currentOrder.filter(item => item.id !== itemId);
    updateOrderDisplay();
}

// Update order totals
function updateTotals() {
    const subtotal = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.07;
    const total = subtotal + tax;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
    
    checkoutBtn.disabled = currentOrder.length === 0;
}

// Setup event listeners
function setupEventListeners() {
    // Category filter
    categoryList.addEventListener('click', (e) => {
        if (e.target.classList.contains('list-group-item')) {
            document.querySelectorAll('.list-group-item').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            const category = e.target.dataset.category;
            const filteredItems = category === 'All' 
                ? menuItems 
                : menuItems.filter(item => item.category === category);
            displayMenuItems(filteredItems);
        }
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredItems = menuItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            item.description.toLowerCase().includes(searchTerm)
        );
        displayMenuItems(filteredItems);
    });

    // Dark mode toggle
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Clear order
    clearOrderBtn.addEventListener('click', () => {
        currentOrder = [];
        updateOrderDisplay();
    });

    // Payment handling
    amountPaidInput.addEventListener('input', updateChange);
    completePaymentBtn.addEventListener('click', completeOrder);
}

// Update change amount
function updateChange() {
    const total = parseFloat(totalElement.textContent.replace('$', ''));
    const amountPaid = parseFloat(amountPaidInput.value) || 0;
    const change = amountPaid - total;
    changeInput.value = change >= 0 ? `$${change.toFixed(2)}` : '';
    completePaymentBtn.disabled = change < 0;
}

// Complete order
async function completeOrder() {
    try {
        const order = {
            items: currentOrder,
            subtotal: parseFloat(subtotalElement.textContent.replace('$', '')),
            tax: parseFloat(taxElement.textContent.replace('$', '')),
            total: parseFloat(totalElement.textContent.replace('$', '')),
            timestamp: new Date()
        };

        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });

        if (response.ok) {
            currentOrder = [];
            updateOrderDisplay();
            paymentModal.hide();
            alert('Order completed successfully!');
        } else {
            throw new Error('Failed to complete order');
        }
    } catch (error) {
        console.error('Error completing order:', error);
        alert('Failed to complete order. Please try again.');
    }
}

// Dark mode functions
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    updateDarkModeIcon();
}

function loadDarkModePreference() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
    updateDarkModeIcon();
}

function updateDarkModeIcon() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    darkModeToggle.innerHTML = `<i class="bi bi-${isDarkMode ? 'sun' : 'moon-stars'}"></i>`;
}
