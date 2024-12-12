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
  EmployeeID: { type: String, required: true },  // Updated casing
  OrderID: String,
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  ContactInfo: String,
  Role: String,
  Salary: mongoose.Types.Decimal128,
  HireDate: Date,
  Status: String,
  Address: String,
  Department: String,
});

const Employee = mongoose.model('Employee', EmployeeSchema);

// POST route to handle EMPLOYEE submission
app.post("/addEmployee", (req, res) => {
    console.log("Form data received:", req.body);
    
    const { EmployeeID, OrderID, FirstName, LastName, ContactInfo, Role, Salary, HireDate, Status, Address, Department,orderHistory } = req.body;

  // Create a new EMPLOYEE instance using the submitted data
  const newEmployee = new Employee({
    EmployeeID, 
    OrderID, 
    FirstName, 
    LastName, 
    ContactInfo, 
    Role, 
    Salary, 
    HireDate, 
    Status, 
    Address, 
    Department,
    orderHistory
  });

  // Save the new EMPLOYEE to the database
  newEmployee.save()
    .then(() => {
      console.log("Order placed successfully!");
      // Send a JSON response indicating success
      res.status(200).json({ success: true, message: 'Employee placed successfully' });
    })
    .catch((error) => {
      console.error("Error placing order:", error);
      res.status(500).json({ success: false, message: "There was an error adding an employee." });
    });
})

// Mongoose Schema for FINANCIALRECORD
const FinancialRecordSchema = new mongoose.Schema({
  Month: { type: String, required: true },  
  TotalSales: Decimal128,
  TotalExpenses: Decimal128,
  NetProfit: Decimal128,
  CategoryBreakdown: String,
});

const FinancialRecord = mongoose.model('FinancialRecord', FinancialRecordSchema);

// POST route to handle FINANCIALRECORD submission
app.post("/addFinancialRecord", (req, res) =>{
    console.log("Form data received:", req.body);
    
    const { Month, TotalSales, TotalExpenses,
    NetProfit, CategoryBreakdown } = req.body;

  // Create a new FINANCIALRECORD instance using the submitted data
  const newFinancialRecord = new FinancialRecord({
    Month, 
    TotalSales, 
    TotalExpenses,
    NetProfit, 
    CategoryBreakdown 
  });

  // Save the new FINANCIALRECORD to the database
  newFinancialRecord.save()
    .then(() => {
      console.log("Financial Record placed successfully!");
      // Send a JSON response indicating success
      res.status(200).json({ success: true, message: 'Financial Record placed successfully' });
    })
    .catch((error) => {
      console.error("Error updating Financial Record:", error);
      res.status(500).json({ success: false, message: "There was an error adding Financial Record." });
    });
})

// Mongoose Schema for INVENTORY
const InventorySchema = new mongoose.Schema({
    InventoryID: { type: Number, required: true }, // Fixed from Integer to Number
    CurrentStock: { type: Number, required: true },
    ReOrderLevel: { type: Number, required: true },
    LastRestockDate: { type: Date, required: true },
    SupplierID: { type: Number, required: true },
  });
  
  const Inventory = mongoose.model('Inventory ', InventorySchema);
  
  // POST route to handle INVENTORY submission
  app.post("/addInventory", (req, res) =>{
      console.log("Form data received:", req.body);
      
      const { InventoryID, CurrentStock,
        ReOrderLevel,
        LastRestockDate,
        SupplierID } = req.body;
  
    // Create a new INVENTORY instance using the submitted data
    const newInventory = new Inventory({
        InventoryID,
        CurrentStock,
        ReOrderLevel,
        LastRestockDate,
        SupplierID 
    });
  
    // Save the new INVENTORY to the database
    newInventory.save()
      .then(() => {
        console.log("Inventory Record placed successfully!");
        // Send a JSON response indicating success
        res.status(200).json({ success: true, message: 'Inventory Record placed successfully' });
      })
      .catch((error) => {
        console.error("Error updating Inventory Record:", error);
        res.status(500).json({ success: false, message: "There was an error updating Inventory Record." });
      });
  })  


// Mongoose Schema for ORDER
const OrderSchema = new mongoose.Schema({
    orderID: { type: String, required: true }, // Order ID
    orderDate: { type: Date, default: Date.now }, // Order Date with default
    totalAmount: { type: Decimal128, required: true }, // Total Amount
    paymentMethod: { 
      type: String, 
      enum: ["cash", "gcash"], // Restrict to cash or gcash
      required: true 
    }, // Payment Method
    gcashRefNumber: { 
      type: String, 
      required: function () {
        return this.paymentMethod === "gcash";
      }, // Only required if paymentMethod is "gcash"
    }, // GCash Reference Number
    products: [
      {
        productID: { type: String, required: true }, // Product ID
        productName: { type: String, required: true }, // Product Name
        quantity: { type: Number, required: true }, // Quantity
        pricePerUnit: { type: Decimal128, required: true }, // Price Per Unit
      }
    ] // Array of product objects
  });
    
  const Order = mongoose.model('Order ', OrderSchema);
  
  // POST route to handle ORDER submission
  app.post("/addOrder", (req, res) => {
    console.log("Form data received:", req.body);

    // Check for missing fields
    if (!req.body.orderID || !req.body.orderDate || !req.body.totalAmount || !req.body.paymentMethod || !req.body.products || (req.body.paymentMethod === 'gcash' && !req.body.gcashRefNumber)) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    // Destructure the required fields from the request body
    const { 
      orderID, 
      orderDate, 
      totalAmount, 
      paymentMethod, 
      gcashRefNumber, 
      products 
    } = req.body;

    // Create a new ORDER instance using the submitted data
    const newOrder = new Order({
        orderID, // Order ID
        orderDate, // Order Date
        totalAmount, // Total Amount
        paymentMethod, // Payment Method
        gcashRefNumber, // GCash Reference Number (if applicable)
        products // Array of product objects
    });

    // Save the new ORDER to the database
    newOrder.save()
      .then(() => {
        console.log("Order Record placed successfully!");
        // Send a JSON response indicating success
        res.status(200).json({ success: true, message: 'Order Record placed successfully' });
      })
      .catch((error) => {
        console.error("Error details:", error);
        console.error("Error updating Order Record:", error);
        res.status(500).json({ success: false, message: `There was an error updating Order Record: ${error.message}` });
      });
  })  


