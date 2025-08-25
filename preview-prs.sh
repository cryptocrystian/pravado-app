#!/bin/bash

# PR Preview Script for Milestone C
# Usage: ./preview-prs.sh [pr1|pr2|pr3]

set -e

case "$1" in
  "pr1")
    echo "🔍 Previewing PR1: SEO Tabs Live"
    git checkout feat/seo-tabs-live
    echo "✅ Switched to SEO branch"
    echo "📦 Installing dependencies..."
    npm install --silent
    echo "🚀 Starting development server..."
    echo "Visit: http://localhost:3000/seo"
    npm run dev
    ;;
  "pr2") 
    echo "📊 Previewing PR2: Visibility Score v1"
    git checkout feat/visibility-score-v1
    echo "✅ Switched to Visibility Score branch"
    echo "📦 Installing dependencies..."
    npm install --silent
    echo "🚀 Starting development server..."
    echo "Visit: http://localhost:3000/dashboard"
    npm run dev
    ;;
  "pr3")
    echo "🛡️ Previewing PR3: Security/A11y/Performance"
    git checkout feat/security-a11y-perf-hardening
    echo "✅ Switched to Security Hardening branch"
    echo "📦 Installing dependencies..."
    npm install --silent
    echo "🚀 Starting development server..."
    echo "Test accessibility with Tab key, check DevTools for security headers"
    npm run dev
    ;;
  *)
    echo "PR Preview Options:"
    echo "  ./preview-prs.sh pr1  - Preview SEO Tabs Live"
    echo "  ./preview-prs.sh pr2  - Preview Visibility Score v1" 
    echo "  ./preview-prs.sh pr3  - Preview Security/A11y/Performance"
    echo ""
    echo "Available branches:"
    git branch --list "feat/*" | sed 's/*//' | sed 's/^/  - /'
    ;;
esac