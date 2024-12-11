const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get daily sales
router.get('/daily', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const sales = await Order.aggregate([
            {
                $match: {
                    orderDate: { $gte: today },
                    status: 'Completed'
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 },
                    items: { $push: '$items' }
                }
            }
        ]);

        res.json(sales[0] || { totalSales: 0, orderCount: 0, items: [] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get monthly sales report
router.get('/monthly', async (req, res) => {
    try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const sales = await Order.aggregate([
            {
                $match: {
                    orderDate: { $gte: startOfMonth },
                    status: 'Completed'
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$orderDate' } },
                    totalSales: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.json(sales);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get sales by category
router.get('/by-category', async (req, res) => {
    try {
        const sales = await Order.aggregate([
            {
                $unwind: '$items'
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productID',
                    foreignField: 'productID',
                    as: 'product'
                }
            },
            {
                $unwind: '$product'
            },
            {
                $group: {
                    _id: '$product.category',
                    totalSales: { $sum: '$items.subtotal' },
                    itemCount: { $sum: '$items.quantity' }
                }
            },
            {
                $sort: { totalSales: -1 }
            }
        ]);

        res.json(sales);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