// Mongoose Schema for PRODUCT
  const ProductSchema = new mongoose.Schema({
    ProductID: { type: String, required: true },  // Product ID
    OrderID: String,                              // Order ID
    ProductName: { type: String, required: true },// Product Name
    Category: String,                             // Category
    PriceUnit: { type: mongoose.Types.Decimal128, required: true }, // Price Per Unit
    StockLevel: { type: Number, required: true }, // Stock Level
});

// Create the Product model
const Product = mongoose.model('Product', ProductSchema);

// POST route to handle PRODUCT submission
app.post('/addProduct', (req, res) => {
    console.log('Form data received:', req.body);

    // Destructure and log fields
    const { ProductID, OrderID, ProductName, Category, PriceUnit, StockLevel } = req.body;
    console.log({
        ProductID,
        OrderID,
        ProductName,
        Category,
        PriceUnit,
        StockLevel,
    });

    // Validate required fields
    if (!ProductID || !PriceUnit || !StockLevel) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Create a new product
    const newProduct = new Product({
        ProductID,
        OrderID,
        ProductName,
        Category,
        PriceUnit: mongoose.Types.Decimal128.fromString(String(PriceUnit)),
        StockLevel,
    });

    // Save the product to the database
    newProduct
        .save()
        .then(() => {
            console.log('Product Record placed successfully!');
            res.status(200).json({ success: true, message: 'Product Record placed successfully' });
        })
        .catch((error) => {
            console.error('Error updating Product Record:', error);
            res.status(500).json({ success: false, message: 'There was an error updating Product Record.' });
        });
});

// Mongoose Schema for SALESTRANSACTION
const SalesTransactionschema = new mongoose.Schema({
    Date: { type: Date, required: true },
    ProductID: { type: Number, required: true },
    QuantitySold: { type: Number, required: true },
    TotalSalesAmount: { type: mongoose.Types.Decimal128, required: true },
  });
  
  const SalesTransaction = mongoose.model('SalesTransaction', SalesTransactionschema);
  
  // POST route to handle SALESTRANSACTION submission
  app.post("/addSalesTransaction", (req, res) =>{
      console.log("Form data received:", req.body);
      
      const { TransactionID,  
      Date,
      ProductID,
      QuantitySold, 
      TotalSalesAmount } = req.body;
  
    // Create a new SALESTRANSACTION instance using the submitted data
    const newSalesTransaction = new SalesTransaction({
      TransactionID,  
      Date,
      ProductID,
      QuantitySold, 
      TotalSalesAmount 
    });
  
    // Save the new SALESTRANSACTION to the database
    newSalesTransaction.save()
      .then(() => {
        console.log("Sales Transaction Record placed successfully!");
        // Send a JSON response indicating success
        res.status(200).json({ success: true, message: 'Sales Transaction Record placed successfully' });
      })
      .catch((error) => {
        console.error("Error updating Sales Transaction Record:", error);
        res.status(500).json({ success: false, message: "There was an error updating Sales Transaction Record." });
      });
  })  


  // Mongoose Schema for SUPPLIER
  const SupplierSchema = new mongoose.Schema({
    SupplierID : { type: String, required: true },  
    InventoryID: Number,
    SupplierName: String,
    ContactNumber:String, 
    Address: String,
    SuppliedItems: Array
  });
  
  const Supplier = mongoose.model('Supplier', SupplierSchema);
  
  // POST route to handle SUPPLIER submission
  app.post("/addSupplier", (req, res) =>{
      console.log("Form data received:", req.body);
      
      const { SupplierID,  
        InventoryID,
        SupplierName,
        ContactNumber,
        Address, 
        SuppliedItems } = req.body;        
  
    // Create a new SUPPLIER instance using the submitted data
    const newSupplier = new Supplier({
      SupplierID,  
      InventoryID,
      SupplierName,
      ContactNumber, 
      Address,
      SuppliedItems
    });
  
    // Save the new SUPPLIER to the database
    newSupplier.save()
      .then(() => {
        console.log("Supplier Record placed successfully!");
        // Send a JSON response indicating success
        res.status(200).json({ success: true, message: 'Supplier Record placed successfully' });
      })
      .catch((error) => {
        console.error("Error updating Supplier Record:", error);
        res.status(500).json({ success: false, message: "There was an error updating Supplier Record." });
      });
  })  


  // Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public"))); // Added to serve static files (HTML, CSS, JS, etc.)

// Route for supplier.html 
app.get("/supplier", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "supplier.html")); 
  });

// Route for contact.html 
app.get("/product", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "product.html")); 
  });
   
// Route for faq.html 
app.get("/order", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "order.html")); 
  });

// Route for FinancialRecord.html 
app.get("/financialRecord", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "financialRecord.html")); 
  });

  // Route for inventory.html 
app.get("/inventory", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "inventory.html")); 
  });

// Route for menu.html 
app.get("/salesTransaction", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "salesTransaction.html")); 
  });

// Route for the homepage (serve the index.html file)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // Updated to serve index.html from the "public" folder
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});