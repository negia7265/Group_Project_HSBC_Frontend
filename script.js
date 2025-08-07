// Navigation functionality
document.addEventListener("DOMContentLoaded", () => {
    console.log("Document loaded, initializing navigation...");
    loadUserData();
    setDate();
    getInvestedAmount();
    getProfit();
    getAssetPerformance();
    setAssetAllocationChart();
    setPerformanceChart();
    loadStockHoldings();
    loadCryptoHoldings();
    loadGoldHoldings();
    loadSilverHoldings();
});
// Load Gold Holdings
async function loadGoldHoldings() {
    try{
        const response = await fetch('http://localhost:8888/get_gold_overview'); // Adjust URL if needed
        const data = await response.json();
       
        document.getElementById('gold_metal_quantity').textContent = `${data[0].total_quantity} grams`;
        document.getElementById('gold_metal_rate').textContent = `₹${data[0].current_price} per gram`;
        document.getElementById('gold_metal_value').textContent = `₹${data[0].total_value}`;
       
    } catch (err) {
        console.error('Failed to load gold holdings:', err);
    }
}
async function loadSilverHoldings() {
    try{
        const response = await fetch('http://localhost:8888/get_silver_overview'); // Adjust URL if needed
        const data = await response.json();
       
        document.getElementById('silver_metal_quantity').textContent = `${data[0].total_quantity} grams`;
        document.getElementById('silver_metal_rate').textContent = `₹${data[0].current_price} per gram`;
        document.getElementById('silver_metal_value').textContent = `₹${data[0].total_value}`;
       
    } catch (err) {
        console.error('Failed to load gold holdings:', err);
    }
}
async function loadCryptoHoldings() {
    try {
        const response = await fetch('http://localhost:8888/get_crypto_overview'); // Adjust URL if needed
        const data = await response.json();
        console.log("Stock Holdings Data:", data);
        const assetList = document.getElementById('crypto_asset_list');
        const countSpan = document.getElementById('crypto_holding_count');
  
        assetList.innerHTML = ''; // Clear existing items
        countSpan.textContent = `${data.length} holdings`;
  
        data.forEach(asset => {
          
        //   const isPositive = asset.change_percent >= 0;
        //   const changeClass = isPositive ? 'positive' : 'negative';
        //   const changeSign = isPositive ? '+' : '';
  
          const item = document.createElement('div');
          item.className = 'asset-item';
          item.innerHTML = `
            <div class="asset-info">
              <h4>${asset.ticker_symbol}</h4>
              <p>${asset.asset_name}</p>
              <span class="asset-quantity">${asset.total_quantity} shares</span>
            </div>
            <div class="asset-details">
              <span class="asset-price">₹${asset.current_price}</span>
              
            </div>
            <div class="asset-actions">
              <button class="sell-btn">Sell</button>
            </div>
          `;
  
          assetList.appendChild(item);
        });
  
      } catch (err) {
        console.error('Failed to load holdings:', err);
      }
}
async function loadStockHoldings() {
    try {
        const response = await fetch('http://localhost:8888/get_stock_overview'); // Adjust URL if needed
        const data = await response.json();
       
        const assetList = document.getElementById('stock_asset_list');
        const countSpan = document.getElementById('stock_holding_count');
  
        assetList.innerHTML = ''; // Clear existing items
        countSpan.textContent = `${data.length} holdings`;
  
        data.forEach(asset => {
            console.log("Processing asset:", asset);
        //   const isPositive = asset.change_percent >= 0;
        //   const changeClass = isPositive ? 'positive' : 'negative';
        //   const changeSign = isPositive ? '+' : '';
  
          const item = document.createElement('div');
          item.className = 'asset-item';
          item.innerHTML = `
            <div class="asset-info">
              <h4>${asset.ticker_symbol}</h4>
              <p>${asset.asset_name}</p>
              <span class="asset-quantity">${asset.total_quantity} shares</span>
            </div>
            <div class="asset-details">
              <span class="asset-price">₹${asset.current_price}</span>
              
            </div>
            <div class="asset-actions">
              <button class="sell-btn">Sell</button>
            </div>
          `;
  
          assetList.appendChild(item);
        });
  
      } catch (err) {
        console.error('Failed to load holdings:', err);
      }
}
async function setPerformanceChart() {
    const portfolioCtx = document.getElementById('portfolioChart');
    if (portfolioCtx) {
        // Generate 15 days of data starting from 15 days ago
        const asset = await fetch(`http://localhost:8888/get_all_profit`);
        const asset_data = await asset.json();
        const portfolioData=[]
        asset_data.map((item) => {
            portfolioData.push(item.profit);
        });
        console.log("Asset Data:", asset_data);
        const labels = [];
        const today = new Date();
        for (let i = 14; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            labels.push(date.getDate() + '/' + (date.getMonth() + 1));
        }

        // Portfolio data with losses, recovery, and profits (-40k to +40k range)
        // const portfolioData = [
        //     -38000,  // Started with major loss
        //     -32000,  // Heavy loss continues
        //     -28000,  // Reducing loss
        //     -22000,  // Still significant loss
        //     -15000,  // Loss reducing
        //     -8000,   // Smaller loss
        //     -2000,   // Near break even
        //     5000,    // Small profit
        //     12000,   // Growing profit
        //     18000,   // Good growth
        //     15000,   // Some decline
        //     25000,   // Strong recovery
        //     35000,   // Peak profit
        //     30000,   // Minor decline
        //     38000    // Current strong profit
        // ];
        // const portfolioData = [
        //     -38000,  // Started with major loss
        //     -32000,  // Heavy loss continues
        //     -28000,  // Reducing loss
        //     -22000,  // Still significant loss
        //     -15000,  // Loss reducing
        //     -8000,   // Smaller loss
        //     -2000,   // Near break even
        //     5000,    // Small profit
        //     12000,   // Growing profit
        //     18000,   // Good growth
        //     15000,   // Some decline
        //     25000,   // Strong recovery
        //     35000,   // Peak profit
        //     30000,   // Minor decline
        //     38000    // Current strong profit
        // ];

        new Chart(portfolioCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Portfolio P&L',
                    data: portfolioData,
                    borderColor: function(context) {
                        const value = context.parsed?.y || 0;
                        return value >= 0 ? '#10b981' : '#ef4444';
                    },
                    backgroundColor: function(context) {
                        const value = context.parsed?.y || 0;
                        return value >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                    },
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: function(context) {
                        const value = context.parsed?.y || 0;
                        return value >= 0 ? '#10b981' : '#ef4444';
                    },
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    segment: {
                        borderColor: function(ctx) {
                            const value = ctx.p1.parsed.y;
                            return value >= 0 ? '#10b981' : '#ef4444';
                        },
                        backgroundColor: function(ctx) {
                            const value = ctx.p1.parsed.y;
                            return value >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                        }
                    }
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
                                const value = context.parsed.y;
                                const prefix = value >= 0 ? '+₹' : '₹';
                                return prefix + Math.abs(value).toLocaleString();
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
                        min: -40000,
                        max: 40000,
                        grid: {
                            color: function(context) {
                                if (context.tick.value === 0) {
                                    return '#64748b'; // Darker line at zero
                                }
                                return '#f1f5f9';
                            },
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
                            stepSize: 10000,
                            callback: function(value) {
                                if (value === 0) {
                                    return '₹0';
                                } else if (value >= 0) {
                                    return '+₹' + (value / 1000) + 'k';
                                } else {
                                    return '₹' + (value / 1000) + 'k';
                                }
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

async function setAssetAllocationChart() {
    const allocationCtx = document.getElementById('allocationChart');
    if (allocationCtx) {
        try {
            // Try to fetch from API, but fall back to mock data if it fails
            let asset_data;
            try {
                const asset = await fetch(`http://localhost:8888/get_asset_shares`);
                asset_data = await asset.json();
            } catch (error) {
                // Fallback to mock data when API is not available
                console.log("API not available, using mock data");
                asset_data = [
                    { percent_share: 45 }, // Stocks
                    { percent_share: 25 }, // Crypto
                    { percent_share: 20 }, // Gold
                    { percent_share: 10 }  // Silver
                ];
            }
            
            console.log("Asset Data:", asset_data);
            
            new Chart(allocationCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Stocks', 'Crypto', 'Gold', 'Silver'],
                    datasets: [{
                        data: [
                            asset_data[0].percent_share,
                            asset_data[1].percent_share,
                            asset_data[2].percent_share, 
                            asset_data[3].percent_share
                        ],
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
            
            // Update the legend with actual data
            updateChartLegend(asset_data);
        } catch (error) {
            console.error("Error creating chart:", error);
        }
    }
}

function updateChartLegend(asset_data) {
    const legendContainer = document.querySelector('.chart-legend');
    if (legendContainer) {
        const labels = ['Stocks', 'Crypto', 'Gold', 'Silver'];
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
        
        legendContainer.innerHTML = '';
        
        asset_data.forEach((asset, index) => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <div class="legend-color" style="background: ${colors[index]};"></div>
                <span>${labels[index]} (${asset.percent_share}%)</span>
            `;
            legendContainer.appendChild(legendItem);
        });
    }
}

async function getAssetPerformance() {
    try {
        // Try to fetch from API, but fall back to mock data if it fails
        let stock, crypto, gold, silver;
        
        try {
            const stockRes = await fetch(`http://localhost:8888/get_profit_percent/stock`);
            const cryptoRes = await fetch(`http://localhost:8888/get_profit_percent/crypto`);
            const goldRes = await fetch(`http://localhost:8888/get_profit_percent/gold`);
            const silverRes = await fetch(`http://localhost:8888/get_profit_percent/silver`);

            stock = await stockRes.json();
            crypto = await cryptoRes.json();
            gold = await goldRes.json();
            silver = await silverRes.json();
        } catch (error) {
            // Fallback to mock data
            console.log("API not available, using mock performance data");
            stock = [{ profit_percent: 2.5 }];
            crypto = [{ profit_percent: -2.3 }];
            gold = [{ profit_percent: 4.1 }];
            silver = [{ profit_percent: 1.8 }];
        }

        function formatProfit(profit) {
            const value = parseFloat(profit).toFixed(2);
            return profit >= 0 ? `+${value}%` : `${value}%`;
        }

        // Update elements if they exist
        const stockElement = document.getElementById("stock_percent");
        const cryptoElement = document.getElementById("crypto_percent");
        const goldElement = document.getElementById("gold_percent");
        const silverElement = document.getElementById("silver_percent");
        
        if (stockElement) stockElement.textContent = formatProfit(stock[0].profit_percent);
        if (cryptoElement) cryptoElement.textContent = formatProfit(crypto[0].profit_percent);
        if (goldElement) goldElement.textContent = formatProfit(gold[0].profit_percent);
        if (silverElement) silverElement.textContent = formatProfit(silver[0].profit_percent);
        
        console.log("Asset Performance Data:", { stock, crypto, gold, silver });
    } catch (error) {
        console.error("Error getting asset performance:", error);
    }
}

async function getProfit() {
    try {
        let data;
        try {
            const profit = await fetch(`http://localhost:8888/get_profit`);
            data = await profit.json();
        } catch (error) {
            // Fallback to mock data
            data = [{ total_profit: 38000 }];
        }
        
        const profitElement = document.getElementById("profit_amount");
        if (profitElement) {
            profitElement.textContent = `₹ ${data[0].total_profit.toLocaleString()}`;
        }
    } catch (error) {
        console.error("Error getting profit:", error);
    }
}

async function getInvestedAmount() {
    try {
        let data;
        try {
            const invested = await fetch(`http://localhost:8888/total_investment`);
            data = await invested.json();
        } catch (error) {
            // Fallback to mock data
            data = [{ total_investment: 261520 }];
        }
        
        const investedElement = document.getElementById("invested_amount");
        if (investedElement) {
            investedElement.textContent = `₹ ${data[0].total_investment.toLocaleString()}`;
        }
    } catch (error) {
        console.error("Error getting invested amount:", error);
    }
}

async function setDate() {
    try {
        const dateElement = document.querySelector(".date");
        if (dateElement) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const today = new Date();
            const formattedDate = today.toLocaleDateString('en-IN', options);
            dateElement.textContent = formattedDate;
        }
    } catch (error) {
        console.error("Error setting date:", error);
    }
}

async function loadUserData() {
    try {
        let user, invested_data;
        try {
            // Fetch and populate user name and budget
            const userRes = await fetch(`http://localhost:8888/user_details`);
            user = await userRes.json();
            const invested = await fetch(`http://localhost:8888/total_investment`);
            invested_data = await invested.json();
        } catch (error) {
            // Fallback to mock data
            user = [{ user_name: "John Doe", budget: 500000 }];
            invested_data = [{ total_investment: 261520 }];
        }
        
        const userNameElement = document.getElementById("user-name");
        const budgetElement = document.getElementById("budget-amount");
        
        if (userNameElement) {
            userNameElement.textContent = `Hello ${user[0].user_name}`;
        }
        if (budgetElement) {
            budgetElement.innerHTML = `₹${(user[0].budget - invested_data[0].total_investment).toLocaleString()} <span class="left">left</span>`;
        }
        
        console.log("User data loaded:", user);
    } catch (error) {
        console.error("Error loading user data:", error);
    }
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
            const targetElement = document.getElementById(targetPage);
            if (targetElement) {
                targetElement.classList.add('active');
            }
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
    if (section) {
        section.classList.toggle('collapsed');
    }
}

// Chart initialization
function initializeCharts() {
    // Portfolio Growth Chart - 15 days with profits and losses
    setPerformanceChart();
};
async function setPerformanceChart() {
    const portfolioCtx = document.getElementById('portfolioChart');
    if (portfolioCtx) {
        // Generate 15 days of data starting from 15 days ago
        const asset = await fetch(`http://localhost:8888/get_all_profit`);
        const asset_data = await asset.json();
        const portfolioData=[]
        asset_data.map((item) => {
            portfolioData.push(item.profit);
        });
        console.log("Asset Data:", asset_data);
        const labels = [];
        const today = new Date();
        for (let i = 14; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            labels.push(date.getDate() + '/' + (date.getMonth() + 1));
        }
        
        // Portfolio data with losses, recovery, and profits (-40k to +40k range)
        // const portfolioData = [
        //     -38000,  // Started with major loss
        //     -32000,  // Heavy loss continues
        //     -28000,  // Reducing loss
        //     -22000,  // Still significant loss
        //     -15000,  // Loss reducing
        //     -8000,   // Smaller loss
        //     -2000,   // Near break even
        //     5000,    // Small profit
        //     12000,   // Growing profit
        //     18000,   // Good growth
        //     15000,   // Some decline
        //     25000,   // Strong recovery
        //     35000,   // Peak profit
        //     30000,   // Minor decline
        //     38000    // Current strong profit
        // ];
        
        new Chart(portfolioCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Portfolio P&L',
                    data: portfolioData,
                    borderColor: function(context) {
                        const value = context.parsed?.y || 0;
                        return value >= 0 ? '#10b981' : '#ef4444';
                    },
                    backgroundColor: function(context) {
                        const value = context.parsed?.y || 0;
                        return value >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                    },
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: function(context) {
                        const value = context.parsed?.y || 0;
                        return value >= 0 ? '#10b981' : '#ef4444';
                    },
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    segment: {
                        borderColor: function(ctx) {
                            const value = ctx.p1.parsed.y;
                            return value >= 0 ? '#10b981' : '#ef4444';
                        },
                        backgroundColor: function(ctx) {
                            const value = ctx.p1.parsed.y;
                            return value >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                        }
                    }
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
                                const value = context.parsed.y;
                                const prefix = value >= 0 ? '+₹' : '₹';
                                return prefix + Math.abs(value).toLocaleString();
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
                        min: -40000,
                        max: 40000,
                        grid: {
                            color: function(context) {
                                if (context.tick.value === 0) {
                                    return '#64748b'; // Darker line at zero
                                }
                                return '#f1f5f9';
                            },
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
                            stepSize: 10000,
                            callback: function(value) {
                                if (value === 0) {
                                    return '₹0';
                                } else if (value >= 0) {
                                    return '+₹' + (value / 1000) + 'k';
                                } else {
                                    return '₹' + (value / 1000) + 'k';
                                }
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
    // Portfolio Growth Chart - 15 days with profits and losses
   
}

// Investment button functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('invest-btn') || e.target.classList.contains('invest-button')) {
        e.preventDefault();
        
        // Check investment limit
        const currentLimit = 45280; // This would come from your backend
        const investmentAmount = 1000; // This would be the amount they want to invest
        
        if (investmentAmount > currentLimit) {
            alert('Investment limit exceeded! You have ₹' + currentLimit + ' remaining for this month.');
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
    if (element) {
        element.style.opacity = '0.6';
        element.style.pointerEvents = 'none';
    }
}

function hideLoading(element) {
    if (element) {
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
    }
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
                limitDisplay.innerHTML = `₹${newLimit.toLocaleString()} <span class="left">left</span>`;
            }
            
            alert('Investment limit updated successfully!');
        }
    }
}

// Mobile menu toggle (for smaller screens)
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('mobile-open');
    }
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
        if (sidebar) {
            if (diff > 0) {
                // Swipe left - close sidebar
                sidebar.classList.remove('mobile-open');
            } else {
                // Swipe right - open sidebar
                sidebar.classList.add('mobile-open');
            }
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
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
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
        showNotification(`Investment limit exceeded! You have ₹${availableLimit.toLocaleString()} remaining.`, 'error');
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