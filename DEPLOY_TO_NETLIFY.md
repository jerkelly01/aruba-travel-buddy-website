# 🚀 Deploy Aruba Travel Buddy Website to Netlify

This guide will help you deploy **only the website** to Netlify.

## Prerequisites

- A GitHub account
- A Netlify account (free tier works)
- Git installed on your computer

## Step 1: Prepare the Website Directory

1. **Navigate to the website directory**:
   ```bash
   cd aruba-travel-buddy-website
   ```

2. **Ensure dependencies are installed**:
   ```bash
   npm install
   ```

3. **Test the build locally** (optional but recommended):
   ```bash
   npm run build
   ```
   If this succeeds, you're ready to deploy!

## Step 2: Push to GitHub

### Option A: Create a New Repository (Recommended)

1. **Create a new GitHub repository**:
   - Go to [github.com/new](https://github.com/new)
   - Name it: `aruba-travel-buddy-website`
   - Make it **public** or **private** (your choice)
   - **Don't** initialize with README, .gitignore, or license

2. **Initialize git and push**:
   ```bash
   cd aruba-travel-buddy-website
   git init
   git add .
   git commit -m "Initial commit - Aruba Travel Buddy website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/aruba-travel-buddy-website.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username.

### Option B: Use Existing Repository

If you already have a repository, just push the website directory:
```bash
cd aruba-travel-buddy-website
git add .
git commit -m "Add website for Netlify deployment"
git push
```

## Step 3: Deploy to Netlify

### Method 1: Netlify Dashboard (Easiest)

1. **Go to Netlify**:
   - Visit [app.netlify.com](https://app.netlify.com)
   - Sign in or create an account

2. **Add a new site**:
   - Click **"Add new site"** → **"Import an existing project"**
   - Choose **"Deploy with GitHub"**
   - Authorize Netlify to access your GitHub (if first time)
   - Select your repository: `aruba-travel-buddy-website`

3. **Configure build settings**:
   - **Base directory**: Leave empty (or set to `aruba-travel-buddy-website` if deploying from root)
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: `18` (or leave default)

   > **Note**: If deploying from the root of your repository, set:
   > - **Base directory**: `aruba-travel-buddy-website`
   > - **Build command**: `cd aruba-travel-buddy-website && npm install && npm run build`
   > - **Publish directory**: `aruba-travel-buddy-website/.next`

4. **Set environment variables** (if needed):
   - Click **"Show advanced"** → **"New variable"**
   - Add any required environment variables (e.g., Supabase keys)
   - Common variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. **Deploy**:
   - Click **"Deploy site"**
   - Wait for the build to complete (usually 2-5 minutes)

### Method 2: Netlify CLI (Alternative)

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Navigate to website directory**:
   ```bash
   cd aruba-travel-buddy-website
   ```

4. **Initialize Netlify**:
   ```bash
   netlify init
   ```
   Follow the prompts to connect to your site.

5. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

## Step 4: Configure Domain (Optional)

1. **Use Netlify subdomain**:
   - Your site will be available at: `https://random-name-123.netlify.app`
   - You can change this in **Site settings** → **Change site name**

2. **Add custom domain**:
   - Go to **Site settings** → **Domain management**
   - Click **"Add custom domain"**
   - Follow the DNS configuration instructions

## Step 5: Environment Variables

Your website requires the following environment variable:

### Required Variable

**`NEXT_PUBLIC_API_URL`** - Your backend API URL
- If your backend is deployed elsewhere: `https://your-backend-api.com`
- If testing locally: `http://localhost:3000/api` (not recommended for production)
- If backend is on a different service: Use that service's URL

### How to Set Environment Variables

1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: Your backend API URL (e.g., `https://api.yourdomain.com` or your backend hosting URL)
4. Click **"Save"**
5. **Redeploy** after adding variables:
   - Go to **Deploys** → **Trigger deploy** → **Deploy site**

> **Important**: Environment variables that start with `NEXT_PUBLIC_` are exposed to the browser. Make sure your backend API has proper CORS configuration to allow requests from your Netlify domain.

## Step 6: Verify Deployment

Check these items:

- ✅ Site loads at your Netlify URL
- ✅ All pages navigate correctly
- ✅ Images display properly
- ✅ Admin login works (if applicable)
- ✅ Mobile responsive design works
- ✅ No console errors in browser DevTools

## Troubleshooting

### Build Fails

**Error: "Build command failed"**
- Check build logs in Netlify dashboard
- Ensure `package.json` has all dependencies
- Verify Node version matches (should be 18+)

**Error: "Module not found"**
- Run `npm install` locally and commit `package-lock.json`
- Check that all dependencies are in `package.json`

### Images Not Loading

- Verify `next.config.ts` has proper image configuration
- Check that image URLs are correct
- Ensure images are committed to the repository

### Environment Variables Not Working

- Variables must start with `NEXT_PUBLIC_` to be accessible in the browser
- Redeploy after adding/updating variables
- Check variable names match exactly (case-sensitive)

### Site Shows "Page Not Found"

- Verify `netlify.toml` is in the website directory
- Check that the Next.js plugin is configured
- Ensure build completed successfully

## Production Checklist

Before going live:

- [ ] Build succeeds without errors
- [ ] All pages load correctly
- [ ] Images display properly
- [ ] Forms work (if any)
- [ ] Admin login works
- [ ] Mobile responsive
- [ ] Performance is acceptable (check Lighthouse)
- [ ] Environment variables configured
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic on Netlify)

## Continuous Deployment

Netlify automatically deploys when you push to your main branch:

1. Make changes to your code
2. Commit and push:
   ```bash
   git add .
   git commit -m "Update website"
   git push
   ```
3. Netlify will automatically rebuild and deploy

## Need Help?

- Check Netlify build logs: **Deploys** → Click on a deploy → **View build log**
- Netlify docs: [docs.netlify.com](https://docs.netlify.com)
- Next.js on Netlify: [docs.netlify.com/integrations/frameworks/nextjs](https://docs.netlify.com/integrations/frameworks/nextjs)

---

## 🎉 Success!

Your Aruba Travel Buddy website is now live on Netlify! Share your URL and start attracting travelers! 🌴✈️

