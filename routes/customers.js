const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Order = require('../models/Order');

// Get all customers
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get customer by ID
router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findOne({ customerID: req.params.id });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new customer
router.post('/', async (req, res) => {
    const customer = new Customer({
        customerID: req.body.customerID,
        name: req.body.name,
        contactInfo: {
            email: req.body.contactInfo.email,
            phone: req.body.contactInfo.phone,
            address: req.body.contactInfo.address
        }
    });

    try {
        const newCustomer = await customer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update customer
router.patch('/:id', async (req, res) => {
    try {
        const customer = await Customer.findOne({ customerID: req.params.id });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        if (req.body.name) customer.name = req.body.name;
        if (req.body.contactInfo) {
            if (req.body.contactInfo.email) customer.contactInfo.email = req.body.contactInfo.email;
            if (req.body.contactInfo.phone) customer.contactInfo.phone = req.body.contactInfo.phone;
            if (req.body.contactInfo.address) customer.contactInfo.address = req.body.contactInfo.address;
        }

        const updatedCustomer = await customer.save();
        res.json(updatedCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get customer order history
router.get('/:id/orders', async (req, res) => {
    try {
        const orders = await Order.find({ customerID: req.params.id })
            .sort({ orderDate: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get customer statistics
router.get('/:id/stats', async (req, res) => {
    try {
        const orders = await Order.find({ 
            customerID: req.params.id,
            status: 'Completed'
        });

        const stats = {
            totalOrders: orders.length,
            totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0),
            averageOrderValue: orders.length > 0 
                ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length 
                : 0,
            frequentItems: await getFrequentItems(orders)
        };

        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Helper function to get frequent items
async function getFrequentItems(orders) {
    const itemCounts = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            if (itemCounts[item.productID]) {
                itemCounts[item.productID] += item.quantity;
            } else {
                itemCounts[item.productID] = item.quantity;
            }
        });
    });

    return Object.entries(itemCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([productID, count]) => ({ productID, count }));
}

module.exports = router;
