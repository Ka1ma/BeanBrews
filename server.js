const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Mock API Routes (for development)
const mockApi = {
    getProducts: () => require('./mockData/products.json'),
    getOrders: () => require('./mockData/orders.json'),
    createOrder: (order) => {
        console.log('Order created:', order);
        return { success: true, order };
    }
};

// API Routes
app.get('/api/products', (req, res) => {
    res.json(mockApi.getProducts());
});

app.get('/api/orders', (req, res) => {
    res.json(mockApi.getOrders());
});

app.post('/api/orders', (req, res) => {
    const result = mockApi.createOrder(req.body);
    res.json(result);
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});