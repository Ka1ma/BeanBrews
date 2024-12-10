require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection URI
const uri = process.env.MONGO_URI;

// Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;