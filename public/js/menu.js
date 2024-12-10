document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.menu-item button');
    const cart = [];

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemName = button.parentElement.querySelector('h3').textContent;
            const itemPrice = button.parentElement.querySelector('.price').textContent;

            cart.push({ name: itemName, price: itemPrice });
            console.log(`Added to cart: ${itemName} - ${itemPrice}`);
        });
    });
});
