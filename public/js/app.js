// Global state
let currentOrder = {
    items: [],
    total: 0
};

let products = [];
let currentPage = 'pos';

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load products from mock API
        products = window.mockApi.getProducts();
        
        // Set up navigation
        setupNavigation();
        
        // Set up category filters
        setupCategoryFilters();
        
        // Load default page (POS)
        loadPage('pos');
        
        // Initialize theme
        initializeTheme();
        
        // Set up cart buttons
        setupCartButtons();

        // Display initial menu items
        displayMenuItems();

        // Set up theme toggle
        setupThemeToggle();

        // Update current time
        updateCurrentTime();
        setInterval(updateCurrentTime, 60000); // Update every minute
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error initializing application', 'error');
    }
});

// Theme setup
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const html = document.documentElement;
            const isDark = html.getAttribute('data-bs-theme') === 'dark';
            html.setAttribute('data-bs-theme', isDark ? 'light' : 'dark');
            updateThemeIcon(!isDark);
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
        });
    }
}

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    updateThemeIcon(savedTheme === 'dark');
}

// Update theme icon
function updateThemeIcon(isDark) {
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Update current time
function updateCurrentTime() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString();
    }
}

// Navigation setup
function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.closest('.nav-link').getAttribute('data-page');
            if (page) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                e.target.closest('.nav-link').classList.add('active');
                loadPage(page);
            }
        });
    });
}

// Category filters setup
function setupCategoryFilters() {
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.getAttribute('data-category');
            document.querySelectorAll('.category-btn').forEach(btn => 
                btn.classList.remove('active'));
            e.target.classList.add('active');
            displayMenuItems(category === 'all' ? null : category);
        });
    });
}

// Cart buttons setup
function setupCartButtons() {
    const processOrderBtn = document.getElementById('process-order');
    const clearCartBtn = document.getElementById('clear-cart');

    if (processOrderBtn) {
        processOrderBtn.addEventListener('click', processOrder);
    }
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
}

// Display menu items
function displayMenuItems(category = null) {
    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer) return;

    const filteredProducts = category 
        ? products.filter(p => p.category === category)
        : products;

    menuContainer.innerHTML = filteredProducts.map(product => `
        <div class="col">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${product.productName}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text"><strong>₱${product.unitPrice.toFixed(2)}</strong></p>
                    <button class="btn btn-primary w-100 add-to-cart" data-product-id="${product.productID}">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners to the new Add to Cart buttons
    menuContainer.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-product-id');
            addToCart(productId);
        });
    });
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.productID === productId);
    if (!product) return;

    const existingItem = currentOrder.items.find(item => item.productID === productId);
    if (existingItem) {
        existingItem.quantity += 1;
        existingItem.subtotal = existingItem.quantity * product.unitPrice;
    } else {
        currentOrder.items.push({
            productID: product.productID,
            productName: product.productName,
            unitPrice: product.unitPrice,
            quantity: 1,
            subtotal: product.unitPrice
        });
    }

    currentOrder.total = currentOrder.items.reduce((sum, item) => sum + item.subtotal, 0);
    updateCartDisplay();
    showNotification('Item added to cart', 'success');
}

function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    
    if (!cartContainer || !totalElement) return;

    if (currentOrder.items.length === 0) {
        cartContainer.innerHTML = '<p class="text-muted">Cart is empty</p>';
    } else {
        cartContainer.innerHTML = currentOrder.items.map(item => `
            <div class="cart-item mb-2">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span>${item.productName}</span>
                        <div class="small text-muted">${item.quantity} x ₱${item.unitPrice.toFixed(2)}</div>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="me-2">₱${item.subtotal.toFixed(2)}</span>
                        <button class="btn btn-sm btn-danger remove-item" data-product-id="${item.productID}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners to remove buttons
        cartContainer.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.remove-item').getAttribute('data-product-id');
                removeFromCart(productId);
            });
        });
    }

    totalElement.textContent = `₱${currentOrder.total.toFixed(2)}`;
}

function removeFromCart(productId) {
    const index = currentOrder.items.findIndex(item => item.productID === productId);
    if (index !== -1) {
        currentOrder.items.splice(index, 1);
        currentOrder.total = currentOrder.items.reduce((sum, item) => sum + item.subtotal, 0);
        updateCartDisplay();
        showNotification('Item removed from cart', 'info');
    }
}

function clearCart() {
    currentOrder.items = [];
    currentOrder.total = 0;
    updateCartDisplay();
    showNotification('Cart cleared', 'info');
}

async function processOrder() {
    if (currentOrder.items.length === 0) {
        showNotification('Cart is empty', 'warning');
        return;
    }

    try {
        const orderData = {
            orderID: generateOrderID(),
            items: currentOrder.items,
            total: currentOrder.total,
            timestamp: new Date().toISOString()
        };

        await window.mockApi.createOrder(orderData);
        clearCart();
        showNotification('Order processed successfully', 'success');
    } catch (error) {
        console.error('Error processing order:', error);
        showNotification('Error processing order', 'error');
    }
}

// Load page content
function loadPage(page) {
    currentPage = page;
    const contentArea = document.querySelector('.container-fluid');
    if (!contentArea) return;

    switch (page) {
        case 'pos':
            contentArea.innerHTML = `
                <div class="row">
                    <div class="col-md-8">
                        <div class="card">
                            <div class="card-body">
                                <div class="category-filters mb-4">
                                    <button class="btn btn-primary active category-btn" data-category="all">All</button>
                                    <button class="btn btn-outline-primary category-btn" data-category="Coffee">Coffee</button>
                                    <button class="btn btn-outline-primary category-btn" data-category="Tea">Tea</button>
                                    <button class="btn btn-outline-primary category-btn" data-category="Pastries">Pastries</button>
                                    <button class="btn btn-outline-primary category-btn" data-category="Snacks">Snacks</button>
                                    <button class="btn btn-outline-primary category-btn" data-category="Beverages">Beverages</button>
                                </div>
                                <div id="menu-items" class="row row-cols-1 row-cols-md-3 g-4">
                                    <!-- Menu items will be loaded here -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">Current Order</h5>
                            </div>
                            <div class="card-body">
                                <div id="cart-items">
                                    <!-- Cart items will be displayed here -->
                                </div>
                                <div class="cart-total mt-3">
                                    <h5>Total: <span id="cart-total">₱0.00</span></h5>
                                </div>
                                <button id="process-order" class="btn btn-primary w-100 mt-3">Process Order</button>
                                <button id="clear-cart" class="btn btn-outline-danger w-100 mt-2">Clear Cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            setupCategoryFilters();
            setupCartButtons();
            displayMenuItems();
            break;
        // Add other page cases here
        default:
            contentArea.innerHTML = `<h2>Coming Soon</h2>`;
    }
}

// Utility functions
function generateOrderID() {
    return 'ORD' + Date.now().toString().slice(-6);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    notification.style.zIndex = '1050';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}
