# ⚡ Quick Deploy to Netlify

## Fast Track (5 minutes)

1. **Push website to GitHub**:
   ```bash
   cd aruba-travel-buddy-website
   git init
   git add .
   git commit -m "Deploy to Netlify"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/aruba-travel-buddy-website.git
   git push -u origin main
   ```

2. **Deploy on Netlify**:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click **"Add new site"** → **"Import an existing project"**
   - Connect GitHub → Select your repository
   - Build settings:
     - **Base directory**: (leave empty if repo is just website, or `aruba-travel-buddy-website` if deploying from root)
     - **Build command**: `npm run build`
     - **Publish directory**: `.next`
   - Click **"Deploy site"**

3. **Set environment variable**:
   - After first deploy, go to **Site settings** → **Environment variables**
   - Add: `NEXT_PUBLIC_API_URL` = `your-backend-api-url`
   - **Redeploy** (Deploys → Trigger deploy)

4. **Done!** Your site is live at `https://your-site.netlify.app`

## Important Notes

- ✅ The `netlify.toml` is already configured
- ✅ Next.js plugin is configured automatically
- ⚠️ You **must** set `NEXT_PUBLIC_API_URL` environment variable
- ⚠️ Your backend API must allow CORS from your Netlify domain

For detailed instructions, see [DEPLOY_TO_NETLIFY.md](./DEPLOY_TO_NETLIFY.md)

