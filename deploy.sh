#!/bin/bash

# Aruba Travel Buddy Website - Netlify Deployment Script
# This script helps deploy the website to Netlify

echo "🚀 Deploying Aruba Travel Buddy Website to Netlify..."
echo ""

# Check if Git repository exists
if [ ! -d .git ]; then
    echo "📝 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Aruba Travel Buddy website"
else
    echo "✅ Git repository already exists"
fi

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Login to Netlify (if not already logged in)
echo "🔐 Checking Netlify authentication..."
if ! netlify status &> /dev/null; then
    echo "Please login to Netlify:"
    netlify login
fi

# Deploy to production
echo "🚀 Deploying to Netlify..."
netlify deploy --prod --dir=.next

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Check your deployment URL in the output above"
echo "2. Visit your live website"
echo "3. Test all pages and features"
echo "4. Configure custom domain (optional)"
echo ""
echo "Happy traveling! 🌴✈️"
