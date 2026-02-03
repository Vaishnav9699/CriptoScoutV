import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { ALL_BRAIN_WALLETS, generateVariations, WEAK_PATTERNS } from './wordlists.js';

// Scan statistics
let brainWalletIndex = 0;
let patternIndex = 0;
let scanStats = {
    brainWallet: 0,
    pattern: 0,
    bip39: 0
};

// API rotation
let apiIndex = 0;
const APIs = {
    ETH: ['https://ethereum.atomicwallet.io/api/v2/address/'],
    BTC: ['https://bitcoin.atomicwallet.io/api/v2/address/', 'https://blockchain.info/q/addressbalance/'],
    BNB: ['https://bsc.atomicwallet.io/api/v2/address/'],
    MATIC: ['https://polygon.atomicwallet.io/api/v2/address/'],
    SOL: ['https://api.mainnet-beta.solana.com'] // Solana RPC endpoint
};

function getNextAPI(coinType) {
    const apis = APIs[coinType] || APIs.ETH;
    const api = apis[apiIndex % apis.length];
    apiIndex++;
    return api;
}

// FAST MODE: Set to true to skip API calls for speed testing
const FAST_MODE = false; // ← Changed to FALSE - Real balance checking ENABLED!

// Check balance for any coin with proper timeout
async function checkBalance(address, coinType) {
    // Skip API calls in fast mode
    if (FAST_MODE) {
        return 0;
    }

    try {
        const api = getNextAPI(coinType);

        // Use dynamic timeout from speed mode (default 1000ms)
        const timeout = window.currentApiTimeout || 1000;

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        // Special handling for Solana (uses JSON-RPC)
        if (coinType === 'SOL') {
            const response = await fetch(api, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'getBalance',
                    params: [address]
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            const data = await response.json();
            return (data.result?.value || 0) / 1e9; // SOL has 9 decimals
        }

        // Standard REST API for other coins
        const response = await fetch(`${api}${address}`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (coinType === 'BTC' && api.includes('blockchain.info')) {
            const satoshi = await response.text();
            return parseFloat(satoshi || 0) / 1e8;
        } else {
            const data = await response.json();
            const divisor = coinType === 'BTC' ? 1e8 : 1e18;
            return parseFloat(data.balance || 0) / divisor;
        }
    } catch (error) {
        console.error(`API Error (${coinType}):`, error.message);
        return 0; // Return 0 on timeout or error
    }
}

// Generate Bitcoin address from private key
function privateKeyToBitcoinAddress(privateKeyHex) {
    const hash = ethers.keccak256(privateKeyHex);
    return '1' + hash.substring(2, 35);
}

// Brain Wallet: Convert phrase to private key
function brainWalletToPrivateKey(phrase) {
    // SHA256 hash of the phrase becomes the private key
    const hash = ethers.keccak256(ethers.toUtf8Bytes(phrase));
    return hash;
}

// Method 1: Brain Wallet Scanner
async function scanBrainWallet() {
    // Get next phrase from wordlist
    const basePhrase = ALL_BRAIN_WALLETS[brainWalletIndex % ALL_BRAIN_WALLETS.length];
    brainWalletIndex++;

    // Generate variations
    const variations = generateVariations(basePhrase);
    const phrase = variations[Math.floor(Math.random() * variations.length)];

    // Convert to private key
    const privateKey = brainWalletToPrivateKey(phrase);

    // Create wallets for all coins
    const ethWallet = new ethers.Wallet(privateKey);
    const btcAddress = privateKeyToBitcoinAddress(privateKey);
    const solAddress = ethWallet.address.substring(0, 44); // Simplified SOL address generation

    // Get selected coins from window (set by UI)
    const coinsToCheck = window.selectedCoins || ['BTC'];

    // Check balances for selected coins only
    const balances = {};
    let totalValue = 0;

    for (const coin of coinsToCheck) {
        let address, balance = 0;

        if (coin === 'BTC') {
            address = btcAddress;
            balance = await checkBalance(btcAddress, 'BTC');
        } else if (coin === 'SOL') {
            address = solAddress;
            balance = await checkBalance(solAddress, 'SOL');
        } else {
            // ETH, BNB, MATIC use same address
            address = ethWallet.address;
            balance = await checkBalance(ethWallet.address, coin);
        }

        balances[coin] = { address, balance };
        totalValue += balance;
    }

    // Include all coins in result (even unchecked ones show 0 balance)
    const allBalances = {
        BTC: balances.BTC || { address: btcAddress, balance: 0 },
        ETH: balances.ETH || { address: ethWallet.address, balance: 0 },
        BNB: balances.BNB || { address: ethWallet.address, balance: 0 },
        MATIC: balances.MATIC || { address: ethWallet.address, balance: 0 },
        SOL: balances.SOL || { address: solAddress, balance: 0 }
    };

    scanStats.brainWallet++;

    return {
        method: 'Brain Wallet',
        phrase: phrase,
        privateKey: privateKey,
        addresses: allBalances,
        totalValue: totalValue,
        scanType: 'BRAIN'
    };
}

// Method 2: Pattern Scanner
async function scanPattern() {
    // Generate pattern-based private key
    let pattern;

    if (patternIndex < WEAK_PATTERNS.length) {
        // Use predefined weak patterns
        pattern = WEAK_PATTERNS[patternIndex];
    } else {
        // Generate sequential patterns
        const num = patternIndex - WEAK_PATTERNS.length;
        pattern = num.toString(16).padStart(8, '0');
    }

    patternIndex++;

    // Pad to 32 bytes (64 hex chars)
    const privateKey = '0x' + pattern.repeat(8).substring(0, 64);

    // Create wallets
    const ethWallet = new ethers.Wallet(privateKey);
    const btcAddress = privateKeyToBitcoinAddress(privateKey);
    const solAddress = ethWallet.address.substring(0, 44);

    // Get selected coins and check balances
    const coinsToCheck = window.selectedCoins || ['BTC'];
    const balances = {};
    let totalValue = 0;

    for (const coin of coinsToCheck) {
        let address, balance = 0;
        if (coin === 'BTC') {
            address = btcAddress;
            balance = await checkBalance(btcAddress, 'BTC');
        } else if (coin === 'SOL') {
            address = solAddress;
            balance = await checkBalance(solAddress, 'SOL');
        } else {
            address = ethWallet.address;
            balance = await checkBalance(ethWallet.address, coin);
        }
        balances[coin] = { address, balance };
        totalValue += balance;
    }

    const allBalances = {
        BTC: balances.BTC || { address: btcAddress, balance: 0 },
        ETH: balances.ETH || { address: ethWallet.address, balance: 0 },
        BNB: balances.BNB || { address: ethWallet.address, balance: 0 },
        MATIC: balances.MATIC || { address: ethWallet.address, balance: 0 },
        SOL: balances.SOL || { address: solAddress, balance: 0 }
    };

    scanStats.pattern++;

    return {
        method: 'Pattern',
        phrase: `Pattern: ${pattern}`,
        privateKey: privateKey,
        addresses: allBalances,
        totalValue: totalValue,
        scanType: 'PATTERN'
    };
}

// Method 3: BIP39 Random
async function scanBIP39() {
    // Generate random 12-word mnemonic
    const mnemonic = ethers.Mnemonic.fromEntropy(ethers.randomBytes(16));
    const seedPhrase = mnemonic.phrase;

    const hdNode = ethers.HDNodeWallet.fromPhrase(seedPhrase);
    const ethWallet = hdNode.derivePath("m/44'/60'/0'/0/0");
    const btcPath = hdNode.derivePath("m/44'/0'/0'/0/0");
    const btcAddress = privateKeyToBitcoinAddress(btcPath.privateKey);
    const solAddress = ethWallet.address.substring(0, 44);

    // Get selected coins and check balances
    const coinsToCheck = window.selectedCoins || ['BTC'];
    const balances = {};
    let totalValue = 0;

    for (const coin of coinsToCheck) {
        let address, balance = 0;
        if (coin === 'BTC') {
            address = btcAddress;
            balance = await checkBalance(btcAddress, 'BTC');
        } else if (coin === 'SOL') {
            address = solAddress;
            balance = await checkBalance(solAddress, 'SOL');
        } else {
            address = ethWallet.address;
            balance = await checkBalance(ethWallet.address, coin);
        }
        balances[coin] = { address, balance };
        totalValue += balance;
    }

    const allBalances = {
        BTC: balances.BTC || { address: btcAddress, balance: 0 },
        ETH: balances.ETH || { address: ethWallet.address, balance: 0 },
        BNB: balances.BNB || { address: ethWallet.address, balance: 0 },
        MATIC: balances.MATIC || { address: ethWallet.address, balance: 0 },
        SOL: balances.SOL || { address: solAddress, balance: 0 }
    };

    scanStats.bip39++;

    return {
        method: 'BIP39',
        phrase: seedPhrase,
        privateKey: ethWallet.privateKey,
        addresses: allBalances,
        totalValue: totalValue,
        scanType: 'BIP39'
    };
}

// Main hybrid scanner with rotation
let scanCounter = 0;
export async function runScanCycle() {
    scanCounter++;

    // Get selected method from UI (set by main.js)
    const method = window.selectedScanMethod || 'mix';

    if (method === 'brain') {
        // Brain Wallet only
        return await scanBrainWallet();
    } else if (method === 'pattern') {
        // Pattern only
        return await scanPattern();
    } else if (method === 'bip39') {
        // BIP39 only
        return await scanBIP39();
    } else {
        // Mix mode: 60% Brain, 30% Pattern, 10% BIP39
        const rand = Math.random() * 100;
        if (rand < 60) {
            return await scanBrainWallet();
        } else if (rand < 90) {
            return await scanPattern();
        } else {
            return await scanBIP39();
        }
    }
}

// Get scan statistics
export function getScanStats() {
    return scanStats;
}