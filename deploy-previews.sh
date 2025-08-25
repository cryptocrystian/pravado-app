#!/bin/bash

# Cloudflare Pages Deployment Script for PR Previews
# Prerequisites: 
# 1. Install Wrangler: npm install -g wrangler
# 2. Login to Cloudflare: wrangler login
# 3. Node.js 20+ installed via nvm

set -e

# Load Node.js 20
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use --delete-prefix 20 > /dev/null 2>&1

echo "🚀 Deploying PR Previews to Cloudflare Pages"
echo "Node.js version: $(node --version)"
echo ""

# Function to build and deploy a branch
deploy_branch() {
    local branch=$1
    local project_name=$2
    local description=$3
    
    echo "📦 Building and deploying: $description"
    echo "   Branch: $branch"
    echo "   Project: $project_name"
    
    # Switch to branch
    git checkout $branch
    
    # Build the project  
    cd apps/web
    npm run build
    
    # Deploy to Cloudflare Pages
    echo "   Deploying to Cloudflare Pages..."
    wrangler pages deploy dist --project-name $project_name --compatibility-date 2024-08-25
    
    # Get back to root
    cd ../..
    
    echo "   ✅ Deployed: https://$project_name.pages.dev"
    echo ""
}

# Deploy all three PRs
deploy_branch "feat/seo-tabs-live" "pravado-seo-tabs" "PR1: SEO Tabs Live"
deploy_branch "feat/visibility-score-v1" "pravado-visibility-score" "PR2: Visibility Score v1" 
deploy_branch "feat/security-a11y-perf-hardening" "pravado-security" "PR3: Security/A11y/Performance"

echo "🎉 All PR previews deployed successfully!"
echo ""
echo "📋 Preview URLs:"
echo "   PR1 SEO Tabs: https://pravado-seo-tabs.pages.dev/seo"
echo "   PR2 Visibility Score: https://pravado-visibility-score.pages.dev/dashboard"
echo "   PR3 Security: https://pravado-security.pages.dev/"
echo ""
echo "🔧 To update deployments, just re-run this script after making changes."