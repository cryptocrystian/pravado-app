# Cloudflare Pages Setup for PR Previews

## Option 1: Automatic GitHub Integration (Recommended)

### Step 1: Connect to Cloudflare Pages
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** section
3. Click **"Connect to Git"**
4. Select **GitHub** and authorize Cloudflare
5. Choose repository: `insightforge-pulse/pravado-app`
6. Configure build settings:
   ```
   Build command: cd apps/web && npm install && npm run build
   Build output directory: apps/web/dist
   Root directory: /
   ```

### Step 2: Branch-based Deployments
Cloudflare Pages will automatically create preview URLs for each branch:
- `main` → `pravado-app.pages.dev` (production)
- `feat/seo-tabs-live` → `feat-seo-tabs-live.pravado-app.pages.dev`
- `feat/visibility-score-v1` → `feat-visibility-score-v1.pravado-app.pages.dev` 
- `feat/security-a11y-perf-hardening` → `feat-security-a11y-perf-hardening.pravado-app.pages.dev`

### Step 3: PR Comments
Enable **"Add comments to pull requests"** in Cloudflare Pages settings.
This will automatically comment on GitHub PRs with preview links.

---

## Option 2: Manual Deployment with Wrangler CLI

### Install Wrangler
```bash
npm install -g wrangler
wrangler login
```

### Deploy Each Branch
```bash
# PR1 - SEO Tabs
git checkout feat/seo-tabs-live
cd apps/web && npm run build
wrangler pages deploy dist --project-name pravado-seo-tabs

# PR2 - Visibility Score  
git checkout feat/visibility-score-v1
cd apps/web && npm run build
wrangler pages deploy dist --project-name pravado-visibility-score

# PR3 - Security Hardening
git checkout feat/security-a11y-perf-hardening  
cd apps/web && npm run build
wrangler pages deploy dist --project-name pravado-security-hardening
```

---

## Option 3: Workers Sites (Advanced)

Create a single Worker that serves different versions based on subdomain:

```javascript
// worker.js
export default {
  async fetch(request) {
    const url = new URL(request.url)
    
    // Route based on subdomain
    if (url.hostname.includes('seo-tabs')) {
      // Serve SEO tabs version
      return fetch(`https://seo-tabs-assets.domain.com${url.pathname}`)
    } else if (url.hostname.includes('visibility-score')) {
      // Serve visibility score version  
      return fetch(`https://visibility-score-assets.domain.com${url.pathname}`)
    } else if (url.hostname.includes('security')) {
      // Serve security hardening version
      return fetch(`https://security-assets.domain.com${url.pathname}`)
    }
    
    // Default to main version
    return fetch(`https://main-assets.domain.com${url.pathname}`)
  }
}
```

---

## Immediate Action Plan

### Quick Setup (5 minutes):
1. **Create Cloudflare Pages project**
2. **Connect GitHub repository** 
3. **Configure build settings**
4. **Push branches** to trigger deployments

### Expected URLs:
- **PR1 SEO Tabs:** `https://feat-seo-tabs-live.pravado-app.pages.dev/seo`
- **PR2 Visibility Score:** `https://feat-visibility-score-v1.pravado-app.pages.dev/dashboard`  
- **PR3 Security:** `https://feat-security-a11y-perf-hardening.pravado-app.pages.dev/`

### Benefits:
✅ **Free hosting** for all PR previews  
✅ **Automatic deployments** on every push  
✅ **Global CDN** with sub-second load times  
✅ **HTTPS by default** with security headers  
✅ **Branch isolation** - each PR has its own environment  
✅ **PR integration** - automatic preview links in GitHub  

---

## Build Configuration Needed

### Update package.json for Cloudflare Pages:
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview",
    "build:pages": "NODE_ENV=production vite build --outDir dist"
  }
}
```

### Create _redirects file for SPA routing:
```
# apps/web/public/_redirects
/*    /index.html   200
```

### Environment Variables:
Set in Cloudflare Pages dashboard:
```
NODE_VERSION=20.19.4
NPM_VERSION=10.8.2
```