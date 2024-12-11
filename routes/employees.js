const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Employee login
router.post('/login', async (req, res) => {
    try {
        const employee = await Employee.findOne({ email: req.body.email });
        if (!employee) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const validPassword = await employee.checkPassword(req.body.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: employee._id, role: employee.position },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            employee: {
                id: employee._id,
                name: employee.name,
                position: employee.position
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all employees (requires authentication)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const employees = await Employee.find()
            .select('-password')
            .sort({ position: 1, name: 1 });
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new employee (requires manager role)
router.post('/', authenticateToken, async (req, res) => {
    if (req.user.role !== 'Manager') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const employee = new Employee({
            employeeID: req.body.employeeID,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            position: req.body.position
        });

        const newEmployee = await employee.save();
        res.status(201).json({
            ...newEmployee.toObject(),
            password: undefined
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update employee
router.patch('/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'Manager' && req.user.id !== req.params.id) {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const employee = await Employee.findOne({ employeeID: req.params.id });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        if (req.body.name) employee.name = req.body.name;
        if (req.body.email) employee.email = req.body.email;
        if (req.body.password) employee.password = req.body.password;
        if (req.body.position && req.user.role === 'Manager') {
            employee.position = req.body.position;
        }

        const updatedEmployee = await employee.save();
        res.json({
            ...updatedEmployee.toObject(),
            password: undefined
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get employee performance
router.get('/:id/performance', authenticateToken, async (req, res) => {
    try {
        const employee = await Employee.findOne({ employeeID: req.params.id })
            .select('name totalSales feedbackScore shiftsWorked');
        
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json(employee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
