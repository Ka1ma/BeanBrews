const mongoose = require('mongoose');
const Product = require('../models/Product');
const sampleProducts = require('../data/sampleProducts');

const uri = 'mongodb+srv://test:test@clusterbeanbrew.gcxuo.mongodb.net/BeanAndBrew?retryWrites=true&w=majority';

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    retryWrites: true,
    w: 'majority',
    dbName: 'BeanAndBrew'
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => console.error('MongoDB connection error:', err));

async function seedDatabase() {
    try {
        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert sample products
        await Product.insertMany(sampleProducts);
        console.log('Sample products inserted successfully');

        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
