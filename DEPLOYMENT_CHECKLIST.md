# ✅ Base Mini App Deployment Checklist

Quick reference guide for deploying your Crypto Personality Quiz to Base.

## 🚀 Pre-Deployment

- [ ] App works locally (`npm run dev`)
- [ ] Build succeeds (`npm run build`)
- [ ] `.env.local` has API key
- [ ] `.gitignore` includes `.env.local`
- [ ] Images in `/public` folder
- [ ] `minikit.config.ts` updated with app details

## 📦 Step 1: GitHub

- [ ] Code pushed to GitHub
- [ ] Repository is accessible
- [ ] Main branch is up to date

## ☁️ Step 2: Vercel

- [ ] Project imported to Vercel
- [ ] Environment variables added:
  - [ ] `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
  - [ ] `NEXT_PUBLIC_PROJECT_NAME`
- [ ] Deployment successful
- [ ] Save production URL
- [ ] Update `NEXT_PUBLIC_URL` in Vercel
- [ ] **Disable** Vercel Authentication
- [ ] Redeploy after URL update

## 🔗 Step 3: Account Association

- [ ] Visit https://base.build/mini-apps/manifest
- [ ] Paste your app URL (without https://)
- [ ] Click "Submit"
- [ ] Click "Verify" and sign with Farcaster
- [ ] Copy `accountAssociation` object
- [ ] Update `minikit.config.ts` with credentials
- [ ] Commit and push changes
- [ ] Wait for Vercel deployment

## ✨ Step 4: Preview & Test

- [ ] Visit https://base.dev/preview
- [ ] Paste app URL
- [ ] Check Frame Preview tab
- [ ] Check Account Association tab (should show "Valid")
- [ ] Check Metadata tab
- [ ] Test app in Base mobile app (optional)

## 🎉 Step 5: Publish

- [ ] Open Base app or Warpcast
- [ ] Create post with app URL
- [ ] Verify embed appears
- [ ] Test "Launch" button
- [ ] App opens in frame
- [ ] Wallet connects automatically
- [ ] Quiz works correctly

## 🖼️ Optional Improvements

- [ ] Replace default images:
  - [ ] `/public/hero.png` (1200x630px)
  - [ ] `/public/icon.png` (512x512px)
  - [ ] `/public/screenshot-portrait.png` (750x1334px)
- [ ] Enable Vercel Analytics
- [ ] Set up custom domain

## ⛓️ Next Steps (After Launch)

- [ ] Deploy smart contract (see `CONTRACT_DEPLOYMENT.md`)
- [ ] Upload NFT metadata to IPFS
- [ ] Enable contract integration
- [ ] Test NFT minting
- [ ] Announce on social media

## 📊 Post-Launch Monitoring

- [ ] Monitor Vercel logs
- [ ] Check analytics
- [ ] Track user engagement
- [ ] Respond to feedback
- [ ] Fix any issues

## ⚡ Quick Commands

```bash
# Build and test locally
npm run build
npm run dev

# Deploy to production (if using CLI)
vercel --prod

# Push updates
git add .
git commit -m "Update app"
git push

# Check deployment status
vercel ls
```

## 🐛 Common Issues

### Issue: "Account association invalid"
**Fix:** Redeploy after updating minikit.config.ts

### Issue: "App not loading"
**Fix:** Check Vercel deployment protection is OFF

### Issue: "Images not showing"
**Fix:** Verify image paths and redeploy

### Issue: "Wallet won't connect"
**Fix:** This is expected locally; works in Base app

## 📞 Support

- Base Discord: https://base.org/discord
- Farcaster: https://warpcast.com/~/support
- Docs: https://docs.base.org/

---

**Total Time: ~30 minutes**

Follow `DEPLOY_TO_BASE.md` for detailed instructions!

