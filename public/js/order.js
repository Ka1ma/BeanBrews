document.addEventListener('DOMContentLoaded', () => {
  const orderList = document.querySelector('.order-list');
  const totalElement = document.querySelector('.total');

  const cart = [
      { name: 'Espresso', quantity: 1, price: 3.0 },
      { name: 'Latte', quantity: 2, price: 4.0 },
      { name: 'Cappuccino', quantity: 1, price: 4.5 }
  ];

  let total = 0;

  cart.forEach(item => {
      const row = document.createElement('div');
      row.classList.add('item');
      row.innerHTML = `
          <span>${item.name}</span>
          <span class="quantity">x${item.quantity}</span>
          <span class="price">$${(item.price * item.quantity).toFixed(2)}</span>
      `;
      orderList.appendChild(row);

      total += item.price * item.quantity;
  });

  totalElement.textContent = `Total: $${total.toFixed(2)}`;
});
