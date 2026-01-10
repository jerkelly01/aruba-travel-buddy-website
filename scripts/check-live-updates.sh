#!/bin/bash

# Check Live Updates Setup Script
# This script verifies your live updates configuration

echo "🔍 Checking Live Updates Setup..."
echo ""

# Check if Netlify CLI is installed
if command -v netlify &> /dev/null; then
    echo "✅ Netlify CLI is installed"
    netlify --version
else
    echo "⚠️  Netlify CLI not found globally"
    echo "   Install with: npm install -g netlify-cli"
    echo "   Or use: npx netlify"
fi

echo ""

# Check if site is linked
if [ -f ".netlify/state.json" ]; then
    echo "✅ Netlify site is linked"
    cat .netlify/state.json | grep -o '"siteId":"[^"]*"' | head -1
else
    echo "⚠️  Site not linked to Netlify"
    echo "   Run: netlify link (or npx netlify link)"
fi

echo ""

# Check git remote
if git remote get-url origin &> /dev/null; then
    echo "✅ Git remote configured:"
    git remote get-url origin
else
    echo "⚠️  No git remote found"
fi

echo ""

# Check netlify.toml
if [ -f "netlify.toml" ]; then
    echo "✅ netlify.toml found"
else
    echo "⚠️  netlify.toml not found"
fi

echo ""

# Check package.json scripts
if grep -q "dev" package.json; then
    echo "✅ Development scripts configured"
else
    echo "⚠️  Development scripts missing"
fi

echo ""
echo "📋 Quick Start Commands:"
echo "   Local dev:     npm run dev"
echo "   Deploy preview: npm run deploy:preview"
echo "   Deploy prod:   npm run deploy:prod"
echo ""
echo "📚 See LIVE_UPDATES_SETUP.md for detailed instructions"
