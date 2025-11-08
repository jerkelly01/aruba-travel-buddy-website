# Deployment Guide - Aruba Travel Buddy Website

## Overview

This guide covers deploying the Aruba Travel Buddy website to production. The website is built with Next.js and can be deployed to multiple platforms.

## Pre-Deployment Checklist

- [ ] Update demo credentials in `src/lib/auth-context.tsx`
- [ ] Update app store links in `src/app/download/page.tsx`
- [ ] Update company information in pages
- [ ] Test all pages locally
- [ ] Run production build: `npm run build`
- [ ] Test production build: `npm start`
- [ ] Update environment variables
- [ ] Set up analytics
- [ ] Configure domain name

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the creator of Next.js and provides the best integration.

#### Step 1: Prepare Your Code
```bash
git init
git add .
git commit -m "Initial commit"
```

#### Step 2: Push to GitHub
1. Create a new repository on GitHub
2. Push your code:
```bash
git remote add origin https://github.com/yourusername/aruba-travel-buddy-website.git
git branch -M main
git push -u origin main
```

#### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add environment variables (if needed)
6. Click "Deploy"

#### Step 4: Configure Domain
1. Go to project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

**Estimated Time**: 5-10 minutes
**Cost**: Free tier available, paid plans start at $20/month

---

### Option 2: Netlify

#### Step 1: Connect Repository
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Choose GitHub
4. Select your repository

#### Step 2: Configure Build Settings
- Build command: `npm run build`
- Publish directory: `.next`

#### Step 3: Deploy
Click "Deploy site"

#### Step 4: Configure Domain
1. Go to "Domain settings"
2. Add custom domain
3. Update DNS records

**Estimated Time**: 5-10 minutes
**Cost**: Free tier available, paid plans start at $19/month

---

### Option 3: AWS Amplify

#### Step 1: Connect Repository
```bash
npm install -g @aws-amplify/cli
amplify configure
```

#### Step 2: Initialize Amplify
```bash
amplify init
```

#### Step 3: Deploy
```bash
amplify publish
```

**Estimated Time**: 15-20 minutes
**Cost**: Free tier available, pay-as-you-go pricing

---

### Option 4: Docker + Traditional Hosting

#### Step 1: Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Step 2: Build Docker Image
```bash
docker build -t aruba-travel-buddy-website .
```

#### Step 3: Push to Docker Hub
```bash
docker tag aruba-travel-buddy-website yourusername/aruba-travel-buddy-website
docker push yourusername/aruba-travel-buddy-website
```

#### Step 4: Deploy to Your Server
```bash
docker pull yourusername/aruba-travel-buddy-website
docker run -p 3000:3000 yourusername/aruba-travel-buddy-website
```

**Estimated Time**: 20-30 minutes
**Cost**: Depends on hosting provider

---

### Option 5: DigitalOcean App Platform

#### Step 1: Connect Repository
1. Go to [digitalocean.com](https://digitalocean.com)
2. Click "Create" → "App"
3. Select GitHub
4. Choose your repository

#### Step 2: Configure
- Source: GitHub
- Repository: aruba-travel-buddy-website
- Branch: main

#### Step 3: Deploy
Click "Deploy"

**Estimated Time**: 10-15 minutes
**Cost**: Starts at $5/month

---

## Environment Variables

Create `.env.production` for production environment:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# App Store Links
NEXT_PUBLIC_APP_STORE_URL=https://apps.apple.com/app/aruba-travel-buddy
NEXT_PUBLIC_PLAY_STORE_URL=https://play.google.com/store/apps/details?id=com.arubabuddy
```

## Post-Deployment

### 1. Verify Deployment
- [ ] Visit your domain
- [ ] Test all pages load correctly
- [ ] Test admin login
- [ ] Test responsive design on mobile

### 2. Set Up Monitoring
```bash
# Install monitoring tools
npm install @sentry/nextjs
```

### 3. Configure Analytics
Add Google Analytics or similar tracking

### 4. Set Up SSL Certificate
Most platforms provide free SSL. Verify it's enabled.

### 5. Configure CDN
Enable CDN for faster content delivery

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Port Issues
Change port in deployment settings (usually automatic)

### Environment Variables Not Loading
- Verify variables are set in deployment platform
- Check variable names match exactly
- Restart deployment

### Performance Issues
- Enable image optimization
- Configure CDN
- Enable caching headers
- Minimize bundle size

## Performance Optimization

### 1. Enable Image Optimization
Already configured in Next.js

### 2. Configure Caching
```javascript
// next.config.ts
module.exports = {
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400',
          },
        ],
      },
    ];
  },
};
```

### 3. Enable Compression
Most platforms handle this automatically

### 4. Minify Code
Automatic with Next.js production build

## Monitoring & Maintenance

### Set Up Alerts
- Deployment failures
- Performance degradation
- Error rate spikes
- Uptime monitoring

### Regular Maintenance
- Update dependencies monthly
- Review security updates
- Monitor error logs
- Check performance metrics

## Rollback Procedure

### Vercel
1. Go to Deployments
2. Click on previous deployment
3. Click "Redeploy"

### Netlify
1. Go to Deploys
2. Click on previous deploy
3. Click "Publish deploy"

### Docker
```bash
docker run -p 3000:3000 yourusername/aruba-travel-buddy-website:previous-tag
```

## Support

For deployment issues:
1. Check platform documentation
2. Review error logs
3. Contact platform support
4. Check GitHub issues

## Next Steps

1. Choose deployment platform
2. Follow platform-specific steps
3. Test deployment
4. Set up monitoring
5. Configure custom domain
6. Launch!

---

**Ready to Deploy?** Choose your platform above and follow the steps!
