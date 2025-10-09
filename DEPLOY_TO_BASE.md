# 🚀 Deploy to Base App - Complete Guide

Deploy your Crypto Personality Quiz as a Mini App on Base and Farcaster!

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Base app account (download from App Store/Google Play)
- ✅ Vercel account (sign up at vercel.com)
- ✅ GitHub account (for version control)
- ✅ Farcaster account (for account association)

---

## Step 1: Push Your Code to GitHub

### Create a New Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit: Crypto Personality Quiz"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/crypto-personality-quiz.git
git branch -M main
git push -u origin main
```

**Important:** Make sure `.env.local` is in `.gitignore` (already done!)

---

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. **Import your GitHub repository**
4. Configure project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

5. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=y84daabb2-ada0-4287-961f-1224f14ef56e
   NEXT_PUBLIC_PROJECT_NAME=Crypto Personality Quiz
   ```

6. Click **"Deploy"**

### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# When prompted:
# - Link to existing project? No
# - Project name: crypto-personality-quiz
# - Directory: ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### After Deployment

You'll get a URL like: `https://crypto-personality-quiz.vercel.app`

**Save this URL!** You'll need it for the next steps.

---

## Step 3: Update NEXT_PUBLIC_URL

### In Vercel Dashboard:

1. Go to your project settings
2. Click **"Environment Variables"**
3. Add/Update:
   ```
   NEXT_PUBLIC_URL=https://YOUR-APP.vercel.app
   ```
4. Click **"Save"**

### Redeploy:

```bash
# Trigger a new deployment
git commit --allow-empty -m "Update production URL"
git push
```

Or in Vercel dashboard: **"Deployments"** → **"Redeploy"**

---

## Step 4: Disable Vercel Authentication

**CRITICAL:** Your app must be publicly accessible for Base to verify it.

1. Go to Vercel Dashboard → Your Project
2. Click **"Settings"**
3. Click **"Deployment Protection"**
4. Toggle **"Vercel Authentication"** to **OFF**
5. Click **"Save"**

---

## Step 5: Create Account Association

Now associate your app with your Farcaster account:

### 5.1: Verify Your App is Live

Visit your app URL: `https://YOUR-APP.vercel.app`

Ensure:
- ✅ App loads correctly
- ✅ No authentication required
- ✅ Quiz is functional

### 5.2: Generate Account Association

1. Go to: [https://base.build/mini-apps/manifest](https://base.build/mini-apps/manifest)

2. **Paste your app URL** (without https://):
   ```
   YOUR-APP.vercel.app
   ```

3. Click **"Submit"**

4. Click **"Verify"** button that appears

5. **Sign the manifest** with your Farcaster wallet

6. **Copy the entire accountAssociation object**

It will look like:
```json
{
  "header": "eyJmaBBiOjE3MzE4...",
  "payload": "eyJkb21haW4iOiJ4B...",
  "signature": "MHhmNGQzN2M2OTk4N..."
}
```

---

## Step 6: Update minikit.config.ts

### Update your local file:

Edit `minikit.config.ts`:

```typescript
export const minikitConfig = {
  accountAssociation: {
    header: "eyJmaBBiOjE3MzE4...", // PASTE YOUR VALUES HERE
    payload: "eyJkb21haW4iOiJ4B...",
    signature: "MHhmNGQzN2M2OTk4N..."
  },
  miniapp: {
    // ... rest stays the same
  },
} as const;
```

### Push to Production:

```bash
git add minikit.config.ts
git commit -m "Add account association credentials"
git push
```

Wait for Vercel to deploy (usually 1-2 minutes).

---

## Step 7: Preview Your App

Before publishing, validate everything works:

### 7.1: Use Base Preview Tool

1. Go to: [https://base.dev/preview](https://base.dev/preview)

2. **Paste your app URL**

3. **Check all tabs:**

   **a) Frame Preview:**
   - ✅ App preview loads
   - ✅ "Launch" button works
   - ✅ Quiz opens in frame

   **b) Account Association:**
   - ✅ Status: "Valid"
   - ✅ Your Farcaster account shows
   - ✅ No errors

   **c) Metadata:**
   - ✅ All fields populated
   - ✅ Images load correctly
   - ✅ Description accurate

### 7.2: Test in Base App (Optional)

If you have the Base app:
1. Open Base app on mobile
2. Paste your URL in a test cast
3. Click the preview
4. Launch the app
5. Test the quiz

---

## Step 8: Publish to Base App! 🎉

### Create a Launch Post

