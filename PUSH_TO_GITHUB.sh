#!/bin/bash
# Script to push website to GitHub
# Replace YOUR_USERNAME with your GitHub username

cd "$(dirname "$0")"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/aruba-travel-buddy-website.git

# Push to GitHub
git push -u origin main

echo "✅ Code pushed to GitHub!"
echo "Now go to Netlify dashboard and connect your GitHub repository for automatic deployments."



