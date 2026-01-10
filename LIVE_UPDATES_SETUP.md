# 🚀 Live Updates Setup Guide

This guide will help you see live updates on your website instantly.

## 📋 Quick Setup Options

### Option 1: Automatic Deployments (Recommended)
**Best for:** Seeing changes on the live website automatically

1. **Ensure GitHub is connected to Netlify:**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Select your site
   - Go to **Site settings** → **Build & deploy** → **Continuous Deployment**
   - Make sure your GitHub repo is connected
   - Production branch should be set to `main`

2. **Push changes to see live updates:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
   
3. **Watch the deployment:**
   - Go to Netlify Dashboard → **Deploys**
   - Watch the build progress in real-time
   - Your site updates automatically when build completes (usually 2-5 minutes)

### Option 2: Netlify CLI Live Preview
**Best for:** Testing changes locally before pushing

1. **Install Netlify CLI (if not already installed):**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Link your site (first time only):**
   ```bash
   cd aruba-travel-buddy-website
   netlify link
   ```
   - Select your site from the list
   - This connects your local project to your Netlify site

4. **Start live preview:**
   ```bash
   npm run dev:preview
   ```
   - This starts Next.js dev server with hot reloading
   - Changes appear instantly in your browser
   - Access at `http://localhost:3000`

5. **Deploy preview to Netlify (optional):**
   ```bash
   npm run deploy:preview
   ```
   - Creates a preview URL on Netlify
   - Share with others for testing
   - Doesn't affect production

### Option 3: Local Development with Hot Reloading
**Best for:** Fast local development

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Open browser:**
   - Navigate to `http://localhost:3000`
   - Changes appear instantly (hot reloading enabled)

## 🎯 Recommended Workflow

### For Quick Testing:
```bash
# 1. Make changes to your code
# 2. Start local dev server
npm run dev

# 3. See changes instantly at http://localhost:3000
```

### For Production Updates:
```bash
# 1. Test locally first
npm run dev

# 2. When ready, commit and push
git add .
git commit -m "Update features"
git push origin main

# 3. Watch deployment in Netlify Dashboard
# 4. Site updates automatically in 2-5 minutes
```

## 🔍 Monitoring Live Updates

### Check Deployment Status

1. **Netlify Dashboard:**
   - Go to **Deploys** tab
   - See real-time build progress
   - View build logs
   - See deployment URL

2. **GitHub Integration:**
   - Check commit status in GitHub
   - See deployment status badges
   - Get notifications when deployment completes

3. **Netlify CLI:**
   ```bash
   netlify status
   netlify deploy:list
   ```

## ⚡ Instant Rollback

If something breaks, rollback instantly:

1. **Netlify Dashboard:**
   - Go to **Deploys**
   - Find last working deployment
   - Click **"..."** → **"Publish deploy"**
   - Site restored in seconds!

2. **Netlify CLI:**
   ```bash
   netlify deploy:restore DEPLOY_ID
   ```

## 🛠️ Troubleshooting

### Changes not appearing?
1. **Check build status** in Netlify Dashboard
2. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)
3. **Check build logs** for errors
4. **Verify git push** was successful

### Build failing?
1. Check **build logs** in Netlify Dashboard
2. Test locally: `npm run build`
3. Check for TypeScript errors: `npm run lint`
4. Verify all dependencies are in `package.json`

### Local dev not working?
1. Clear `.next` folder: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Restart dev server: `npm run dev`

## 📊 Current Configuration

✅ **Continuous Deployment:** Enabled (pushes to `main` auto-deploy)
✅ **Next.js Plugin:** Configured in `netlify.toml`
✅ **Build Optimization:** Enabled
✅ **Instant Rollbacks:** Available in Netlify Dashboard

## 🎉 You're All Set!

Your site is configured for live updates. Just push to GitHub and watch it deploy automatically!

**Quick Commands:**
- `npm run dev` - Local development with hot reloading
- `npm run build` - Test production build locally
- `git push origin main` - Deploy to production

---

**Need Help?**
- Check Netlify Dashboard → Deploys → Build logs
- See `NETLIFY_INSTANT_UPDATES.md` for advanced features
- Netlify Docs: https://docs.netlify.com
