#!/bin/bash
# TheBhom Hourly News Automation Script
set -e

# Load credentials securely from local environment
if [ -f "$HOME/.gemini/config/credentials.env" ]; then
  source "$HOME/.gemini/config/credentials.env"
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$DIR"

echo "=== [$(date)] Starting TheBhom Hourly News Automation ==="

# 1. Run news engine (Google News RSS -> HTML articles + NewsArticle schema)
python3 scripts/news_engine.py

# 2. Re-generate sitemap.xml with updated timestamp
python3 generate_sitemap.py

# 3. Commit and push to GitHub (if new files exist)
if [[ -n $(git status -s) ]]; then
  echo "New content detected. Committing and pushing to GitHub..."
  git add .
  git commit -m "chore(news): auto-update trending news and sitemaps [$(date +'%Y-%m-%d %H:%M')]"
  git push origin main
  
  # 4. Deploy to Cloudflare Pages
  if [ -n "$CLOUDFLARE_ACCOUNT_ID" ] && [ -n "$CLOUDFLARE_API_KEY" ]; then
    echo "Deploying to Cloudflare Pages..."
    npx -y wrangler pages deploy . --project-name=thebhom --branch=main --commit-dirty=true

    # 5. Purge Cloudflare Edge Cache
    if [ -n "$CLOUDFLARE_ZONE_ID_THEBHOM" ]; then
      echo "Purging Cloudflare Edge Cache..."
      curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID_THEBHOM}/purge_cache" \
        -H "X-Auth-Email: ${CLOUDFLARE_EMAIL}" \
        -H "X-Auth-Key: ${CLOUDFLARE_API_KEY}" \
        -H "Content-Type: application/json" \
        --data '{"purge_everything":true}'
      echo ""
    fi
  fi
  echo "=== Automation cycle completed successfully! ==="
else
  echo "No new updates in this cycle."
fi
