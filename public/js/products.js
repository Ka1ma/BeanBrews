document.addEventListener('DOMContentLoaded', function() {
    loadProductStats();
    loadCategories();
    loadProducts();

    // Set up search functionality
    const searchInput = document.getElementById('product-search');
    searchInput.addEventListener('input', debounce(function() {
        loadProducts();
    }, 300));

    // Set up filter functionality
    document.getElementById('category-filter').addEventListener('change', loadProducts);
    document.getElementById('status-filter').addEventListener('change', loadProducts);
});

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function loadProductStats() {
    try {
        const response = await fetch('/api/products/stats');
        const stats = await response.json();
        
        document.getElementById('total-products').textContent = stats.totalProducts;
        document.getElementById('total-categories').textContent = stats.totalCategories;
        document.getElementById('low-stock').textContent = stats.lowStock;
        document.getElementById('out-of-stock').textContent = stats.outOfStock;
    } catch (error) {
        console.error('Error loading product stats:', error);
    }
}

async function loadCategories() {
    try {
        const response = await fetch('/api/products/categories');
        const categories = await response.json();
        
        // Update category filter dropdown
        const categoryFilter = document.getElementById('category-filter');
        const addProductCategory = document.querySelector('#addProductForm select[name="category"]');
        
        const options = categories.map(category => 
            `<option value="${category._id}">${category.name}</option>`
        ).join('');
        
        categoryFilter.innerHTML = '<option value="">All Categories</option>' + options;
        addProductCategory.innerHTML = '<option value="">Select Category</option>' + options;
        
        // Update categories list in manage categories modal
        displayCategories(categories);
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadProducts() {
    const searchTerm = document.getElementById('product-search').value;
    const categoryId = document.getElementById('category-filter').value;
    const status = document.getElementById('status-filter').value;

    try {
        const response = await fetch(`/api/products?search=${encodeURIComponent(searchTerm)}&category=${categoryId}&status=${status}`);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('products-grid').innerHTML = 
            '<div class="col-12"><div class="alert alert-danger">Error loading products. Please try again later.</div></div>';
    }
}

function displayProducts(products) {
    const container = document.getElementById('products-grid');
    if (!products || products.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="alert alert-info">No products found.</div></div>';
        return;
    }

    const html = products.map(product => `
        <div class="col-md-4 col-lg-3 mb-4">
            <div class="card h-100">
                <img src="${product.imageUrl || 'images/default-product.jpg'}" 
                     class="card-img-top" 
                     alt="${product.name}"
                     style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted">${product.category.name}</p>
                    <p class="card-text">
                        <strong>Price:</strong> ${formatCurrency(product.price)}<br>
                        <strong>Stock:</strong> 
                        <span class="badge bg-${getStockStatusColor(product.stock, product.lowStockAlert)}">
                            ${product.stock} units
                        </span>
                    </p>
                </div>
                <div class="card-footer bg-transparent border-top-0">
                    <div class="btn-group w-100">
                        <button class="btn btn-sm btn-outline-primary" onclick="editProduct('${product._id}')">
                            <i class="bi bi-pencil"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${product._id}')">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

function getStockStatusColor(stock, lowStockAlert) {
    if (stock === 0) return 'danger';
    if (stock <= lowStockAlert) return 'warning';
    return 'success';
}

function displayCategories(categories) {
    const container = document.getElementById('categories-list');
    if (!categories || categories.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No categories found.</div>';
        return;
    }

    const html = categories.map(category => `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <span>${category.name}</span>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteCategory('${category._id}')">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `).join('');

    container.innerHTML = html;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function openAddProductModal() {
    const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
    modal.show();
}

function openCategoryModal() {
    const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
    modal.show();
}

async function saveProduct() {
    const form = document.getElementById('addProductForm');
    const formData = new FormData(form);
    
    const productData = {
        name: formData.get('name'),
        category: formData.get('category'),
        price: parseFloat(formData.get('price')),
        description: formData.get('description'),
        imageUrl: formData.get('imageUrl'),
        stock: parseInt(formData.get('stock')),
        lowStockAlert: parseInt(formData.get('lowStockAlert'))
    };

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
            modal.hide();
            form.reset();
            loadProducts();
            loadProductStats();
        } else {
            throw new Error('Failed to save product');
        }
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Error saving product. Please try again.');
    }
}

async function addCategory() {
    const categoryName = document.getElementById('newCategory').value.trim();
    if (!categoryName) return;

    try {
        const response = await fetch('/api/products/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: categoryName })
        });

        if (response.ok) {
            document.getElementById('newCategory').value = '';
            loadCategories();
            loadProductStats();
        } else {
            throw new Error('Failed to add category');
        }
    } catch (error) {
        console.error('Error adding category:', error);
        alert('Error adding category. Please try again.');
    }
}

async function deleteCategory(categoryId) {
    if (confirm('Are you sure you want to delete this category? This will affect all products in this category.')) {
        try {
            const response = await fetch(`/api/products/categories/${categoryId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                loadCategories();
                loadProductStats();
                loadProducts();
            } else {
                throw new Error('Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Error deleting category. Please try again.');
        }
    }
}

async function editProduct(productId) {
    // Implement edit product functionality
    console.log('Editing product:', productId);
}

async function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                loadProducts();
                loadProductStats();
            } else {
                throw new Error('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product. Please try again.');
        }
    }
}
