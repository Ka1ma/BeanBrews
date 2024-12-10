document.addEventListener('DOMContentLoaded', () => {
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');

    dropdownItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.querySelector('.dropdown-menu').style.display = 'block';
        });

        item.addEventListener('mouseleave', () => {
            item.querySelector('.dropdown-menu').style.display = 'none';
        });
    });
});
