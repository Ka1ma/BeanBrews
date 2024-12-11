const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ productID: req.params.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create product
router.post('/', async (req, res) => {
    const product = new Product({
        productID: req.body.productID,
        productName: req.body.productName,
        category: req.body.category,
        unitPrice: req.body.unitPrice,
        stockLevel: req.body.stockLevel,
        image: req.body.image,
        description: req.body.description
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update product
router.patch('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ productID: req.params.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        Object.keys(req.body).forEach(key => {
            if (req.body[key] != null) {
                product[key] = req.body[key];
            }
        });

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ productID: req.params.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await product.remove();
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
