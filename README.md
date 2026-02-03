# CryptoScoutV - Elite Cryptocurrency Scanner

Advanced cryptocurrency wallet scanner with real-time derivation and balance checking.

## Features
- 🔍 Multi-method scanning (Brain, Pattern, BIP39)
- ⚡ Adjustable speed modes (Slow, Medium, Max, No Limit)
- 🪙 Multi-coin support (BTC, ETH, BNB, MATIC, SOL)
- 📊 Real-time metrics and safety ratings
- 💾 Database integration with Supabase

## Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the Vite configuration
   - Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts**
   - Link to existing project or create new
   - Confirm the detected settings
   - Wait for deployment to complete

### Environment Variables

If you're using Supabase or other APIs, add your environment variables in Vercel:

1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"
3. Add your variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_KEY`
   - Any other API keys

## Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

## Tech Stack
- **Frontend Framework**: Vite
- **Styling**: TailwindCSS (CDN)
- **Database**: Supabase
- **Deployment**: Vercel
- **Fonts**: Google Fonts (Orbitron, JetBrains Mono)

## Safety Ratings
- ⭐⭐⭐⭐⭐ SAFE - Minimal API usage
- ⭐⭐⭐ MODERATE - Balanced scanning
- ⭐ DANGER - High-speed mode, risk of IP restrictions

## License
MIT
