const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword
} = require('../controllers/authController');

// Auth middleware
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      message: 'Please log in to access this resource'
    });
  }
  next();
};

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', isAuthenticated, getCurrentUser);
router.put('/profile', isAuthenticated, updateProfile);
router.put('/password', isAuthenticated, changePassword);

module.exports = router;
