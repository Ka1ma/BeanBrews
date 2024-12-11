const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customerID')
            .populate('items.productID');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one order
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findOne({ orderID: req.params.id })
            .populate('customerID')
            .populate('items.productID');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create order
router.post('/', async (req, res) => {
    const session = await Order.startSession();
    session.startTransaction();

    try {
        // Calculate total amount and update stock levels
        let totalAmount = 0;
        for (const item of req.body.items) {
            const product = await Product.findOne({ productID: item.productID });
            if (!product) {
                throw new Error(`Product ${item.productID} not found`);
            }
            if (product.stockLevel < item.quantity) {
                throw new Error(`Insufficient stock for product ${product.productName}`);
            }

            // Update stock level
            product.stockLevel -= item.quantity;
            await product.save({ session });

            // Calculate item subtotal
            item.unitPrice = product.unitPrice;
            item.subtotal = item.quantity * product.unitPrice;
            totalAmount += item.subtotal;
        }

        const order = new Order({
            orderID: req.body.orderID,
            customerID: req.body.customerID,
            items: req.body.items,
            totalAmount: totalAmount,
            paymentMethod: req.body.paymentMethod,
            status: 'Pending'
        });

        const newOrder = await order.save({ session });
        await session.commitTransaction();
        
        res.status(201).json(newOrder);
    } catch (err) {
        await session.abortTransaction();
        res.status(400).json({ message: err.message });
    } finally {
        session.endSession();
    }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
    try {
        const order = await Order.findOne({ orderID: req.params.id });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = req.body.status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Cancel order
router.delete('/:id', async (req, res) => {
    const session = await Order.startSession();
    session.startTransaction();

    try {
        const order = await Order.findOne({ orderID: req.params.id });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Restore stock levels
        for (const item of order.items) {
            const product = await Product.findOne({ productID: item.productID });
            if (product) {
                product.stockLevel += item.quantity;
                await product.save({ session });
            }
        }

        order.status = 'Cancelled';
        await order.save({ session });
        await session.commitTransaction();
        
        res.json({ message: 'Order cancelled' });
    } catch (err) {
        await session.abortTransaction();
        res.status(500).json({ message: err.message });
    } finally {
        session.endSession();
    }
});

module.exports = router;
