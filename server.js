const express = require('express');
const connectDB = require('./db'); // Import the database connection function

// Initialize Express App
const app = express();

// Middleware to Parse JSON
app.use(express.json());

// Connect to MongoDB Atlas
connectDB();

// Define Routes
app.get('/', (req, res) => {
  res.send('Welcome to BeanBrews API!');
});

// Start Server
const PORT = process.env.PORT || 5001; // Use port 5001 or another unused port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});