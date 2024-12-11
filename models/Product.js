const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productID: {
        type: String,
        required: true,
        unique: true
    },
    productName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Coffee', 'Tea', 'Pastries', 'Snacks', 'Beverages']
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0
    },
    stockLevel: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        default: 'default-product.png'
    },
    description: {
        type: String
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
