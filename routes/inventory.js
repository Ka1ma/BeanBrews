const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all inventory items
router.get('/', async (req, res) => {
    try {
        const inventory = await Product.find().select('productID productName category stockLevel unitPrice');
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get low stock items
router.get('/low-stock', async (req, res) => {
    try {
        const lowStockItems = await Product.find({ stockLevel: { $lt: 20 } })
            .select('productID productName category stockLevel');
        res.json(lowStockItems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update stock level
router.patch('/:id/stock', async (req, res) => {
    try {
        const product = await Product.findOne({ productID: req.params.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const newStockLevel = parseInt(req.body.stockLevel);
        if (isNaN(newStockLevel) || newStockLevel < 0) {
            return res.status(400).json({ message: 'Invalid stock level' });
        }

        product.stockLevel = newStockLevel;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Bulk update stock levels
router.post('/bulk-update', async (req, res) => {
    try {
        const updates = req.body.updates;
        if (!Array.isArray(updates)) {
            return res.status(400).json({ message: 'Invalid update format' });
        }

        const results = await Promise.all(
            updates.map(async update => {
                try {
                    const product = await Product.findOne({ productID: update.productID });
                    if (!product) {
                        return { productID: update.productID, status: 'error', message: 'Product not found' };
                    }

                    product.stockLevel = update.stockLevel;
                    await product.save();
                    return { productID: update.productID, status: 'success' };
                } catch (err) {
                    return { productID: update.productID, status: 'error', message: err.message };
                }
            })
        );

        res.json(results);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get inventory value
router.get('/value', async (req, res) => {
    try {
        const inventoryValue = await Product.aggregate([
            {
                $project: {
                    value: { $multiply: ['$stockLevel', '$unitPrice'] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalValue: { $sum: '$value' }
                }
            }
        ]);

        res.json({ totalValue: inventoryValue[0]?.totalValue || 0 });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
