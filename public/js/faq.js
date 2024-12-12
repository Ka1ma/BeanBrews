document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        item.querySelector('h3').addEventListener('click', () => {
            item.classList.toggle('open');
        });
    });
});
