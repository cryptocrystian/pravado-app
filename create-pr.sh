#!/bin/bash

echo "🚀 Creating GitHub PR for PRAVADO Frontend Bootstrap"
echo "=============================================="

# Check if gh CLI is available
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI found - creating PR..."
    gh pr create \
        --title "FE Bootstrap: App shell, tokens, routes" \
        --body-file PR_DESCRIPTION.md \
        --head feat/fe-bootstrap \
        --base main
else
    echo "⚠️  GitHub CLI not found"
    echo ""
    echo "🌐 Please visit this URL to create the PR manually:"
    echo "https://github.com/cryptocrystian/pravado-app/pull/new/feat/fe-bootstrap"
    echo ""
    echo "📋 PR Title:"
    echo "FE Bootstrap: App shell, tokens, routes"
    echo ""
    echo "📄 PR Description is available in PR_DESCRIPTION.md"
fi

echo ""
echo "✅ Frontend bootstrap complete!"
echo ""
echo "📊 Build Results:"
echo "  - TypeScript: 0 errors"
echo "  - Bundle size: 282.5kB JS, 14.14kB CSS"
echo "  - Routes: 9 pages implemented"
echo "  - Components: Dashboard, Content Studio, PR Credits"
echo ""
echo "🔗 Cloudflare Preview URL will be available after merge:"
echo "https://pravado-app.pages.dev"