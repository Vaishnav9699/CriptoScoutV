# 🎮 Speed Control Feature - User Guide

## ✅ **What Was Added:**

Three speed control buttons have been added to the **Scan Speed** panel:

```
🐢 SLOW  |  ⚡ MED  |  🚀 MAX
```

## 📊 **Speed Modes Explained:**

### 🐢 **SLOW Mode** (Safe & Steady)
- **Delay:** 100ms between scans
- **API Timeout:** 2000ms (2 seconds)
- **Expected Speed:** ~150-200 scans/minute
- **Best For:** 
  - Running 24/7 without issues
  - Avoiding any risk of IP bans
  - Multiple tabs (4-5 tabs safe)
- **Risk Level:** ✅ Very Low

### ⚡ **MEDIUM Mode** (Balanced - DEFAULT)
- **Delay:** 20ms between scans
- **API Timeout:** 1000ms (1 second)
- **Expected Speed:** ~300-400 scans/minute
- **Best For:**
  - Normal daily scanning
  - 2-3 tabs simultaneously
  - Good balance of speed & safety
- **Risk Level:** ✅ Low

### 🚀 **MAX Mode** (Extreme Speed)
- **Delay:** 0ms between scans (no delay!)
- **API Timeout:** 500ms (half second)
- **Expected Speed:** ~600-1000 scans/minute
- **Best For:**
  - Short bursts of intense scanning
  - Single tab usage
  - When you need maximum coverage quickly
- **Risk Level:** ⚠️ Moderate (use carefully)

## 🎯 **How to Use:**

1. **Start the scanner** by clicking "INITIALIZE"
2. **Click any speed button** to change mode
3. **Switch modes anytime** - even while scanning!
4. **Watch the speed counter** to see the difference
5. The **active mode glows** with a bright border

## 💡 **Recommended Strategy:**

### Single Tab Users:
```
🚀 MAX Mode → Get maximum speed, low ban risk
```

### Multi-Tab Users (2-3 tabs):
```
⚡ MEDIUM Mode → Best balance for multiple tabs
```

### Overnight/Long-term:
```
🐢 SLOW Mode → Run all night without worries
```

### Quick Coverage Needed:
```
🚀 MAX Mode for 10-15 mins → Then switch to MEDIUM
```

## ⚙️ **Technical Details:**

The speed modes control two things:

1. **Scan Delay** - Time to wait between each wallet check
   - SLOW: Waits 100ms
   - MEDIUM: Waits 20ms
   - MAX: No wait (0ms)

2. **API Timeout** - How long to wait for blockchain API response
   - SLOW: Waits up to 2000ms
   - MEDIUM: Waits up to 1000ms
   - MAX: Waits up to 500ms (fails fast)

## 🛡️ **Safety Tips:**

✅ **SAFE:**
- Running SLOW mode with 5+ tabs
- Running MEDIUM mode with 2-3 tabs
- Running MAX mode with 1 tab

⚠️ **RISKY:**
- Running MAX mode with 3+ tabs
- Using MAX mode for hours continuously
- Ignoring 429 (rate limit) errors

## 📈 **Expected Performance:**

| Setup | Mode | Expected Total Scans/Min |
|-------|------|------------------------|
| 1 Tab | SLOW | 150-200 |
| 1 Tab | MEDIUM | 300-400 |
| 1 Tab | MAX | 600-1000 |
| 2 Tabs | SLOW | 300-400 |
| 2 Tabs | MEDIUM | 600-800 |
| 2 Tabs | MAX | 1200-2000 |
| 3 Tabs | SLOW | 450-600 |
| 3 Tabs | MEDIUM | 900-1200 |
| 3 Tabs | MAX | 1800-3000 ⚠️ |

## 🎨 **Visual Feedback:**

The active speed button will:
- ✨ **Glow** with its color
- 📦 **Thicker border**
- 🎯 **Brighter background**

## 🔧 **Troubleshooting:**

**Speed not increasing?**
- Check if scanner is running
- Look for API errors in console (F12)
- Try refreshing the page

**Getting errors?**
- Switch to SLOW mode
- Close extra tabs
- Wait 10-15 minutes if you hit rate limits

**Want even faster?**
- Set `FAST_MODE = true` in scanner.js (line 30)
- This skips API calls entirely
- **WARNING:** Won't find real wallets, testing only!

---

**The speed control system is now live!** 🚀
**Default mode: MEDIUM (⚡)** - Good balance for most users.
