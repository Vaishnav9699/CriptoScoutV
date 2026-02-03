import { runScanCycle } from './scanner.js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const downloadBtn = document.getElementById('downloadBtn');
const loadHitsBtn = document.getElementById('loadHitsBtn');
const logWindow = document.getElementById('logWindow');
const totalScansEl = document.getElementById('totalScans');
const foundCountEl = document.getElementById('foundCount');
const hitList = document.getElementById('hitList');
const hitCounterEl = document.getElementById('hitCounter');
const scanSpeedEl = document.getElementById('scanSpeed');
const apiLatencyEl = document.getElementById('apiLatency');
const hashRateEl = document.getElementById('hashRate');

// Safety Rating elements
const safetyRating = document.getElementById('safetyRating');
const safetyStars = document.getElementById('safetyStars');
const safetyLabel = document.getElementById('safetyLabel');
const safetyDetails = document.getElementById('safetyDetails');
const safetyMessage = document.getElementById('safetyMessage');

// Coin selection checkboxes
const coinBTC = document.getElementById('coinBTC');
const coinETH = document.getElementById('coinETH');
const coinBNB = document.getElementById('coinBNB');
const coinMATIC = document.getElementById('coinMATIC');
const coinSOL = document.getElementById('coinSOL');
const selectedCoinsDisplay = document.getElementById('selectedCoinsDisplay');

// Selected coins tracking
let selectedCoins = ['BTC']; // Default: BTC only
window.selectedCoins = selectedCoins; // Make globally accessible

// Safety rating click handler
safetyRating.addEventListener('click', () => {
    safetyDetails.classList.toggle('hidden');
});

// Update Safety Rating based on current settings
function updateSafetyRating() {
    const numCoins = selectedCoins.length;
    let speedRisk = 2; // Default MEDIUM = 2

    // Determine speed risk (0=safest, 4=riskiest)
    const activeSpeed = document.querySelector('.speed-btn.active');
    if (activeSpeed) {
        if (activeSpeed.id === 'slowBtn') speedRisk = 0;
        else if (activeSpeed.id === 'mediumBtn') speedRisk = 2;
        else if (activeSpeed.id === 'maxBtn') speedRisk = 3;
        else if (activeSpeed.id === 'noLimitBtn') speedRisk = 4;
    }

    // Calculate overall safety score (5 stars = safest, 1 star = riskiest)
    let safetyScore = 5;

    // Reduce safety based on speed
    if (speedRisk === 2) safetyScore -= 1; // MEDIUM: -1 star
    else if (speedRisk === 3) safetyScore -= 2; // MAX: -2 stars
    else if (speedRisk === 4) safetyScore -= 3; // NO LIMIT: -3 stars

    // Reduce safety based on number of coins
    if (numCoins >= 4) safetyScore -= 1.5;
    else if (numCoins === 3) safetyScore -= 1;
    else if (numCoins === 2) safetyScore -= 0.5;

    // Ensure score is between 1-5
    safetyScore = Math.max(1, Math.min(5, Math.round(safetyScore)));

    // Update stars display
    const starHTML = Array.from({ length: 5 }, (_, i) => {
        if (i < safetyScore) {
            return '<span class="text-yellow-400 text-sm">★</span>';
        } else {
            return '<span class="text-gray-600 text-sm">★</span>';
        }
    }).join('');
    safetyStars.innerHTML = starHTML;

    // Update label and message
    let label, color, message;
    if (safetyScore >= 4) {
        label = 'SAFE';
        color = 'text-green-400';
        message = '✅ Low risk of API ban. Settings are conservative and safe.';
    } else if (safetyScore === 3) {
        label = 'MODERATE';
        color = 'text-yellow-400';
        message = '⚠️ Moderate risk. Monitor for errors and reduce speed if needed.';
    } else if (safetyScore === 2) {
        label = 'RISKY';
        color = 'text-orange-400';
        message = '⚠️ High risk! Consider reducing speed or number of coins.';
    } else {
        label = 'DANGER';
        color = 'text-red-400';
        message = '🔥 EXTREME RISK! Very likely to trigger API bans. Reduce immediately!';
    }

    safetyLabel.textContent = label;
    safetyLabel.className = `text-[9px] ${color} font-bold`;

    // Build detailed message
    const speedNames = ['SLOW', 'SLOW', 'MEDIUM', 'MAX', 'NO LIMIT'];
    const speedLabels = ['Safe ✅', 'Safe ✅', 'Moderate ⚠️', 'Risky 🔥', 'Danger 🔥'];
    const coinLabel = numCoins === 1 ? 'Safe ✅' : numCoins <= 2 ? 'Moderate ⚠️' : 'Risky 🔥';

    safetyMessage.innerHTML = `
        <strong>Speed:</strong> ${speedNames[speedRisk]} (${speedLabels[speedRisk]})<br>
        <strong>Coins:</strong> ${numCoins} (${coinLabel})<br>
        <strong>Assessment:</strong> ${message}
    `;
}

