const fs = require('fs');
const path = require('path');

const products = [
    { name: 'espresso', color: '#4A2C2A' },
    { name: 'cappuccino', color: '#8B4513' },
    { name: 'latte', color: '#D2691E' },
    { name: 'green-tea', color: '#90EE90' },
    { name: 'earl-grey', color: '#8B4513' },
    { name: 'croissant', color: '#DEB887' },
    { name: 'chocolate-muffin', color: '#3C1321' },
    { name: 'cookies', color: '#CD853F' },
    { name: 'iced-lemon-tea', color: '#FFD700' }
];

const generateSVG = (name, color) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="${color}" opacity="0.2"/>
    <circle cx="100" cy="100" r="60" fill="${color}" opacity="0.4"/>
    <circle cx="100" cy="100" r="40" fill="${color}"/>
    <text x="100" y="180" text-anchor="middle" font-family="Arial" font-size="16" fill="#333333">${name.replace(/-/g, ' ')}</text>
</svg>`;

const outputDir = path.join(__dirname, '..', 'public', 'images', 'products');

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Generate SVG files
products.forEach(product => {
    const svg = generateSVG(product.name, product.color);
    const filePath = path.join(outputDir, `${product.name}.svg`);
    fs.writeFileSync(filePath, svg);
    console.log(`Generated ${product.name}.svg`);
});
