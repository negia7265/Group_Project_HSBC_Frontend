// Navigation functionality
document.addEventListener("DOMContentLoaded", () => {
    console.log("Document loaded, initializing navigation...");
    loadUserData();
    setDate();
    getInvestedAmount();
    getProfit();
    getAssetPerformance();
    setAssetAllocationChart();
});
async function setAssetAllocationChart() {
   
    const allocationCtx = document.getElementById('allocationChart');
    if (allocationCtx) {
        const asset = await fetch(`http://localhost:8888/get_asset_shares`);
        const asset_data = await asset.json();
        console.log("Asset Data:", asset_data);
        new Chart(allocationCtx, {
            type: 'doughnut',
            data: {
                labels: ['Stocks', 'Crypto', 'Gold', 'Silver'],
                datasets: [{
                    data: [asset_data[0].percent_share,asset_data[1].percent_share,asset_data[2].percent_share, asset_data[3].percent_share],
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444'
                    ],
                    borderWidth: 0,
                    cutout: '70%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#3b82f6',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}
async function getAssetPerformance() {
    const stockRes = await fetch(`http://localhost:8888/get_profit_percent/stock`);
    const cryptoRes = await fetch(`http://localhost:8888/get_profit_percent/crypto`);
    const goldRes = await fetch(`http://localhost:8888/get_profit_percent/gold`);
    const silverRes = await fetch(`http://localhost:8888/get_profit_percent/silver`);

    const stock = await stockRes.json();
    const crypto = await cryptoRes.json();
    const gold = await goldRes.json();
    const silver = await silverRes.json();

    function formatProfit(profit) {
        const value = parseFloat(profit).toFixed(2);
        return profit >= 0 ? `+${value}%` : `${value}%`;
    }

    document.getElementById("stock_percent").textContent = formatProfit(stock[0].profit_percent);
    document.getElementById("crypto_percent").textContent = formatProfit(crypto[0].profit_percent);
    document.getElementById("gold_percent").textContent = formatProfit(gold[0].profit_percent);
    document.getElementById("silver_percent").textContent = formatProfit(silver[0].profit_percent);
console.log("Asset Performance Data:", { stock, crypto, gold, silver });
}
async function getProfit() {
    const profit = await fetch(`http://localhost:8888/get_profit`);
    const data = await profit.json();
    
    document.getElementById("profit_amount").textContent = `₹ ${data[0].total_profit.toLocaleString()}`;

}
async function getInvestedAmount() {
    const invested=await fetch(`http://localhost:8888/total_investment`);
    const data = await invested.json();
    document.getElementById("invested_amount").textContent = `₹ ${data[0].total_investment.toLocaleString()}`;
}
async function setDate() {
    const dateElement = document.querySelector(".date");

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-IN', options);

    dateElement.textContent = formattedDate;
}
async function loadUserData() {
    // Fetch and populate user name and budget
        const userRes = await fetch(`http://localhost:8888/user_details`);
        const user = await userRes.json();
        const invested=await fetch(`http://localhost:8888/total_investment`);
        const invested_data = await invested.json();
        document.getElementById("user-name").textContent = `Hello ${user[0].user_name}`;
        document.getElementById("budget-amount").innerHTML =
            `₹${user[0].budget-invested_data[0].total_investment} <span class="left">left</span>`;
        console.log("User data loaded:", user);
}
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            
            // Remove active class from all nav items and pages
            navItems.forEach(nav => nav.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            // Add active class to clicked nav item and corresponding page
            this.classList.add('active');
            document.getElementById(targetPage).classList.add('active');
        });
    });
    
    // Initialize charts
    initializeCharts();
    
    // Initialize transaction filters
    initializeTransactionFilters();
});

// Toggle section functionality
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.classList.toggle('collapsed');
}

// Chart initialization
function initializeCharts() {
    // Portfolio Growth Chart
    const portfolioCtx = document.getElementById('portfolioChart');
    if (portfolioCtx) {
        new Chart(portfolioCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                datasets: [{
                    label: 'Portfolio Value',
                    data: [18000, 21000, 19000, 22000, 25000, 28000, 26000, 30000],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#3b82f6',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return '$' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: '#f1f5f9',
                            drawBorder: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return '$' + (value / 1000) + 'k';
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }
    
    // Asset Allocation Chart
    
}

// Transaction filters
function initializeTransactionFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Here you would implement the actual filtering logic
            const filterType = this.textContent.toLowerCase();
            filterTransactions(filterType);
        });
    });
}

