#!/bin/bash

# PR Switching Script with Node.js 20
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use --delete-prefix 20 > /dev/null 2>&1

case "$1" in
  "pr2")
    echo "🔄 Switching to PR2: Visibility Score v1..."
    pkill -f vite || true
    sleep 2
    git checkout feat/visibility-score-v1
    echo "📊 Starting Visibility Score preview..."
    echo "Visit: http://localhost:5173/dashboard"
    npm run dev
    ;;
  "pr3")
    echo "🔄 Switching to PR3: Security/A11y/Performance..."
    pkill -f vite || true
    sleep 2  
    git checkout feat/security-a11y-perf-hardening
    echo "🛡️ Starting Security Hardening preview..."
    echo "Visit: http://localhost:5173/ (test keyboard navigation)"
    npm run dev
    ;;
  "pr1")
    echo "🔄 Switching to PR1: SEO Tabs Live..."
    pkill -f vite || true
    sleep 2
    git checkout feat/seo-tabs-live
    echo "🔍 Starting SEO Tabs preview..."
    echo "Visit: http://localhost:5173/seo"
    npm run dev
    ;;
  *)
    echo "Usage: ./switch-pr.sh [pr1|pr2|pr3]"
    echo "  pr1 - SEO Tabs Live"
    echo "  pr2 - Visibility Score v1" 
    echo "  pr3 - Security/A11y/Performance"
    ;;
esac