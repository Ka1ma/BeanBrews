document.addEventListener('DOMContentLoaded', function() {
    loadInventoryStats();
    loadCategories();
    loadInventory();

    // Set up search functionality
    const searchInput = document.getElementById('inventory-search');
    searchInput.addEventListener('input', debounce(function() {
        loadInventory();
    }, 300));

    // Set up filter functionality
    document.getElementById('category-filter').addEventListener('change', loadInventory);
    document.getElementById('stock-status-filter').addEventListener('change', loadInventory);
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

async function loadInventoryStats() {
    try {
        const response = await fetch('/api/inventory/stats');
        const stats = await response.json();
        
        document.getElementById('total-items').textContent = stats.totalItems;
        document.getElementById('low-stock-items').textContent = stats.lowStockItems;
        document.getElementById('out-of-stock-items').textContent = stats.outOfStockItems;
        document.getElementById('total-value').textContent = formatCurrency(stats.totalValue);
    } catch (error) {
        console.error('Error loading inventory stats:', error);
    }
}

async function loadCategories() {
    try {
        const response = await fetch('/api/inventory/categories');
        const categories = await response.json();
        
        // Update category filter dropdown
        const categoryFilter = document.getElementById('category-filter');
        const addInventoryCategory = document.querySelector('#addInventoryForm select[name="category"]');
        
        const options = categories.map(category => 
            `<option value="${category._id}">${category.name}</option>`
        ).join('');
        
        categoryFilter.innerHTML = '<option value="">All Categories</option>' + options;
        addInventoryCategory.innerHTML = '<option value="">Select Category</option>' + options;
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadInventory() {
    const searchTerm = document.getElementById('inventory-search').value;
    const categoryId = document.getElementById('category-filter').value;
    const stockStatus = document.getElementById('stock-status-filter').value;

    try {
        const response = await fetch(
            `/api/inventory?search=${encodeURIComponent(searchTerm)}&category=${categoryId}&status=${stockStatus}`
        );
        const inventory = await response.json();
        displayInventory(inventory);
    } catch (error) {
        console.error('Error loading inventory:', error);
        document.getElementById('inventory-table-body').innerHTML = `
            <tr>
                <td colspan="9" class="text-center">Error loading inventory. Please try again later.</td>
            </tr>
        `;
    }
}

function displayInventory(items) {
    const tableBody = document.getElementById('inventory-table-body');
    if (!items || items.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">No inventory items found.</td>
            </tr>
        `;
        return;
    }

    const html = items.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.category.name}</td>
            <td>${item.sku}</td>
            <td>
                <span class="badge bg-${getStockStatusColor(item.currentStock, item.minStock)}">
                    ${item.currentStock} ${item.unit}
                </span>
            </td>
            <td>${item.minStock} ${item.unit}</td>
            <td>${formatCurrency(item.unitPrice)}</td>
            <td>${formatCurrency(item.currentStock * item.unitPrice)}</td>
            <td>${formatDate(item.lastUpdated)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="quickAdjust('${item._id}')">
                    <i class="bi bi-plus-slash-minus"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary me-1" onclick="viewHistory('${item._id}')">
                    <i class="bi bi-clock-history"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteInventoryItem('${item._id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    tableBody.innerHTML = html;
}

function getStockStatusColor(currentStock, minStock) {
    if (currentStock === 0) return 'danger';
    if (currentStock <= minStock) return 'warning';
    return 'success';
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
}

function openAddInventoryModal() {
    const modal = new bootstrap.Modal(document.getElementById('addInventoryModal'));
    modal.show();
}

function openStockAdjustmentModal() {
    loadInventoryItems();
    const modal = new bootstrap.Modal(document.getElementById('stockAdjustmentModal'));
    modal.show();
}

async function loadInventoryItems() {
    try {
        const response = await fetch('/api/inventory/items');
        const items = await response.json();
        
        const itemSelect = document.querySelector('#stockAdjustmentForm select[name="item"]');
        itemSelect.innerHTML = '<option value="">Select Item</option>' + 
            items.map(item => `
                <option value="${item._id}">${item.name} (${item.currentStock} ${item.unit})</option>
            `).join('');
    } catch (error) {
        console.error('Error loading inventory items:', error);
    }
}

async function saveInventoryItem() {
    const form = document.getElementById('addInventoryForm');
    const formData = new FormData(form);
    
    const itemData = {
        name: formData.get('name'),
        category: formData.get('category'),
        sku: formData.get('sku'),
        currentStock: parseInt(formData.get('stock')),
        minStock: parseInt(formData.get('minStock')),
        unitPrice: parseFloat(formData.get('unitPrice')),
        unit: formData.get('unit')
    };

    try {
        const response = await fetch('/api/inventory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemData)
        });

        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('addInventoryModal'));
            modal.hide();
            form.reset();
            loadInventory();
            loadInventoryStats();
        } else {
            throw new Error('Failed to save inventory item');
        }
    } catch (error) {
        console.error('Error saving inventory item:', error);
        alert('Error saving inventory item. Please try again.');
    }
}

async function saveStockAdjustment() {
    const form = document.getElementById('stockAdjustmentForm');
    const formData = new FormData(form);
    
    const adjustmentData = {
        itemId: formData.get('item'),
        type: formData.get('adjustmentType'),
        quantity: parseInt(formData.get('quantity')),
        reason: formData.get('reason')
    };

    try {
        const response = await fetch('/api/inventory/adjust', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adjustmentData)
        });

        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('stockAdjustmentModal'));
            modal.hide();
            form.reset();
            loadInventory();
            loadInventoryStats();
        } else {
            throw new Error('Failed to save stock adjustment');
        }
    } catch (error) {
        console.error('Error saving stock adjustment:', error);
        alert('Error saving stock adjustment. Please try again.');
    }
}

async function quickAdjust(itemId) {
    // Pre-select the item in the stock adjustment modal
    await loadInventoryItems();
    document.querySelector('#stockAdjustmentForm select[name="item"]').value = itemId;
    openStockAdjustmentModal();
}

async function viewHistory(itemId) {
    // Implement view history functionality
    console.log('Viewing history for item:', itemId);
}

async function deleteInventoryItem(itemId) {
    if (confirm('Are you sure you want to delete this inventory item?')) {
        try {
            const response = await fetch(`/api/inventory/${itemId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                loadInventory();
                loadInventoryStats();
            } else {
                throw new Error('Failed to delete inventory item');
            }
        } catch (error) {
            console.error('Error deleting inventory item:', error);
            alert('Error deleting inventory item. Please try again.');
        }
    }
}

function exportInventory() {
    // Create CSV content
    fetch('/api/inventory/export')
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error('Error exporting inventory:', error);
            alert('Error exporting inventory. Please try again.');
        });
}
