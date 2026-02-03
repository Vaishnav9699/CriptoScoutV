# Vercel Deployment Guide for CryptoScoutV

## 🚀 Quick Deploy (3 Easy Steps)

### Method 1: GitHub + Vercel (Recommended) ⭐

#### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Prepare for Vercel deployment"

# Create main branch
git branch -M main

# Add your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Push to GitHub
git push -u origin main
```

#### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Vercel will auto-detect it as a **Vite** project

#### Step 3: Configure & Deploy

- **Framework Preset**: Vite (auto-detected)
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `dist` (auto-filled)
- **Install Command**: `npm install` (auto-filled)

Click **"Deploy"** and wait ~2 minutes! 🎉

---

### Method 2: Vercel CLI (Alternative)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy (from your project directory)
vercel

# Follow the interactive prompts:
# - Set up and deploy: Y
# - Which scope: [Your account]
# - Link to existing project: N
# - Project name: cryptoscoutv (or your choice)
# - Directory: ./ (press Enter)
# - Override settings: N
```

---

## 🔐 Environment Variables (If Using Supabase)

If you have a `.env` file with sensitive data:

**On Vercel Dashboard:**
1. Go to your project → **Settings** → **Environment Variables**
2. Add each variable:
   - `VITE_SUPABASE_URL` = your_supabase_url
   - `VITE_SUPABASE_KEY` = your_supabase_anon_key
3. Click **"Save"**
4. Redeploy your project

---

## ✅ Post-Deployment Checklist

- [ ] Build completed successfully
- [ ] Site loads at Vercel URL (e.g., `your-project.vercel.app`)
- [ ] All assets (logo, fonts) load correctly
- [ ] Tailwind CSS styles are applied
- [ ] Scanner functions work properly
- [ ] API calls to Supabase/blockchain work
- [ ] Environment variables are set (if needed)

---

## 🛠️ Troubleshooting

### Build Fails?
```bash
# Test build locally first
npm run build

# Check console for errors
npm run preview
```

### Styles Not Loading?
- Ensure TailwindCSS CDN link is in `index.html`
- Check that `dist/` folder contains all assets

### API Errors?
- Verify environment variables are set in Vercel
- Check CORS settings in your API
- Ensure API keys are valid

---

## 🔄 Continuous Deployment

Once connected to GitHub, **every push to main** automatically deploys! 🎯

```bash
# Make changes
git add .
git commit -m "Update feature X"
git push

# Vercel will automatically deploy the changes!
```

---

## 📊 Monitoring

After deployment:
- **Analytics**: View traffic in Vercel Dashboard
- **Logs**: Check deployment logs for errors
- **Previews**: Every PR gets a preview URL

---

## 🌐 Custom Domain (Optional)

1. Go to project → **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records (Vercel provides instructions)
4. Enable SSL (automatic)

---

## 🎉 Your Live URL

After deployment, your site will be live at:
```
https://your-project-name.vercel.app
```

Share it with the world! 🚀