1. **Open Base app** or go to [warpcast.com](https://warpcast.com)

2. **Create a new cast:**

   ```
   🌟 Discover Your Crypto Personality! 🌟

   Are you Bitcoin, Ethereum, Solana, or Dogecoin? 
   
   Take this fun quiz to find out! 
   
   🎨 Mint your personality as an NFT
   💎 Save results onchain
   ⚡ Built on Base
   
   👇 Click below to start!
   
   https://YOUR-APP.vercel.app
   ```

3. **Post the cast**

4. Your app will appear as an **embedded Mini App** with a launch button!

---

## 🎊 You're Live!

Your Crypto Personality Quiz is now:
- ✅ Deployed to Vercel
- ✅ Published as a Base Mini App
- ✅ Accessible in Farcaster
- ✅ Ready for users!

---

## 📱 User Experience

When users click your cast:

1. **See the embed** with your hero image
2. **Click "Launch"** button
3. **App opens** in Mini App frame
4. **Wallet auto-connects** via MiniKit
5. **Take the quiz**
6. **See results**
7. **Mint NFT** (once contract deployed)

---

## 🔧 Post-Deployment Tasks

### Update Images (Optional but Recommended)

Replace the default images:

1. **Create custom images:**
   - `public/hero.png` (1200x630px) - Main preview
   - `public/icon.png` (512x512px) - App icon
   - `public/screenshot-portrait.png` (750x1334px) - Mobile screenshot

2. **Push updates:**
   ```bash
   git add public/
   git commit -m "Add custom app images"
   git push
   ```

### Enable Analytics (Optional)

Add Vercel Analytics:

1. Vercel Dashboard → Your Project
2. Click "Analytics" tab
3. Enable analytics
4. View traffic and performance

### Monitor Performance

Check your app's performance:
- Vercel Dashboard → Logs
- Vercel Dashboard → Analytics
- Base app engagement metrics

---

## 🚀 Next Steps

### Now That You're Live:

1. **Share your app:**
   - Post on Twitter/X
   - Share in Discord/Telegram
   - Tell friends in Farcaster

2. **Deploy smart contract:**
   - Follow `CONTRACT_DEPLOYMENT.md`
   - Enable actual NFT minting
   - Store results onchain

3. **Collect feedback:**
   - Monitor user engagement
   - Fix any issues
   - Add new features

---

## 🐛 Troubleshooting

### App Won't Load in Base

**Issue:** Blank screen or errors

**Solutions:**
- Check Vercel deployment succeeded
- Verify deployment protection is OFF
- Clear Base app cache
- Check browser console for errors

### Account Association Failed

**Issue:** "Invalid account association"

**Solutions:**
- Ensure manifest is signed with correct Farcaster account
- Verify you copied entire accountAssociation object
- Check for extra spaces or line breaks
- Redeploy after updating config

### Images Not Showing

**Issue:** Broken image previews

**Solutions:**
- Verify image paths in minikit.config.ts
- Check images exist in /public folder
- Ensure images are web-optimized (< 1MB)
- Try clearing CDN cache

### Wallet Won't Connect

**Issue:** Users can't connect wallet

**Solutions:**
- This is expected in local development
- Should work fine in Base app (MiniKit)
- Test in actual Base app on mobile
- Check OnchainKit configuration

---

## 📊 Success Metrics

Track your Mini App's success:

- **Casts created** with your app
- **Quiz completions**
- **NFTs minted** (once enabled)
- **User retention**
- **Shares and engagement**

---

## 🔄 Updating Your App

To push updates:

```bash
# Make your changes
git add .
git commit -m "Add new feature"
git push

# Vercel auto-deploys!
# Live in 1-2 minutes
```

---

## 📚 Resources

- **Base Documentation:** https://docs.base.org/
- **MiniKit Docs:** https://docs.farcaster.xyz/minikit
- **Vercel Docs:** https://vercel.com/docs
- **OnchainKit:** https://onchainkit.xyz/

---

## 🎉 Congratulations!

You've successfully deployed your Crypto Personality Quiz as a Base Mini App!

Users can now:
- 🎯 Take your quiz in Base/Farcaster
- 💎 See their crypto personality
- 🎨 Mint NFTs (once contract deployed)
- ⛓️ Store results onchain

**Welcome to the Base ecosystem! 🚀**

---

## 🆘 Need Help?

- Base Discord: https://base.org/discord
- Farcaster Support: https://warpcast.com/~/support
- Vercel Support: https://vercel.com/help

---

*Built with ❤️ on Base*

