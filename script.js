// Currencies Array
const currencies = ['USD', 'EUR', 'GBP', 'ALL', 'AUD', 'CAD', 'JPY', 'CHF', 'INR', 'CNY'];
const currencyAPI = 'https://api.exchangerate-api.com/v4/latest/USD'; // API for live exchange rates

// DOM Elements
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const convertBtn = document.getElementById('convertBtn');
const convertedAmount = document.getElementById('convertedAmount');
const historyDiv = document.getElementById('historyList');
const currencyChart = document.getElementById('currencyChart');

// Initialize currency selects
currencies.forEach(currency => {
    const option1 = document.createElement('option');
    option1.value = currency;
    option1.textContent = currency;
    fromCurrencySelect.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = currency;
    option2.textContent = currency;
    toCurrencySelect.appendChild(option2);
});

// Fetch exchange rates and perform conversion
async function fetchExchangeRates() {
    try {
        const response = await fetch(currencyAPI);
        const data = await response.json();
        return data.rates;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        alert("Unable to fetch exchange rates. Please try again later.");
        return {};
    }
}

async function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount!');
        return;
    }

    const rates = await fetchExchangeRates();
    if (!rates[fromCurrency] || !rates[toCurrency]) {
        alert('Invalid currency selection!');
        return;
    }
    const result = (amount * rates[toCurrency] / rates[fromCurrency]).toFixed(2);
    convertedAmount.textContent = `${result} ${toCurrency}`; // Add the currency symbol after the result

    // Save to history
    saveToHistory(fromCurrency, toCurrency, amount, result);
}

// Save conversion to history
function saveToHistory(fromCurrency, toCurrency, amount, result) {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.push({ fromCurrency, toCurrency, amount, result, date: new Date().toLocaleString() });
    localStorage.setItem('history', JSON.stringify(history));
    displayHistory();
}

// Display conversion history
function displayHistory() {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    let historyHTML = '<ul>';
    history.forEach(entry => {
        historyHTML += `<li>${entry.date}: ${entry.amount} ${entry.fromCurrency} = ${entry.result} ${entry.toCurrency}</li>`;
    });
    historyHTML += '</ul>';
    historyDiv.innerHTML = historyHTML;
}

// Event listener for conversion
convertBtn.addEventListener('click', convertCurrency);

// Enable Enter key to trigger conversion
amountInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        convertCurrency();
    }
});

// Load history on page load
window.onload = () => {
    displayHistory();
    updateChart();
};
// Chart setup - Enhanced Modern Style
function updateChart() {
    const ctx = currencyChart.getContext('2d');

    fetchExchangeRates().then(rates => {
        const labels = Object.keys(rates).slice(0, 10); // Top 10 currencies
        const data = labels.map(label => rates[label]);

        // Create a gradient effect
        let gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, "rgba(78, 141, 183, 0.6)");
        gradient.addColorStop(1, "rgba(78, 141, 183, 0.1)");

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Exchange Rates',
                    data: data,
                    backgroundColor: gradient, // Modern gradient effect
                    borderColor: '#4e8db7',
                    borderWidth: 3,
                    pointBackgroundColor: '#ffffff', // White points
                    pointBorderColor: '#4e8db7',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    tension: 0.4, // Smooth curved lines
                    fill: true, // Fill area below the line
                    shadowOffsetX: 3,
                    shadowOffsetY: 3,
                    shadowBlur: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Uses full available space
                animation: {
                    duration: 1500, // Smooth animation
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#333', // Darker text
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#4e8db7',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        padding: 10,
                        cornerRadius: 6
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            color: '#333',
                            font: {
                                size: 13
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            color: '#333',
                            font: {
                                size: 13
                            }
                        }
                    }
                }
            }
        });
    });
}
// Function to clear history
function clearHistory() {
    localStorage.removeItem('history'); // Remove from storage
    displayHistory(); // Update UI
}

// Event Listener for Clear History Button
document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);

