const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const port = process.env.PORT || 3019; // Dynamic port for cloud hosting
const app = express();
const { Decimal128, Schema } = mongoose; // Required for Decimal128 and Schema usage

// Body-parser middleware for JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Atlas connection
mongoose.connect(atlasURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("Connected to MongoDB Atlas");
  }).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
  
  // Example route for health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "Server is running!", dbStatus: "Connected" });
  });

// MongoDB connection (Updated for MongoDB Atlas)
const atlasURI = 'mongodb+srv://test:test@cluster0.mongodb.net/BeanAndBrews?retryWrites=true&w=majority'; 
mongoose.connect(atlasURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB Atlas");
}).catch((error) => {
  console.error("Error connecting to MongoDB", error);
});

// Mongoose Schema for EMPLOYEE
const EmployeeSchema = new mongoose.Schema({
  employeeID: { type: String, required: true },  // Employee ID
  firstName: { type: String, required: true },lastName: { type: String, required: true },
  LastName: String,
  ContactInfo: String,
  Role: String,
  Salary: Decimal128,
  HireDate: Date,
  Status: String,
  Address: String,
  Department: String

  (property)orderHistory: [{
    orderID: { type: String, required: true },
    orderDate: { type: Date },
    totalAmount: { type: Schema.Types.Decimal128 }
  }]
});


//ARRAYS
const parentSchema = new Schema({
    // Array of order history entries for the parent document
    orderHistory: [{
      // References the Order schema using ObjectId, linking to individual Order documents
      orderID: { type: Schema.Types.ObjectId, ref: 'Order' },
      // Date when the order was made
      orderDate: { type: Date },
      // Total amount for the order, stored as a Decimal128 for precision
      totalAmount: { type: Schema.Types.Decimal128 }
    }]
  });

const Employee = mongoose.model('Employee', EmployeeSchema);

// POST route to handle EMPLOYEE submission
app.post("/addEmployee", (req, res) => {
    console.log("Form data received:", req.body);
    
    const { EmployeeID, OrderID, FirstName, LastName, ContactInfo, Role, } = req.body;
  





// Route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});