function filterTransactions(type) {
    const rows = document.querySelectorAll('.table-row');
    
    rows.forEach(row => {
        if (type === 'all') {
            row.style.display = 'grid';
        } else {
            const transactionType = row.querySelector('.transaction-type');
            if (transactionType && transactionType.textContent.toLowerCase().includes(type)) {
                row.style.display = 'grid';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

// Investment button functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('invest-btn') || e.target.classList.contains('invest-button')) {
        e.preventDefault();
        
        // Check investment limit
        const currentLimit = 45280; // This would come from your backend
        const investmentAmount = 1000; // This would be the amount they want to invest
        
        if (investmentAmount > currentLimit) {
            alert('Investment limit exceeded! You have $' + currentLimit + ' remaining for this month.');
            return;
        }
        
        // Proceed with investment
        alert('Investment initiated! This would redirect to the investment flow.');
    }
});

// Smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states for better UX
function showLoading(element) {
    element.style.opacity = '0.6';
    element.style.pointerEvents = 'none';
}

function hideLoading(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
}

// Simulate real-time updates (you would replace this with actual WebSocket or API calls)
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Update portfolio values with small random changes
        const investedAmount = document.querySelector('.overview-card .amount');
        const profitAmount = document.querySelectorAll('.overview-card .amount')[1];
        
        if (investedAmount && profitAmount) {
            // Small random fluctuations
            const investedChange = (Math.random() - 0.5) * 1000;
            const profitChange = (Math.random() - 0.5) * 500;
            
            // You would update these with real data from your backend
            // This is just for demonstration
        }
    }, 30000); // Update every 30 seconds
}

// Initialize real-time updates
simulateRealTimeUpdates();

// Export functionality
function exportTransactions() {
    // This would implement actual CSV/PDF export
    alert('Export functionality would be implemented here');
}

// Add event listeners for export buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('export-btn')) {
        exportTransactions();
    }
});

// Settings functionality
function updateInvestmentLimit() {
    const limitInput = document.querySelector('.setting-input');
    if (limitInput) {
        const newLimit = parseFloat(limitInput.value);
        if (newLimit > 0) {
            // Update the header display
            const limitDisplay = document.querySelector('.investment-limit .amount');
            if (limitDisplay) {
                limitDisplay.innerHTML = `$${newLimit.toLocaleString()} <span class="left">left</span>`;
            }
            
            // Save to backend/localStorage
            localStorage.setItem('investmentLimit', newLimit);
            alert('Investment limit updated successfully!');
        }
    }
}

// Load saved settings
function loadSettings() {
    const savedLimit = localStorage.getItem('investmentLimit');
    if (savedLimit) {
        const limitInput = document.querySelector('.setting-input');
        const limitDisplay = document.querySelector('.investment-limit .amount');
        
        if (limitInput) limitInput.value = savedLimit;
        if (limitDisplay) {
            limitDisplay.innerHTML = `$${parseFloat(savedLimit).toLocaleString()} <span class="left">left</span>`;
        }
    }
}

// Initialize settings on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    
    // Add event listener for settings changes
    const settingInputs = document.querySelectorAll('.setting-input');
    settingInputs.forEach(input => {
        input.addEventListener('change', updateInvestmentLimit);
    });
});

// Mobile menu toggle (for smaller screens)
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('mobile-open');
}

// Add touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        const sidebar = document.querySelector('.sidebar');
        if (diff > 0) {
            // Swipe left - close sidebar
            sidebar.classList.remove('mobile-open');
        } else {
            // Swipe right - open sidebar
            sidebar.classList.add('mobile-open');
        }
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Form validation
function validateInvestmentAmount(amount, availableLimit) {
    if (amount <= 0) {
        showNotification('Please enter a valid investment amount', 'error');
        return false;
    }
    
    if (amount > availableLimit) {
        showNotification(`Investment limit exceeded! You have $${availableLimit.toLocaleString()} remaining.`, 'error');
        return false;
    }
    
    return true;
}

// Search functionality (placeholder)
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            // Implement search logic here
            console.log('Searching for:', query);
        });
    }
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    
    // Add smooth transitions to all interactive elements
    const interactiveElements = document.querySelectorAll('button, .nav-item, .card, .asset-item');
    interactiveElements.forEach(element => {
        element.style.transition = 'all 0.2s ease';
    });
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to your Portfolio Dashboard!', 'success');
    }, 1000);
});