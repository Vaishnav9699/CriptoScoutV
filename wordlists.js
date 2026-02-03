// Brain Wallet Common Phrases Database
export const COMMON_PASSWORDS = [
    "password", "123456", "12345678", "qwerty", "abc123", "monkey", "letmein", "trustno1",
    "dragon", "baseball", "iloveyou", "master", "sunshine", "ashley", "bailey", "shadow",
    "superman", "michael", "jennifer", "football", "jesus", "ninja", "mustang", "password1"
];

export const BITCOIN_RELATED = [
    "bitcoin", "satoshi", "blockchain", "crypto", "wallet", "btc", "ethereum", "eth",
    "satoshi nakamoto", "bitcoin wallet", "my bitcoin", "crypto wallet", "digital gold",
    "hodl", "moon", "lambo", "to the moon", "buy bitcoin", "bitcoin cash", "litecoin",
    "bitcoin core", "bitcoin address", "private key", "public key", "hash", "mining"
];

export const COMMON_PHRASES = [
    "correct horse battery staple", "the quick brown fox", "hello world", "open sesame",
    "abracadabra", "password123", "admin", "root", "user", "test", "demo", "welcome",
    "login", "passw0rd", "qwerty123", "letmein123", "admin123", "root123", "test123"
];

export const FAMOUS_QUOTES = [
    "to be or not to be", "i think therefore i am", "all your base", "may the force be with you",
    "winter is coming", "veni vidi vici", "carpe diem", "hakuna matata", "just do it",
    "think different", "stay hungry stay foolish", "fortune favors the bold"
];

export const WEAK_PATTERNS = [
    "aaaa", "1111", "0000", "ffff", "aaaa1111", "1111aaaa", "00000000", "ffffffff",
    "12341234", "abcdabcd", "deadbeef", "cafebabe", "baadf00d", "fee1dead"
];

export const DATES_PATTERNS = [
    "19700101", "19800101", "19900101", "20000101", "20100101", "20130101",
    "01011970", "01011980", "01011990", "01012000", "01012010", "01012013",
    "2009", "2010", "2011", "2012", "2013", "bitcoin2009", "btc2010"
];

// Combine all wordlists
export const ALL_BRAIN_WALLETS = [
    ...COMMON_PASSWORDS,
    ...BITCOIN_RELATED,
    ...COMMON_PHRASES,
    ...FAMOUS_QUOTES,
    ...DATES_PATTERNS
];

// Generate variations of a phrase
export function generateVariations(phrase) {
    return [
        phrase,
        phrase.toLowerCase(),
        phrase.toUpperCase(),
        phrase + "123",
        phrase + "1",
        phrase + "!",
        phrase + "@",
        "my" + phrase,
        phrase + "password",
        phrase.replace(/ /g, ""),
        phrase.replace(/ /g, "_"),
        phrase.replace(/ /g, "-")
    ];
}

// Sequential pattern generator
export function* generateSequentialPatterns(start = 0) {
    let current = start;
    while (true) {
        yield current.toString().padStart(8, '0');
        current++;
    }
}

// Hex pattern generator
export function* generateHexPatterns(start = 0) {
    let current = start;
    while (true) {
        yield current.toString(16).padStart(8, '0');
        current++;
    }
}
