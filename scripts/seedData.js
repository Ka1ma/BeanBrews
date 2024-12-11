const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/beanbrews')
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.error('MongoDB Connection Error:', err));

const menuItems = [
    {
        name: "Classic Espresso",
        description: "Rich and bold espresso shot ☕",
        price: 3.50,
        category: "Coffee",
        image: "/images/products/espresso.svg"
    },
    {
        name: "Caramel Macchiato",
        description: "Espresso with steamed milk and vanilla, topped with caramel drizzle 🍯",
        price: 5.50,
        category: "Coffee",
        image: "/images/products/latte.svg"
    },
    {
        name: "Matcha Green Tea Latte",
        description: "Premium Japanese matcha with steamed milk 🍵",
        price: 5.50,
        category: "Tea",
        image: "/images/products/green-tea.svg"
    },
    {
        name: "Brown Sugar Boba Tea",
        description: "Milk tea with brown sugar pearls and cream foam 🧋",
        price: 6.00,
        category: "Tea",
        image: "/images/products/iced-lemon-tea.svg"
    },
    {
        name: "Butter Croissant",
        description: "Flaky, buttery croissant baked fresh daily 🥐",
        price: 3.50,
        category: "Pastries",
        image: "/images/products/croissant.svg"
    },
    {
        name: "Red Velvet Cruffin",
        description: "Croissant-muffin hybrid with cream cheese filling 🧁",
        price: 4.50,
        category: "Pastries",
        image: "/images/products/chocolate-muffin.svg"
    },
    {
        name: "Tiramisu",
        description: "Classic Italian dessert with coffee-soaked ladyfingers 🍰",
        price: 6.50,
        category: "Pastries",
        image: "/images/products/cookies.svg"
    },
    {
        name: "Dalgona Coffee",
        description: "Whipped coffee with cold milk, Instagram worthy! ✨",
        price: 6.00,
        category: "Coffee",
        image: "/images/products/iced-chocolate.svg"
    },
    {
        name: "Strawberry Matcha Latte",
        description: "Green tea latte with strawberry syrup and cream 🍓",
        price: 6.50,
        category: "Tea",
        image: "/images/products/green-tea.svg"
    }
];

async function seedData() {
    try {
        // Clear existing data
        await MenuItem.deleteMany({});
        console.log('Cleared existing menu items');

        // Insert new data
        await MenuItem.insertMany(menuItems);
        console.log('Successfully seeded menu items');

        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedData();
