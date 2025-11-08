# 🚀 Netlify Deployment Guide - Aruba Travel Buddy Website

## Step 1: Prepare Your Repository

1. **Create a GitHub Repository** (if you don't have one):
   ```bash
   # Create a new repository on GitHub.com
   # Repository name: aruba-travel-buddy-website
   ```

2. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Aruba Travel Buddy website"
   git remote add origin https://github.com/yourusername/aruba-travel-buddy-website.git
   git push -u origin main
   ```

## Step 2: Deploy to Netlify

### Option A: Netlify Website (Recommended)

1. Go to [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Configure build settings:
   - **Base directory**: (leave empty)
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Click **"Deploy site"**

### Option B: Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod --dir=.next
   ```

## Step 3: Configure Domain (Optional)

1. Go to your Netlify site dashboard
2. Click **"Domain settings"**
3. Add your custom domain or use the provided `netlify.app` subdomain

## Step 4: Set Environment Variables (Optional)

If you need environment variables:
1. Go to **"Site settings"** → **"Environment variables"**
2. Add any required variables

## Step 5: Verify Deployment

Your site will be available at:
- **Netlify subdomain**: `https://amazing-site-name.netlify.app`
- **Custom domain**: `https://yourdomain.com` (if configured)

## Troubleshooting

### Build Fails
- Check the build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify `netlify.toml` configuration

### Images Not Loading
- Check that `next.config.js` has proper image configuration
- Verify image URLs are accessible

### Functions Not Working
- Check function logs in Netlify dashboard
- Verify function directory structure

## Production Checklist

- [ ] Deploy successful
- [ ] All pages loading correctly
- [ ] Images displaying properly
- [ ] Admin login working
- [ ] Mobile responsive
- [ ] Performance acceptable
- [ ] Custom domain configured (optional)

---

## 🎉 Success!

Your Aruba Travel Buddy website is now live on Netlify! Share the URL with the world and start attracting travelers to discover Aruba! 🌴✈️
