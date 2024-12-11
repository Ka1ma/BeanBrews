document.addEventListener('DOMContentLoaded', function() {
    loadSalesData();
    initializeSalesChart();
    loadTopItems();
});

async function loadSalesData() {
    try {
        const response = await fetch('/api/sales/summary');
        const data = await response.json();
        updateSalesStats(data);
    } catch (error) {
        console.error('Error loading sales data:', error);
    }
}

function updateSalesStats(data) {
    document.getElementById('today-sales').textContent = formatCurrency(data.todaySales);
    document.getElementById('weekly-sales').textContent = formatCurrency(data.weeklySales);
    document.getElementById('monthly-sales').textContent = formatCurrency(data.monthlySales);
    document.getElementById('total-orders').textContent = data.totalOrders;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function initializeSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    const salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Will be populated with dates
            datasets: [{
                label: 'Daily Sales',
                data: [], // Will be populated with sales data
                borderColor: '#4169E1',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Daily Sales Trend'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    });

    // Load chart data
    loadChartData(salesChart);
}

async function loadChartData(chart) {
    try {
        const response = await fetch('/api/sales/chart');
        const data = await response.json();
        
        chart.data.labels = data.dates;
        chart.data.datasets[0].data = data.sales;
        chart.update();
    } catch (error) {
        console.error('Error loading chart data:', error);
    }
}

async function loadTopItems() {
    try {
        const response = await fetch('/api/sales/top-items');
        const items = await response.json();
        displayTopItems(items);
    } catch (error) {
        console.error('Error loading top items:', error);
    }
}

function displayTopItems(items) {
    const container = document.getElementById('top-items');
    if (!items || items.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No sales data available.</div>';
        return;
    }

    let html = `
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity Sold</th>
                        <th>Revenue</th>
                        <th>Trend</th>
                    </tr>
                </thead>
                <tbody>
    `;

    items.forEach(item => {
        html += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantitySold}</td>
                <td>${formatCurrency(item.revenue)}</td>
                <td>
                    <span class="badge bg-${getTrendColor(item.trend)}">
                        ${item.trend >= 0 ? '+' : ''}${item.trend}%
                    </span>
                </td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;
}

function getTrendColor(trend) {
    if (trend > 0) return 'success';
    if (trend < 0) return 'danger';
    return 'secondary';
}