// Update selected coins display
function updateSelectedCoinsDisplay() {
    const coinSymbols = {
        'BTC': '₿ BTC',
        'ETH': 'Ξ ETH',
        'BNB': '🔸 BNB',
        'MATIC': '⬡ MATIC',
        'SOL': '◎ SOL'
    };

    if (selectedCoins.length === 0) {
        selectedCoinsDisplay.textContent = '⚠️ No coins selected!';
        selectedCoinsDisplay.className = 'text-[8px] text-red-400 mt-2 font-bold';
    } else {
        const coinNames = selectedCoins.map(c => coinSymbols[c]).join(' • ');
        selectedCoinsDisplay.textContent = `⚡ Checking: ${coinNames}`;
        selectedCoinsDisplay.className = 'text-[8px] text-cyan-300 leading-relaxed';
    }

    // Update safety rating when coins change
    updateSafetyRating();
}


// Coin checkbox event listeners
[coinBTC, coinETH, coinBNB, coinMATIC, coinSOL].forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        selectedCoins = [];
        if (coinBTC.checked) selectedCoins.push('BTC');
        if (coinETH.checked) selectedCoins.push('ETH');
        if (coinBNB.checked) selectedCoins.push('BNB');
        if (coinMATIC.checked) selectedCoins.push('MATIC');
        if (coinSOL.checked) selectedCoins.push('SOL');

        window.selectedCoins = selectedCoins;
        updateSelectedCoinsDisplay();
        console.log('Selected coins:', selectedCoins);
    });
});

// Scan Method Selector
const methodMix = document.getElementById('methodMix');
const methodBrain = document.getElementById('methodBrain');
const methodPattern = document.getElementById('methodPattern');
const methodBIP39 = document.getElementById('methodBIP39');
const methodDescription = document.getElementById('methodDescription');

// Scan method tracking
let selectedMethod = 'mix'; // Default: mixed
window.selectedScanMethod = selectedMethod;

// Method descriptions
const methodDescriptions = {
    mix: 'Balanced: 60% Brain, 30% Pattern, 10% BIP39',
    brain: 'Brain Wallet only: Check common phrases & variations',
    pattern: 'Pattern only: Check sequential & weak patterns',
    bip39: 'BIP39 only: Random 12-word seed phrases'
};

// Update method description
function updateMethodDescription() {
    methodDescription.textContent = methodDescriptions[selectedMethod];
}

// Method radio button event listeners
[methodMix, methodBrain, methodPattern, methodBIP39].forEach(radio => {
    radio.addEventListener('change', (e) => {
        selectedMethod = e.target.value;
        window.selectedScanMethod = selectedMethod;
        updateMethodDescription();
        console.log('Scan method changed to:', selectedMethod);
    });
});

// Speed control buttons
const slowBtn = document.getElementById('slowBtn');
const mediumBtn = document.getElementById('mediumBtn');
const maxBtn = document.getElementById('maxBtn');
const noLimitBtn = document.getElementById('noLimitBtn');
const dangerWarning = document.getElementById('dangerWarning');
const speedWarning = document.getElementById('speedWarning');

// Speed modes configuration
const SPEED_MODES = {
    SLOW: { delay: 100, apiTimeout: 2000, name: '🐢 SLOW', isDanger: false },
    MEDIUM: { delay: 20, apiTimeout: 1000, name: '⚡ MEDIUM', isDanger: false },
    MAX: { delay: 0, apiTimeout: 500, name: '🚀 MAX', isDanger: false },
    NO_LIMIT: { delay: 0, apiTimeout: 200, name: '⚡ NO LIMIT', isDanger: true }
};

let currentSpeedMode = 'MEDIUM'; // Default to MEDIUM
window.currentApiTimeout = SPEED_MODES.MEDIUM.apiTimeout; // Make it globally accessible

