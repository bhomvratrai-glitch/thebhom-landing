#!/usr/bin/env python3
"""
TheBhom News — Hourly Automated Autonomous News Publishing & SEO Ranking Engine
Runs every hour (3600s) to:
1. Pull fresh breaking stories from Google News (Hindi + English: Breaking, Tech, Space, Business, Sports, Cinema, Viral)
2. Generate comprehensive static HTML articles with Schema.org NewsArticle, BreadcrumbList & FAQPage rich snippets
3. Refresh /sitemap-news.xml (48h Google News spec) and master /sitemap.xml
4. Push updates to GitHub (main)
5. Deploy to Cloudflare Pages & purge Cloudflare Edge Cache
6. Ping Google and Bing sitemap endpoints for rapid indexing
7. Log all operations to news/hourly_engine.log
"""

import os
import sys
import time
import subprocess
import urllib.request
import urllib.parse
import json
import ssl
from datetime import datetime, timezone

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOG_FILE = os.path.join(BASE_DIR, 'news', 'hourly_engine.log')
PLIST_PATH = os.path.expanduser('~/Library/LaunchAgents/in.thebhom.news-hourly.plist')

# ── Load credentials from env file ──────────────────
def _load_credentials():
    cred_file = os.path.expanduser('~/.gemini/config/credentials.env')
    if os.path.exists(cred_file):
        with open(cred_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line.startswith('export '):
                    line = line[7:].strip()
                if line and not line.startswith('#') and '=' in line:
                    k, _, v = line.partition('=')
                    os.environ[k.strip()] = v.strip().strip('"').strip("'")

_load_credentials()

# Cloudflare Credentials — loaded dynamically from credentials.env
CF_ACCOUNT_ID = os.environ.get('CLOUDFLARE_ACCOUNT_ID', '')
CF_API_KEY    = os.environ.get('CLOUDFLARE_API_KEY', '')
CF_EMAIL      = os.environ.get('CLOUDFLARE_EMAIL', '')
CF_ZONE_ID    = os.environ.get('CLOUDFLARE_ZONE_ID_THEBHOM', '')
# IndexNow — instant Google/Bing indexing
INDEXNOW_KEY  = os.environ.get('INDEXNOW_KEY', 'thebhom-indexnow-key-2024')
SITE_URL      = 'https://www.thebhom.in'

def log(msg):
    now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    line = f"[{now_str}] {msg}"
    print(line)
    try:
        os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
        with open(LOG_FILE, 'a', encoding='utf-8') as f:
            f.write(line + '\n')
    except Exception as e:
        print(f"Error writing to log: {e}")

def run_cmd(cmd, cwd=BASE_DIR, timeout=300):
    try:
        res = subprocess.run(
            cmd,
            shell=True,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=timeout
        )
        return res.returncode == 0, res.stdout, res.stderr
    except Exception as e:
        return False, "", str(e)

def purge_cloudflare_cache():
    try:
        url = f"https://api.cloudflare.com/client/v4/zones/{CF_ZONE_ID}/purge_cache"
        req = urllib.request.Request(
            url,
            data=b'{"purge_everything":true}',
            headers={
                "X-Auth-Email": CF_EMAIL,
                "X-Auth-Key": CF_API_KEY,
                "Content-Type": "application/json"
            }
        )
        ctx = ssl._create_unverified_context()
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            log("Cloudflare edge cache purged successfully.")
            return True
    except Exception as e:
        log(f"Failed to purge Cloudflare cache: {e}")
        return False

def ping_search_engines(new_urls=None):
    """Submit new article URLs via IndexNow for instant Google/Bing indexing.
    Google deprecated sitemap ping in June 2023 (HTTP 410 Gone).
    IndexNow is now the correct, supported method."""
    ctx = ssl._create_unverified_context()

    # Build URL list to submit
    if not new_urls:
        new_urls = [
            f"{SITE_URL}/sitemap-news.xml",
            f"{SITE_URL}/news/",
        ]

    # IndexNow payload (Google + Bing both accept api.indexnow.org)
    payload = json.dumps({
        "host": "www.thebhom.in",
        "key": INDEXNOW_KEY,
        "keyLocation": f"{SITE_URL}/{INDEXNOW_KEY}.txt",
        "urlList": new_urls[:100]  # max 100 per call
    }).encode('utf-8')

    indexnow_endpoints = [
        "https://api.indexnow.org/indexnow",
        "https://www.bing.com/indexnow",
    ]
    for endpoint in indexnow_endpoints:
        try:
            req = urllib.request.Request(
                endpoint,
                data=payload,
                headers={"Content-Type": "application/json; charset=utf-8", "User-Agent": "TheBhomHourlyBot/2.0"},
                method="POST"
            )
            with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
                log(f"[IndexNow] {endpoint} -> HTTP {resp.status} ({len(new_urls)} URLs submitted)")
        except Exception as e:
            log(f"[IndexNow NOTICE] {endpoint}: {e}")

def run_hourly_cycle():
    log("==================================================")
    log("Starting Hourly TheBhom News & SEO Publishing Cycle...")

    # 1. Run news_engine.py — collect newly generated article URLs
    engine_script = os.path.join(BASE_DIR, 'scripts', 'news_engine.py')
    ok, out, err = run_cmd(f"{sys.executable} {engine_script}")
    new_article_urls = []
    if not ok:
        log(f"news_engine.py failed: {err}")
    else:
        for l in out.strip().splitlines():
            if "Added" in l or "Total in database" in l:
                log(l)
            # Capture newly written article paths
            if l.startswith("WROTE:"):
                slug = l.replace("WROTE:", "").strip()
                new_article_urls.append(f"{SITE_URL}/news/{slug}")

    # 2. Update master sitemap.xml
    sitemap_script = os.path.join(BASE_DIR, 'generate_sitemap.py')
    if os.path.exists(sitemap_script):
        ok, out, err = run_cmd(f"{sys.executable} {sitemap_script}")
        if ok:
            log("Global sitemap.xml updated.")
        else:
            log(f"generate_sitemap.py error: {err}")

    # 3. Check Git Status
    ok, out, _ = run_cmd("git status --porcelain")
    if not ok:
        log("Failed to inspect git status.")
        return

    changes = [l for l in out.strip().splitlines() if l.strip()]
    if not changes:
        log("No new news files or updates detected this cycle. Waiting for next hour.")
        return

    log(f"Detected {len(changes)} changed/new files. Committing and deploying...")

    # 4. Git Add, Commit & Push (credentials from env — no secrets in code)
    now_ts = datetime.now().strftime('%Y-%m-%d %H:%M')
    run_cmd("git add .")
    ok, commit_out, commit_err = run_cmd(
        f'git commit -m "chore(news): auto-publish hourly news [{now_ts}] — new breaking stories & SEO updates"'
    )
    if not ok and "nothing to commit" not in commit_err:
        log(f"Git commit error: {commit_err}")
    else:
        log(f"Git commit created for [{now_ts}].")

    ok, push_out, push_err = run_cmd("git push origin main")
    if ok:
        log("Git push to GitHub main successful.")
    else:
        log(f"Git push warning: {push_err}")

    # 5. Deploy to Cloudflare Pages (uses env vars loaded at startup)
    deploy_cmd = (
        f'CLOUDFLARE_ACCOUNT_ID="{CF_ACCOUNT_ID}" '
        f'CLOUDFLARE_API_KEY="{CF_API_KEY}" '
        f'CLOUDFLARE_EMAIL="{CF_EMAIL}" '
        'npx -y wrangler pages deploy . --project-name=thebhom --commit-dirty=true'
    )
    ok, deploy_out, deploy_err = run_cmd(deploy_cmd)
    if ok:
        log("Cloudflare Pages deployment completed successfully!")
    else:
        log(f"Cloudflare deployment warning: {deploy_err}")

    # 6. Purge Cloudflare Cache
    purge_cloudflare_cache()

    # 7. IndexNow — instant Google/Bing indexing of new articles
    index_urls = new_article_urls if new_article_urls else [f"{SITE_URL}/news/"]
    index_urls += [f"{SITE_URL}/sitemap-news.xml", f"{SITE_URL}/news/"]
    ping_search_engines(list(dict.fromkeys(index_urls)))  # deduplicated

    # 8. Traffic Booster — Platform submissions (Reddit, Pinterest, Telegram, RSS, Mix.com)
    booster_script = os.path.join(BASE_DIR, 'scripts', 'traffic_booster.py')
    if os.path.exists(booster_script):
        ok, bout, berr = run_cmd(f"{sys.executable} {booster_script}")
        if ok:
            log("[TrafficBooster] Platform submissions complete.")
        else:
            log(f"[TrafficBooster] Warning: {berr[:100]}")

    log("Hourly Publishing Cycle finished successfully. Articles are live and ready for Google Crawl.")
    log("==================================================")

def install_launchd_agent():
    """Installs a macOS LaunchAgent to run this script every 3600 seconds (1 hour) automatically."""
    os.makedirs(os.path.dirname(PLIST_PATH), exist_ok=True)
    python_bin = sys.executable
    script_path = os.path.abspath(__file__)
    
    path_env = os.environ.get("PATH", "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin")
    if "/usr/local/bin" not in path_env:
        path_env = f"/usr/local/bin:{path_env}"

    plist_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>in.thebhom.news-hourly</string>
    <key>ProgramArguments</key>
    <array>
        <string>{python_bin}</string>
        <string>{script_path}</string>
        <string>--once</string>
    </array>
    <key>WorkingDirectory</key>
    <string>{BASE_DIR}</string>
    <key>StartInterval</key>
    <integer>3600</integer>
    <key>RunAtLoad</key>
    <true/>
    <key>StandardOutPath</key>
    <string>{LOG_FILE}</string>
    <key>StandardErrorPath</key>
    <string>{os.path.join(BASE_DIR, 'news', 'hourly_engine_err.log')}</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>{path_env}</string>
        <key>HOME</key>
        <string>{os.path.expanduser('~')}</string>
    </dict>
</dict>
</plist>
"""
    with open(PLIST_PATH, 'w', encoding='utf-8') as f:
        f.write(plist_content)

    # Unload first if previously loaded, then load
    run_cmd(f"launchctl unload {PLIST_PATH}")
    ok, out, err = run_cmd(f"launchctl load {PLIST_PATH}")
    if ok or "already loaded" in err:
        print(f"✅ LaunchAgent installed and loaded successfully at:\n   {PLIST_PATH}")
        print("   The script will now run automatically on your Mac every 1 hour (3600 seconds) in the background!")
    else:
        print(f"⚠️ Warning loading launchd agent: {err}")

def uninstall_launchd_agent():
    if os.path.exists(PLIST_PATH):
        run_cmd(f"launchctl unload {PLIST_PATH}")
        os.remove(PLIST_PATH)
        print(f"✅ LaunchAgent unloaded and removed from: {PLIST_PATH}")
    else:
        print("No LaunchAgent was found.")

def main():
    if len(sys.argv) > 1:
        arg = sys.argv[1].lower()
        if arg == '--install-daemon':
            install_launchd_agent()
            return
        elif arg == '--uninstall-daemon':
            uninstall_launchd_agent()
            return
        elif arg == '--once':
            run_hourly_cycle()
            return
        elif arg == '--status':
            ok, out, _ = run_cmd("launchctl list | grep in.thebhom.news-hourly")
            if ok and "in.thebhom.news-hourly" in out:
                print("🟢 Hourly News Service Status: ACTIVE (launchd)")
                print(f"   LaunchAgent plist: {PLIST_PATH}")
            else:
                print("⚪ Hourly News Service Status: INACTIVE (launchd)")
            if os.path.exists(LOG_FILE):
                print(f"\nLast 15 log entries ({LOG_FILE}):")
                with open(LOG_FILE, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    for l in lines[-15:]:
                        print("  " + l.strip())
            return
        elif arg == '--daemon':
            print("🚀 Running in continuous daemon mode (Ctrl+C to exit)...")
            while True:
                try:
                    run_hourly_cycle()
                    log("Sleeping for 3600 seconds (1 hour) until next cycle...")
                    time.sleep(3600)
                except KeyboardInterrupt:
                    print("\nDaemon terminated by user.")
                    break
                except Exception as e:
                    log(f"Daemon exception: {e}")
                    time.sleep(60)
            return

    # Default: Run once and offer daemon instructions
    run_hourly_cycle()

if __name__ == '__main__':
    main()
