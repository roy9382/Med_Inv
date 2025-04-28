// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const currentDateElement = document.getElementById('current-date');
const searchInput = document.getElementById('search-input');

// Set current date
if (currentDateElement) {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = now.toLocaleDateString('en-US', options);
}

// Theme toggle functionality
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        
        // Update icon
        const icon = themeToggle.querySelector('i');
        if (body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Check for saved theme preference
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
    
    // Fix navigation links to ensure they point to the correct pages
    fixNavigationLinks();
    
    // Initialize charts if they exist on the page
    initCharts();
    
    // Initialize settings tabs if they exist
    initSettingsTabs();

    // Initialize search functionality
    initSearchFunctionality();
});

// Fix navigation links to ensure they point to the correct pages
function fixNavigationLinks() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Get the href attribute
            const href = this.getAttribute('href');
            
            // If we're already on this page, prevent default action
            if (window.location.pathname.endsWith(href)) {
                e.preventDefault();
                return;
            }
            
            // Otherwise, let the browser navigate normally
        });
    });
}

// Mobile menu toggle
const menuToggle = document.createElement('button');
menuToggle.classList.add('menu-toggle');
menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
document.querySelector('header .header-content')?.prepend(menuToggle);

menuToggle.addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('show');
});


function initCharts() {
    if (document.getElementById('sales-chart')) {
        const salesChart = new Chart(document.getElementById('sales-chart'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Sales',
                    data: [6500, 5900, 8000, 8100, 9600, 10000],
                    borderColor: '#6a5acd',
                    tension: 0.3,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    if (document.getElementById('inventory-chart')) {
        const inventoryChart = new Chart(document.getElementById('inventory-chart'), {
            type: 'doughnut',
            data: {
                labels: ['In Stock', 'Low Stock', 'Out of Stock'],
                datasets: [{
                    data: [65, 15, 20],
                    backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    if (document.getElementById('expiry-chart')) {
        const expiryChart = new Chart(document.getElementById('expiry-chart'), {
            type: 'bar',
            data: {
                labels: ['This Month', '1-3 Months', '3-6 Months', '6+ Months'],
                datasets: [{
                    label: 'Products Expiring',
                    data: [10, 15, 25, 100],
                    backgroundColor: '#9370db'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}


function initSettingsTabs() {
    const settingsLinks = document.querySelectorAll('.settings-nav a');
    if (settingsLinks.length > 0) {
        settingsLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links
                document.querySelectorAll('.settings-nav li').forEach(item => {
                    item.classList.remove('active');
                });
                document.querySelectorAll('.settings-section').forEach(section => {
                    section.classList.remove('active');
                });
                
                // Add active class to clicked link
                link.parentElement.classList.add('active');
                
                // Show corresponding section
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            });
        });
    }
}


function initSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const stockFilter = document.getElementById('stock-filter');

    function filterProducts() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        const selectedStock = stockFilter ? stockFilter.value : 'all';

        const productCards = document.querySelectorAll('.products-grid .product-card');

        productCards.forEach(card => {
            const category = card.querySelector('.category').textContent.toLowerCase();
            const stockStatus = card.querySelector('.product-badge').classList.contains('in-stock') ? 'in-stock' :
                                card.querySelector('.product-badge').classList.contains('low-stock') ? 'low-stock' :
                                card.querySelector('.product-badge').classList.contains('out-of-stock') ? 'out-of-stock' : '';

            const categoryMatch = (selectedCategory === 'all') || (category === selectedCategory);
            const stockMatch = (selectedStock === 'all') || (stockStatus === selectedStock);

            if (categoryMatch && stockMatch && card.textContent.toLowerCase().includes(searchTerm)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    if (stockFilter) {
        stockFilter.addEventListener('change', filterProducts);
    }
}


document.getElementById("theme-toggle")?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Event listeners for products section buttons

document.addEventListener('DOMContentLoaded', () => {
    // Add New Product button
    const addBtn = document.querySelector('.add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            alert('Add New Product button clicked. Open add product form.');
            // TODO: Open add product form/modal
        });
    }

    // Add Product with Barcode button
    const addBarcodeBtn = document.querySelector('.add-barcode-btn');
    if (addBarcodeBtn) {
        addBarcodeBtn.addEventListener('click', () => {
            alert('Add Product with Barcode button clicked. Open add product with barcode form.');
            // TODO: Open add product with barcode form/modal
        });
    }

    // Delegate edit and delete buttons in product list
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
        productsGrid.addEventListener('click', (event) => {
            const target = event.target;
            if (target.closest('.edit-btn')) {
                alert('Edit Product button clicked. Open edit product form.');
                // TODO: Open edit product form/modal
            } else if (target.closest('.delete-btn')) {
                const confirmed = confirm('Are you sure you want to delete this product?');
                if (confirmed) {
                    alert('Product deleted.');
                    // TODO: Delete product logic
                }
            }
        });
    }
});
