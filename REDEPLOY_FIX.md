# 🔧 Quick Fix: Deploy Your Quiz to Vercel

Your app is live at https://mini-base-app-personality.vercel.app/, but it's showing the old template. Let's fix it!

## 🚀 Fix Steps (5 minutes)

### Step 1: Update Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on **"mini-base-app-personality"** project
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in sidebar
5. **Update or Add** these variables:

```
NEXT_PUBLIC_URL=https://mini-base-app-personality.vercel.app
NEXT_PUBLIC_ONCHAINKIT_API_KEY=y84daabb2-ada0-4287-961f-1224f14ef56e
NEXT_PUBLIC_PROJECT_NAME=Crypto Personality Quiz
```

6. **IMPORTANT:** For each variable, select **"Production"**, **"Preview"**, and **"Development"**
7. Click **"Save"** for each

### Step 2: Push Your New Code

Make sure all your quiz code is committed and pushed:

```bash
# Check what's changed
git status

# Add all files
git add .

# Commit with a clear message
git commit -m "Add Crypto Personality Quiz with wallet integration"

# Push to GitHub (this triggers Vercel deployment)
git push origin main
```

### Step 3: Verify Deployment

1. Go to Vercel Dashboard → Your Project
2. Click **"Deployments"** tab
3. Wait for deployment to complete (1-2 minutes)
4. Look for "✓ Ready" status

### Step 4: Test Your Live App

Visit: https://mini-base-app-personality.vercel.app/

You should now see:
- ✅ "Discover Your Crypto Personality!" welcome screen
- ✅ Floating crypto symbols (₿ ⟠ ◎ Ð)
- ✅ Wallet connection area
- ✅ "Start Quiz" button

---

## 🐛 If Still Showing Old Page

### Option A: Trigger Manual Redeploy

1. Vercel Dashboard → Deployments
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Select **"Use existing Build Cache: No"**
5. Click **"Redeploy"**

### Option B: Clear Build Cache

```bash
# Make a small change to force rebuild
git commit --allow-empty -m "Force rebuild"
git push
```

### Option C: Check Git Branch

Make sure you're pushing to the right branch:

```bash
# Check current branch
git branch

# Should show: * main

# If not, switch to main
git checkout main
git push origin main
```

---

## ✅ Success Checklist

After fixing, verify:

- [ ] Visit https://mini-base-app-personality.vercel.app/
- [ ] See **"Discover Your Crypto Personality!"** title
- [ ] See floating crypto symbols
- [ ] See wallet connection status
- [ ] NOT seeing "Join CUBEY" text
- [ ] Click "Connect Wallet" works (if on localhost)
- [ ] Page looks like your local version

---

## 🎯 Once Working

After your quiz is showing correctly:

1. **Disable Vercel Authentication:**
   - Settings → Deployment Protection
   - Toggle "Vercel Authentication" to **OFF**
   - Save

2. **Create Account Association:**
   - Go to https://base.build/mini-apps/manifest
   - Follow the steps in `DEPLOY_TO_BASE.md`

3. **Publish to Base:**
   - Create a post with your URL
   - Your quiz will be live!

---

## 📞 Quick Commands Reference

```bash
# Check what needs to be committed
git status

# Commit everything
git add .
git commit -m "Deploy quiz"
git push

# Check deployment
vercel ls

# View logs
vercel logs
```

---

## 🆘 Still Stuck?

If after all steps you still see "Join CUBEY":

1. Check your GitHub repo:
   - Does it have your quiz code?
   - Is `app/page.tsx` the quiz version?

2. Check Vercel project settings:
   - Is it connected to the correct GitHub repo?
   - Is it deploying from the `main` branch?

3. Try deleting and reimporting:
   - Delete project in Vercel
   - Reimport from GitHub
   - Add environment variables
   - Deploy

---

**Your quiz should be live at https://mini-base-app-personality.vercel.app/ after these steps!** 🎉

