// Mock API implementation
window.mockApi = {
    products: [
        {
            productID: 'COFFEE001',
            productName: 'Espresso',
            category: 'Coffee',
            unitPrice: 120.00,
            description: 'Strong brewed coffee'
        },
        {
            productID: 'COFFEE002',
            productName: 'Cappuccino',
            category: 'Coffee',
            unitPrice: 150.00,
            description: 'Espresso with steamed milk foam'
        },
        {
            productID: 'COFFEE003',
            productName: 'Latte',
            category: 'Coffee',
            unitPrice: 150.00,
            description: 'Espresso with steamed milk'
        },
        {
            productID: 'TEA001',
            productName: 'Green Tea',
            category: 'Tea',
            unitPrice: 100.00,
            description: 'Traditional green tea'
        },
        {
            productID: 'TEA002',
            productName: 'Earl Grey',
            category: 'Tea',
            unitPrice: 100.00,
            description: 'Black tea with bergamot oil'
        },
        {
            productID: 'PASTRY001',
            productName: 'Croissant',
            category: 'Pastries',
            unitPrice: 80.00,
            description: 'Buttery, flaky pastry'
        },
        {
            productID: 'PASTRY002',
            productName: 'Chocolate Muffin',
            category: 'Pastries',
            unitPrice: 90.00,
            description: 'Rich chocolate muffin'
        },
        {
            productID: 'SNACK001',
            productName: 'Cookies',
            category: 'Snacks',
            unitPrice: 60.00,
            description: 'Chocolate chip cookies'
        },
        {
            productID: 'BEV001',
            productName: 'Iced Lemon Tea',
            category: 'Beverages',
            unitPrice: 110.00,
            description: 'Refreshing iced tea with lemon'
        }
    ],

    orders: [],

    // Get all products
    getProducts: async function() {
        return Promise.resolve([...this.products]);
    },

    // Get product by ID
    getProduct: async function(productId) {
        const product = this.products.find(p => p.productID === productId);
        return Promise.resolve(product || null);
    },

    // Create new order
    createOrder: async function(orderData) {
        this.orders.push({
            ...orderData,
            createdAt: new Date().toISOString()
        });
        return Promise.resolve({ success: true, orderId: orderData.orderID });
    },

    // Get all orders
    getOrders: async function() {
        return Promise.resolve([...this.orders]);
    }
};
