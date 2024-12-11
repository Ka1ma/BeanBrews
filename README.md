# BeanBrews Cafe Management System

A modern Point of Sale (POS) and Cafe Management System built with Node.js, Express, and MongoDB.

## Features

- 🏪 Point of Sale System
- 📊 Sales Analytics
- 📦 Inventory Management
- 👥 Customer Management
- 👨‍💼 Employee Management
- 📈 Financial Reports

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/beanbrews.git
cd beanbrews
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory with the following variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/beanbrews
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

4. Seed the database with sample data:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
beanbrews/
├── models/          # Database models
├── routes/          # API routes
├── public/          # Static files
│   ├── css/        # Stylesheets
│   ├── js/         # Client-side JavaScript
│   └── images/     # Images and assets
├── data/           # Sample data
├── scripts/        # Utility scripts
└── server.js       # Main application file
```

## API Endpoints

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get single product
- POST /api/products - Create new product
- PATCH /api/products/:id - Update product
- DELETE /api/products/:id - Delete product

### Orders
- GET /api/orders - Get all orders
- POST /api/orders - Create new order
- PATCH /api/orders/:id/status - Update order status

### Inventory
- GET /api/inventory - Get inventory status
- GET /api/inventory/low-stock - Get low stock items
- PATCH /api/inventory/:id/stock - Update stock level

### Sales
- GET /api/sales/daily - Get daily sales report
- GET /api/sales/monthly - Get monthly sales report
- GET /api/sales/by-category - Get sales by category

## License

This project is licensed under the ISC License.

## Support

For support, please contact support@beanbrews.com
