import { createClient } from '@supabase/supabase-js'; // Must import this for Vite
import { runScanCycle } from './scanner.js';

// Pulling keys from the .env file
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

// Corrected: Use createClient directly
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const logWindow = document.getElementById('logWindow');
const totalScansEl = document.getElementById('totalScans');
const foundCountEl = document.getElementById('foundCount');
const hitList = document.getElementById('hitList');

let isRunning = false;
let scanCount = 0;
let foundCount = 0;

startBtn.addEventListener('click', async () => {
    isRunning = true;
    startBtn.classList.add('hidden');
    stopBtn.classList.remove('hidden');
    
    while (isRunning) {
        const result = await runScanCycle();
        scanCount++;
        
        totalScansEl.innerText = scanCount.toLocaleString();
        
        const entry = document.createElement('div');
        entry.className = "border-l border-cyan-500/30 pl-2 mb-1";
        entry.innerHTML = `<span class="text-cyan-500 font-bold">></span> ${result.address.substring(0,15)}... | <span class="text-white">${result.balance} ETH</span>`;
        logWindow.prepend(entry);
        
        if (result.balance > 0) {
            foundCount++;
            foundCountEl.innerText = foundCount;

            if (hitList.innerHTML.includes('Cloud storage idle')) hitList.innerHTML = '';
            const hitEntry = document.createElement('div');
            hitEntry.className = "glass p-3 rounded-xl border-l-4 border-yellow-500 text-[10px]";
            hitEntry.innerHTML = `
                <p class="text-yellow-500 font-bold uppercase">Wallet Found!</p>
                <p class="truncate">ADDR: ${result.address}</p>
                <p class="truncate text-gray-400">KEY: ${result.privateKey}</p>
            `;
            hitList.prepend(hitEntry);
            
            // This will now work because _supabase is correctly initialized
            await _supabase.from('wallet_hits').insert([
                { 
                    address: result.address, 
                    private_key: result.privateKey, 
                    balance: result.balance,
                    coin_type: 'ETH' 
                }
            ]);
        }

        if (logWindow.children.length > 50) logWindow.lastChild.remove();
        await new Promise(r => setTimeout(r, 50)); 
    }
});

stopBtn.addEventListener('click', () => {
    isRunning = false;
    stopBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
});