# Active Project Memory — TheBhom (`thebhom.in`)

## 1. Project Vision & Architecture
- **Primary Domain**: `thebhom.in` / `www.thebhom.in`
- **Hosting Platform**: Cloudflare Pages (`thebhom`, `thebhom.pages.dev`)
- **Git Repo**: `https://github.com/bhomvratrai-glitch/thebhom-landing.git` (branch `main`)
- **Direct Deploy Command**:
  ```bash
  npx -y wrangler pages deploy . --project-name=thebhom --commit-dirty=true
  ```
- **Edge Cache Purge**:
  ```bash
  curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
    -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
    -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
    -H "Content-Type: application/json" \
    --data '{"purge_everything":true}'
  ```

---

## 2. Google AdSense & SEO Audit (Fixed on October 5, 2026)
### AdSense Account & Status
- **Publisher ID**: `ca-pub-4674566886677472`
- **Current Status**: **"Getting ready — Getting your site ready to show ads" (Review Requested)**
- **Previous Rejection Reason**: "Low value content" (Thin content, crawler timeout, and canonical mismatch).

### Root Causes Diagnosed & Fixed
1. **Deferred AdSense Loader Timeout**:
   - *Problem*: AdSense snippet was loaded after a 7-second timer or mousemove/scroll event (`loadAdSense()`). The Google AdSense review crawler does not simulate human mouse movements and times out after 3-5 seconds, causing Google's bot to see 0 ads or script tags.
   - *Fix*: Replaced with official standard `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4674566886677472" crossorigin="anonymous"></script>` in `<head>`.
2. **Cloudflare 308 Redirect vs Canonical Mismatch**:
   - *Problem*: Cloudflare Pages automatically strips `.html` via 308 Permanent Redirect (e.g. `/wallpapers.html` -> `/wallpapers`). However, `<link rel="canonical">` pointed back to `.html`, creating an infinite redirect confusion loop for Googlebot.
   - *Fix*: Standardized all canonical URLs and internal links across the entire site to extensionless clean URLs (e.g., `https://www.thebhom.in/wallpapers`).
3. **Thin Content De-indexation (184 Affiliate Product Pages)**:
   - *Problem*: Auto-generated deal pages in `/deals/p/*.html` constituted over 50% of the site's indexable pages, triggering "Scraped / Thin Affiliate Content" filters.
   - *Fix*: Marked all 184 product deal pages with `<meta name="robots" content="noindex, follow"/>` and disallowed bot crawling in `robots.txt`. The deals hub remains accessible to human users.
4. **Trademark & Copyright Guardrails**:
   - *Problem*: Pages mentioning commercial copyrighted brands or uncurated magazines/cartoons (e.g. Marvel wallpapers, cartoon voice clones) triggered Google policy scanners.
   - *Fix*: Added `noindex, nofollow` to `/marvel/`, `/cartoon/`, `/voices/` and disallowed them in `robots.txt`. Replaced hyperbolic claims ("1 Crore books, Forbes, NatGeo") with realistic educational/public domain descriptions.
5. **Sanitized Navigation & Sitemaps**:
   - *Problem*: Header/Footer navigation contained broken tool anchor links and an "Admin Panel" link. Sitemap was bloated with 1,220 redirecting or thin URLs.
   - *Fix*: Cleaned `shared.js` navigation links to only verified working tools. Regenerated `sitemap.xml` with 54 high-quality, 200 OK canonical URLs.
6. **Hardened `robots.txt`**:
   - Disallowed non-public and low-value directories: `/deals/p/`, `/admin/`, `/marvel/`, `/cartoon/`, `/voices/`, `/pricing.html`, `/checkout.html`, `/dashboard.html`.

---

## 3. Active Production Verification
- Live site returns HTTP 200 on all canonical clean URLs.
- AdSense script executes synchronously on page load.
- Review requested successfully in Google AdSense dashboard.
