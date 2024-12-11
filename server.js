const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb+srv://makai:makai1234567@cluster0.ngww4.mongodb.net/beanbrews?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Atlas Connected Successfully'))
    .catch(err => console.error('MongoDB Atlas Connection Error:', err));

// Models
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');
const Inventory = require('./models/Inventory');
const Employee = require('./models/Employee');

// API Routes
app.get('/api/menu', async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Orders routes
app.get('/api/orders', async (req, res) => {
    try {
        // Mock data for now - replace with actual database query
        const orders = [
            {
                orderId: 'ORD001',
                date: new Date(),
                customer: 'John Doe',
                items: [{ name: 'Coffee', quantity: 2 }],
                total: 8.50,
                status: 'pending'
            }
        ];
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
});

// Sales routes
app.get('/api/sales/summary', async (req, res) => {
    try {
        // Mock data for now - replace with actual database query
        const summary = {
            todaySales: 450.75,
            weeklySales: 3200.50,
            monthlySales: 12500.00,
            totalOrders: 145
        };
        res.json(summary);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching sales summary' });
    }
});

app.get('/api/sales/chart', async (req, res) => {
    try {
        // Mock data for now - replace with actual database query
        const dates = Array.from({length: 7}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toLocaleDateString();
        }).reverse();
        
        const sales = [320.50, 450.75, 280.25, 520.00, 380.50, 420.75, 550.25];
        res.json({ dates, sales });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching chart data' });
    }
});

app.get('/api/sales/top-items', async (req, res) => {
    try {
        // Mock data for now - replace with actual database query
        const topItems = [
            { name: 'Cappuccino', quantitySold: 145, revenue: 580.00, trend: 12 },
            { name: 'Latte', quantitySold: 130, revenue: 520.00, trend: 8 },
            { name: 'Espresso', quantitySold: 120, revenue: 360.00, trend: -5 }
        ];
        res.json(topItems);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching top items' });
    }
});

// Customer routes
app.get('/api/customers/stats', async (req, res) => {
    try {
        // Mock data for now - replace with actual database query
        const stats = {
            totalCustomers: 150,
            newCustomers: 12,
            loyaltyMembers: 45,
            avgOrderValue: 25.50
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching customer stats' });
    }
});

app.get('/api/customers', async (req, res) => {
    try {
        // Mock data for now - replace with actual database query
        const customers = [
            {
                _id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                phone: '555-0123',
                isLoyaltyMember: true,
                totalOrders: 15,
                lastVisit: new Date()
            }
        ];
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching customers' });
    }
});

app.post('/api/customers', async (req, res) => {
    try {
        // Mock response - replace with actual database insert
        res.status(201).json({ message: 'Customer created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating customer' });
    }
});

app.delete('/api/customers/:id', async (req, res) => {
    try {
        // Mock response - replace with actual database delete
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting customer' });
    }
});

// Product routes
app.get('/api/products/stats', async (req, res) => {
    try {
        // Mock data for now - replace with actual database query
        const stats = {
            totalProducts: 45,
            totalCategories: 8,
            lowStock: 5,
            outOfStock: 2
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching product stats' });
    }
});

app.get('/api/products/categories', async (req, res) => {
    try {
        // Mock data for now - replace with actual database query
        const categories = [
            { _id: '1', name: 'Hot Coffee' },
            { _id: '2', name: 'Iced Coffee' },
            { _id: '3', name: 'Tea' },
            { _id: '4', name: 'Pastries' }
        ];
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching categories' });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        // Mock data for now - replace with actual database query
        const products = [
            {
                _id: '1',
                name: 'Cappuccino',
                category: { _id: '1', name: 'Hot Coffee' },
                price: 4.50,
                description: 'Classic cappuccino with rich espresso and steamed milk',
                imageUrl: 'images/cappuccino.jpg',
                stock: 100,
                lowStockAlert: 20
            }
        ];
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        // Mock response - replace with actual database insert
        res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating product' });
    }
});

app.post('/api/products/categories', async (req, res) => {
    try {
        // Mock response - replace with actual database insert
        res.status(201).json({ message: 'Category created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating category' });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        // Mock response - replace with actual database delete
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product' });
    }
});

app.delete('/api/products/categories/:id', async (req, res) => {
    try {
        // Mock response - replace with actual database delete
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting category' });
    }
});

// Inventory routes
app.get('/api/inventory/stats', async (req, res) => {
    try {
        const totalItems = await Inventory.countDocuments();
        const lowStockItems = await Inventory.countDocuments({
            $expr: { $lte: ['$currentStock', '$minStock'] }
        });
        const outOfStockItems = await Inventory.countDocuments({ currentStock: 0 });
        const totalValue = await Inventory.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: { $multiply: ['$currentStock', '$unitPrice'] } }
                }
            }
        ]);

        res.json({
            totalItems,
            lowStockItems,
            outOfStockItems,
            totalValue: totalValue[0]?.total || 0
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching inventory stats' });
    }
});

app.get('/api/inventory', async (req, res) => {
    try {
        const items = await Inventory.find().populate('category');
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching inventory' });
    }
});

app.post('/api/inventory', async (req, res) => {
    try {
        const newItem = new Inventory(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: 'Error creating inventory item' });
    }
});

app.post('/api/inventory/adjust', async (req, res) => {
    try {
        const { itemId, adjustment, reason } = req.body;
        const item = await Inventory.findById(itemId);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        item.currentStock += adjustment;
        item.lastUpdated = new Date();
        await item.save();

        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Error adjusting stock' });
    }
});

app.get('/api/inventory/export', async (req, res) => {
    try {
        const items = await Inventory.find().populate('category');
        const csvHeader = 'Name,Category,SKU,Current Stock,Min Stock,Unit Price\n';
        const csvRows = items.map(item => 
            `${item.name},${item.category.name},${item.sku},${item.currentStock},${item.minStock},${item.unitPrice}`
        ).join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=inventory.csv');
        res.send(csvHeader + csvRows);
    } catch (error) {
        res.status(500).json({ error: 'Error exporting inventory' });
    }
});

// Employee routes
app.get('/api/employees/stats', async (req, res) => {
    try {
        const totalEmployees = await Employee.countDocuments();
        const activeToday = await Employee.countDocuments({ status: 'active' });
        const onLeave = await Employee.countDocuments({ status: 'on_leave' });
        const performanceStats = await Employee.aggregate([
            {
                $group: {
                    _id: null,
                    avgPerformance: { $avg: '$performance' }
                }
            }
        ]);

        res.json({
            totalEmployees,
            activeToday,
            onLeave,
            avgPerformance: Math.round(performanceStats[0]?.avgPerformance || 0)
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching employee stats' });
    }
});

app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching employees' });
    }
});

app.get('/api/employees/schedule', async (req, res) => {
    try {
        const schedule = await Employee.find().select('firstName lastName shifts');
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching schedule' });
    }
});

app.post('/api/employees', async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Error creating employee' });
    }
});

app.delete('/api/employees/:id', async (req, res) => {
    try {
        const result = await Employee.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting employee' });
    }
});

// Serve the POS page as the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pos.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});