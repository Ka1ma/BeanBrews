const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generateImages() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Generate logo
    await page.goto(`file:${path.join(__dirname, '../public/images/logo/logo-generator.html')}`);
    const logoCanvas = await page.$('#logoCanvas');
    const logoImage = await logoCanvas.screenshot({
        path: path.join(__dirname, '../public/images/logo/logo.png')
    });

    // Generate product images
    await page.goto(`file:${path.join(__dirname, '../public/images/products/image-generator.html')}`);
    const productCanvas = await page.$('#productCanvas');
    
    const products = [
        'espresso', 'cappuccino', 'latte', 'green-tea', 'earl-grey',
        'croissant', 'chocolate-muffin', 'chicken-sandwich', 'orange-juice', 'iced-chocolate'
    ];

    for (const product of products) {
        await page.evaluate((name) => {
            const canvas = document.getElementById('productCanvas');
            const ctx = canvas.getContext('2d');
            drawProduct(name.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
        }, product);

        await productCanvas.screenshot({
            path: path.join(__dirname, `../public/images/products/${product}.jpg`)
        });
    }

    await browser.close();
    console.log('All images generated successfully!');
}

generateImages().catch(console.error);