let isRunning = false;
let scanCount = 0;
let foundCount = 0;
let walletHits = [];
let speedStartTime = Date.now();
let speedStartCount = 0;

startBtn.addEventListener('click', async () => {
    isRunning = true;
    startBtn.classList.add('hidden');
    stopBtn.classList.remove('hidden');

    while (isRunning) {
        try {
            const scanStartTime = Date.now();
            const result = await runScanCycle();
            const scanEndTime = Date.now();

            scanCount++;
            totalScansEl.innerText = scanCount.toLocaleString();

            // Track API latency (simple average of last scan)
            const scanLatency = scanEndTime - scanStartTime;
            apiLatencyEl.innerText = scanLatency;

            // Update speed in real-time (updates every scan)
            const elapsedTime = (Date.now() - speedStartTime) / 1000; // seconds
            if (elapsedTime >= 1) {
                const scansInPeriod = scanCount - speedStartCount;
                const currentSpeed = Math.round((scansInPeriod / elapsedTime) * 60);
                scanSpeedEl.innerText = currentSpeed;

                // Update hash rate (wallets per second)
                const hashRate = Math.round(scansInPeriod / elapsedTime);
                hashRateEl.innerText = hashRate;
            }

            // Create log entry with all 4 cryptocurrencies
            const entry = document.createElement('div');
            entry.className = "border-l-2 border-cyan-500/30 pl-3 mb-3 pb-2 border-b border-gray-800/30";

            // Method badge color
            let methodColor = 'purple';
            let methodIcon = '🧠';
            if (result.scanType === 'BRAIN') {
                methodColor = 'orange';
                methodIcon = '🧠';
            } else if (result.scanType === 'PATTERN') {
                methodColor = 'blue';
                methodIcon = '🔢';
            } else {
                methodColor = 'purple';
                methodIcon = '🎲';
            }

            // Build coin display HTML for selected coins
            const coinColors = {
                BTC: { name: '₿ BITCOIN', color: 'orange' },
                ETH: { name: 'Ξ ETHEREUM', color: 'blue' },
                BNB: { name: '🔸 BNB', color: 'yellow' },
                MATIC: { name: '⬡ POLYGON', color: 'purple' },
                SOL: { name: '◎ SOLANA', color: 'green' }
            };

            let coinsHTML = '';
            selectedCoins.forEach(coin => {
                const addr = result.addresses[coin];
                const hasBalance = addr && addr.balance > 0;
                const coinInfo = coinColors[coin];

                coinsHTML += `
                <div class="mt-2">
                    <span class="text-${coinInfo.color}-500 font-bold text-xs">${coinInfo.name}:</span>
                    <div class="mt-1">
                        <div class="text-[9px] ${hasBalance ? 'text-green-400 font-bold' : 'opacity-60'}">
                            <span class="font-mono">${addr.address}</span>
                            <span class="ml-2 ${hasBalance ? 'text-yellow-400' : 'text-gray-600'}">${addr.balance.toFixed(8)} ${coin}</span>
                        </div>
                    </div>
                </div>
                `;
            });

            entry.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <span class="text-${methodColor}-400/50 text-xs px-2 py-1 rounded bg-${methodColor}-500/10">${methodIcon} ${result.method}</span>
                <span class="text-yellow-500 font-bold text-xs">Total: ${result.totalValue.toFixed(8)}</span>
            </div>
            <div class="mb-2">
                <span class="text-gray-400 font-bold text-xs">PHRASE/KEY:</span> 
                <div class="text-purple-300/80 text-[9px] font-mono leading-relaxed mt-1">
                    ${result.phrase}
                </div>
            </div>
            ${coinsHTML}
        `;
            logWindow.prepend(entry);

            // Check if any balance found
            if (result.totalValue > 0) {
                foundCount++;
                foundCountEl.innerText = foundCount;
                hitCounterEl.innerText = foundCount;

                if (hitList.innerHTML.includes('Waiting for wallet hits')) hitList.innerHTML = '';
                const hitEntry = document.createElement('div');
                hitEntry.className = "glass p-3 rounded-xl border-l-4 border-yellow-500 text-[10px]";

                // Get BTC info
                const btcInfo = result.addresses.BTC;

                hitEntry.innerHTML = `
                <p class="text-yellow-500 font-bold uppercase text-xs">🎉 WALLET FOUND! (${result.method})</p>
                
                <div class="mt-3 p-3 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg border border-purple-500/30">
                    <p class="text-purple-300 font-bold text-[10px] mb-2">🔑 SECRET PHRASE/KEY:</p>
                    <p class="text-white text-[11px] font-mono font-bold break-words leading-relaxed bg-black/40 p-2 rounded">
                        ${result.phrase}
                    </p>
                    <p class="text-xs text-purple-400 mt-2 italic">⚠️ Save this immediately!</p>
                </div>
                
                <p class="text-orange-400 font-bold mt-3 text-[10px]">₿ BITCOIN ADDRESS:</p>
                <p class="text-gray-300 text-[9px] font-mono mt-1">${btcInfo.address}</p>
                <p class="text-green-400 font-bold mt-2 text-xs">� BALANCE: ${btcInfo.balance.toFixed(8)} BTC</p>
            `;
                hitList.prepend(hitEntry);

                // Store hit for download
                walletHits.push({
                    timestamp: new Date().toISOString(),
                    method: result.method,
                    phrase: result.phrase,
                    privateKey: result.privateKey,
                    addresses: result.addresses,
                    totalValue: result.totalValue
                });

                await _supabase.from('wallet_hits').insert([
                    {
                        address: result.addresses.BTC.address,
                        private_key: result.phrase,
                        balance: result.totalValue,
                        coin_type: result.method
                    }
                ]);
            }

            if (logWindow.children.length > 50) logWindow.lastChild.remove();

            // Apply delay based on current speed mode
            const modeConfig = SPEED_MODES[currentSpeedMode];
            if (modeConfig.delay > 0) {
                await new Promise(r => setTimeout(r, modeConfig.delay));
            }

        } catch (error) {
            console.error('Scan error:', error);
            // Continue even if there's an error
        }
    }
});

stopBtn.addEventListener('click', () => {
    isRunning = false;
    stopBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
});

// Download wallet hits
downloadBtn.addEventListener('click', () => {
    if (walletHits.length === 0) {
        alert('No wallet hits found yet! Keep scanning...');
        return;
    }

    // Create formatted text content
    let content = '╔═══════════════════════════════════════════════════════════╗\n';
    content += '║         CRYPTONIX WALLET SCANNER - FOUND WALLETS         ║\n';
    content += '╚═══════════════════════════════════════════════════════════╝\n\n';
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `Total Wallets Found: ${walletHits.length}\n\n`;
    content += '═'.repeat(60) + '\n\n';

    walletHits.forEach((hit, index) => {
        content += `┌─ WALLET #${index + 1} ────────────────────────────────────────┐\n`;
        content += `│ Found: ${new Date(hit.timestamp).toLocaleString()}\n`;
        content += `│ Method: ${hit.method}\n`;
        content += `│ Total Value: ${hit.totalValue.toFixed(8)}\n`;
        content += `├─────────────────────────────────────────────────────────┤\n`;
        content += `│ PHRASE/KEY:\n│ ${hit.phrase}\n`;
        content += `├─────────────────────────────────────────────────────────┤\n`;
        content += `│ ADDRESSES & BALANCES:\n`;

        ['BTC', 'ETH', 'BNB', 'MATIC'].forEach(coin => {
            const addr = hit.addresses[coin];
            if (addr && addr.balance > 0) {
                content += `│\n│ ${coin}:\n`;
                content += `│   Address: ${addr.address}\n`;
                content += `│   Balance: ${addr.balance.toFixed(8)} ${coin}\n`;
            }
        });

        content += `└─────────────────────────────────────────────────────────┘\n\n`;
    });

    content += '\n' + '═'.repeat(60) + '\n';
    content += 'IMPORTANT: Keep this file secure! Anyone with these keys can access the funds.\n';
    content += '═'.repeat(60) + '\n';

    // Create download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cryptonix_hits_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert(`✅ Downloaded ${walletHits.length} wallet hit(s) successfully!`);
});

