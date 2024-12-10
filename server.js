const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080; // Dynamic port for cloud hosting
const app = express();

// Required for Decimal128 and Schema usage
const { Decimal128, Schema } = mongoose; 

// MongoDB connection URI (define it first)
const atlasURI = "mongodb+srv://test:test@clusterbeanbrew.gcxuo.mongodb.net/BeanAndBrew?retryWrites=true&w=majority";

// Body-parser middleware for JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose
  .connect(atlasURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
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
})


// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public"))); // Added to serve static files (HTML, CSS, JS, etc.)

// Route for about.html 
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "about.html")); 
  });

// Route for contact.html 
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "contact.html")); 
  });
   
// Route for faq.html 
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "faq.html")); 
  });

// Route for forgotpassword.html 
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "forgotpassword.html")); 
  });

  // Route for login.html 
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html")); 
  });

// Route for menu.html 
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "menu.html")); 
  });

// Route for order.html 
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "order.html")); 
  });

// Route for signup.html 
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup.html")); 
  });

// Route for test.html 
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "test.html")); 
  });

// Route for trackorder.html 
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "trackorder.html")); 
  });

// Route for the homepage (serve the index.html file)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // Updated to serve index.html from the "public" folder
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});