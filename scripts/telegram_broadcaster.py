#!/usr/bin/env python3
"""
TheBhom Telegram Broadcaster & Instant Click Pipeline
Autonomous Telegram channel broadcast engine for Breaking News & Hot Deals.
"""

import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CRED_FILE = os.path.expanduser('~/.gemini/config/credentials.env')
STATE_FILE = os.path.join(BASE_DIR, 'scripts', 'telegram_posted.json')
SITE_URL = "https://thebhom.in"

def load_credentials():
    creds = {}
    if os.path.exists(CRED_FILE):
        with open(CRED_FILE, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line.startswith('export '):
                    line = line[7:]
                if '=' in line and not line.startswith('#'):
                    k, v = line.split('=', 1)
                    v = v.strip().strip('"').strip("'")
                    creds[k.strip()] = v
    return creds

def get_posted_ids():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, 'r', encoding='utf-8') as f:
                return set(json.load(f))
        except Exception:
            return set()
    return set()

def save_posted_ids(posted):
    with open(STATE_FILE, 'w', encoding='utf-8') as f:
        json.dump(list(posted)[-500:], f, indent=2)

def telegram_api(token, method, payload):
    url = f"https://api.telegram.org/bot{token}/{method}"
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return resp.status, json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8', errors='ignore')
        return e.code, body
    except Exception as e:
        return 0, str(e)

def verify_bot(token):
    s, r = telegram_api(token, "getMe", {})
    if s == 200 and isinstance(r, dict) and r.get('ok'):
        bot = r.get('result', {})
        print(f"[✅ Telegram] Bot connected: @{bot.get('username')} ({bot.get('first_name')})")
        return True, bot
    print(f"[❌ Telegram] Bot token invalid or network error: HTTP {s} - {r}")
    return False, None

def get_latest_news():
    news_dir = os.path.join(BASE_DIR, 'news')
    articles = []
    if not os.path.exists(news_dir):
        return articles
    
    files = [os.path.join(news_dir, f) for f in os.listdir(news_dir) if f.endswith('.html') and f != 'index.html']
    files.sort(key=lambda x: os.path.getmtime(x), reverse=True)
    
    for fpath in files[:10]:
        try:
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
            title_m = re.search(r'<title>([^<]+)</title>', content)
            desc_m = re.search(r'<meta name="description" content="([^"]+)"', content)
            img_m = re.search(r'<meta property="og:image" content="([^"]+)"', content)
            slug = os.path.basename(fpath).replace('.html', '')
            
            title = title_m.group(1).replace(' — TheBhom News', '').strip() if title_m else slug
            desc = desc_m.group(1).strip() if desc_m else ''
            img = img_m.group(1).strip() if img_m else f"{SITE_URL}/assets/og-default.jpg"
            
            articles.append({
                'id': slug,
                'type': 'news',
                'title': title,
                'desc': desc,
                'image': img,
                'url': f"{SITE_URL}/news/{slug}.html"
            })
        except Exception:
            continue
    return articles

def broadcast_item(token, channel, item):
    title = item['title']
    desc = item['desc'][:220] + '...' if len(item['desc']) > 220 else item['desc']
    url = item['url']
    img = item['image']
    
    caption = (
        f"🚨 *BREAKING NEWS | THEBHOM*\n\n"
        f"*{title}*\n\n"
        f"{desc}\n\n"
        f"👉 [पूरी खबर यहाँ पढ़ें]({url})\n"
        f"🌐 [TheBhom.in पर ताज़ा अपडेट्स]({SITE_URL}/news/)"
    )
    
    # Try photo message first
    photo_payload = {
        "chat_id": channel,
        "photo": img,
        "caption": caption,
        "parse_mode": "Markdown",
        "reply_markup": {
            "inline_keyboard": [
                [{"text": "📰 पूरी खबर पढ़ें (Click Here)", "url": url}],
                [{"text": "⚡ ताज़ा खबरें (TheBhom News)", "url": f"{SITE_URL}/news/"}]
            ]
        }
    }
    
    status, resp = telegram_api(token, "sendPhoto", photo_payload)
    if status == 200:
        print(f"[✅ Telegram Sent] {title[:40]} -> {channel}")
        return True
    
    # Fallback to plain text message
    text_payload = {
        "chat_id": channel,
        "text": caption,
        "parse_mode": "Markdown",
        "disable_web_page_preview": False,
        "reply_markup": {
            "inline_keyboard": [
                [{"text": "📰 पूरी खबर पढ़ें", "url": url}]
            ]
        }
    }
    status2, resp2 = telegram_api(token, "sendMessage", text_payload)
    if status2 == 200:
        print(f"[✅ Telegram Sent Text] {title[:40]} -> {channel}")
        return True
    else:
        print(f"[❌ Telegram Failed] HTTP {status2}: {resp2}")
        return False

def run_broadcast(max_items=2):
    creds = load_credentials()
    token = creds.get('TELEGRAM_BOT_TOKEN')
    channel = creds.get('TELEGRAM_CHANNEL_ID')
    
    if not token or not channel:
        print("[⚠️ Telegram Broadcaster] TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID not set in credentials.env")
        print(f"Token present: {bool(token)}, Channel present: {bool(channel)}")
        return False
    
    ok, _ = verify_bot(token)
    if not ok:
        return False
    
    posted = get_posted_ids()
    articles = get_latest_news()
    
    sent_count = 0
    for art in articles:
        if art['id'] in posted:
            continue
        success = broadcast_item(token, channel, art)
        if success:
            posted.add(art['id'])
            sent_count += 1
            time.sleep(3)
        if sent_count >= max_items:
            break
            
    save_posted_ids(posted)
    print(f"[🚀 Telegram Broadcast Complete] Sent {sent_count} fresh stories.")
    return True

if __name__ == '__main__':
    run_broadcast()