// Load hits from Supabase database
loadHitsBtn.addEventListener('click', async () => {
    loadHitsBtn.innerText = '⏳ Loading...';
    loadHitsBtn.disabled = true;

    try {
        const { data, error } = await _supabase
            .from('wallet_hits')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) throw error;

        if (!data || data.length === 0) {
            alert('📭 No wallet hits found in database yet.');
            loadHitsBtn.innerText = '📥 Load from DB';
            loadHitsBtn.disabled = false;
            return;
        }

        // Clear current list
        hitList.innerHTML = '';

        // Display loaded hits
        data.forEach((hit, index) => {
            const hitEntry = document.createElement('div');
            hitEntry.className = "glass p-3 rounded-xl border-l-4 border-cyan-500 text-[10px]";

            hitEntry.innerHTML = `
                <p class="text-cyan-400 font-bold">#${index + 1} - ${hit.coin_type || 'Found'}</p>
                <div class="mt-2 p-2 bg-black/30 rounded">
                    <p class="text-purple-400 font-bold text-[9px]">PHRASE/KEY:</p>
                    <p class="text-purple-300 text-[8px] font-mono break-words">${hit.private_key}</p>
                </div>
                <p class="text-green-400 mt-2">
                    <span class="font-bold">Address:</span> ${hit.address.substring(0, 20)}...
                </p>
                <p class="text-yellow-400 mt-1">
                    <span class="font-bold">Balance:</span> ${hit.balance}
                </p>
                <p class="text-gray-500 text-[8px] mt-2">
                    ${new Date(hit.created_at).toLocaleString()}
                </p>
            `;
            hitList.appendChild(hitEntry);
        });

        foundCountEl.innerText = data.length;
        hitCounterEl.innerText = data.length;

        alert(`✅ Loaded ${data.length} wallet hit(s) from database!`);

    } catch (error) {
        alert(`❌ Error loading from database: ${error.message}`);
    } finally {
        loadHitsBtn.innerText = '📥 Load from DB';
        loadHitsBtn.disabled = false;
    }
});

// Speed mode switchers
function setSpeedMode(mode) {
    currentSpeedMode = mode;
    window.currentApiTimeout = SPEED_MODES[mode].apiTimeout;

    // Update button states
    [slowBtn, mediumBtn, maxBtn, noLimitBtn].forEach(btn => btn.classList.remove('active'));

    // Remove danger styling from all buttons
    [slowBtn, mediumBtn, maxBtn, noLimitBtn].forEach(btn => btn.classList.remove('danger-mode'));

    if (mode === 'SLOW') slowBtn.classList.add('active');
    else if (mode === 'MEDIUM') mediumBtn.classList.add('active');
    else if (mode === 'MAX') maxBtn.classList.add('active');
    else if (mode === 'NO_LIMIT') {
        noLimitBtn.classList.add('active', 'danger-mode');
        // Show danger warnings
        dangerWarning.classList.remove('hidden');
        speedWarning.classList.remove('hidden');
        // Make the speed number red
        scanSpeedEl.classList.add('text-red-400');
        scanSpeedEl.classList.remove('text-purple-400');
    }

    // Hide warnings if not in danger mode
    if (!SPEED_MODES[mode].isDanger) {
        dangerWarning.classList.add('hidden');
        speedWarning.classList.add('hidden');
        scanSpeedEl.classList.remove('text-red-400');
        scanSpeedEl.classList.add('text-purple-400');
    }

    console.log(`⚡ Speed mode changed to: ${SPEED_MODES[mode].name}, API Timeout: ${SPEED_MODES[mode].apiTimeout}ms, Delay: ${SPEED_MODES[mode].delay}ms`);
}

slowBtn.addEventListener('click', () => setSpeedMode('SLOW'));
mediumBtn.addEventListener('click', () => setSpeedMode('MEDIUM'));
maxBtn.addEventListener('click', () => setSpeedMode('MAX'));

// NO LIMIT button with warning confirmation
noLimitBtn.addEventListener('click', () => {
    const confirmed = confirm(
        '⚠️ WARNING: NO LIMIT MODE ⚠️\n\n' +
        'This extreme speed mode:\n' +
        '• Can cause IP BAN within 2-3 minutes\n' +
        '• May freeze your browser\n' +
        '• High API failure rate\n' +
        '• Only recommended for short bursts\n\n' +
        'Speeds: 2,000-10,000+ scans/min\n' +
        'Timeout: 200ms (ultra-fast)\n' +
        'Delay: 0ms (instant)\n\n' +
        'Are you sure you want to enable NO LIMIT mode?'
    );

    if (confirmed) {
        setSpeedMode('NO_LIMIT');
        console.warn('🚨 NO LIMIT MODE ACTIVATED - Use at your own risk!');
    }
});

// Set default mode on load
setSpeedMode('MEDIUM');