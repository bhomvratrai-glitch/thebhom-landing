#!/usr/bin/env python3
"""
TheBhom Traffic Booster — Master Script
Auto-submits news to 10+ platforms every hour for max organic traffic.
"""
import os, sys, re, json, time, random, urllib.request, urllib.parse, urllib.error
import ssl, subprocess
from datetime import datetime, timezone

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOG_FILE = os.path.join(BASE_DIR, 'news', 'traffic_booster.log')
SITE_URL = 'https://www.thebhom.in'
CTX      = ssl._create_unverified_context()

def _load_creds():
    cred = os.path.expanduser('~/.gemini/config/credentials.env')
    if os.path.exists(cred):
        with open(cred) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, _, v = line.partition('=')
                    os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
_load_creds()

INDEXNOW_KEY    = os.environ.get('INDEXNOW_KEY', 'thebhom-indexnow-key-2024')
TELEGRAM_TOKEN  = os.environ.get('TELEGRAM_BOT_TOKEN', '')
TELEGRAM_CHAT   = os.environ.get('TELEGRAM_CHANNEL_ID', '')
PINTEREST_TOKEN = os.environ.get('PINTEREST_ACCESS_TOKEN', '')
REDDIT_CLIENT_ID     = os.environ.get('REDDIT_CLIENT_ID', '')
REDDIT_CLIENT_SECRET = os.environ.get('REDDIT_CLIENT_SECRET', '')

def log(msg):
    ts = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    line = f"[{ts}] {msg}"
    print(line)
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(line + '\n')

def http_post(url, data, headers=None, timeout=15):
    try:
        if isinstance(data, dict):
            data = json.dumps(data).encode('utf-8')
            h = {'Content-Type': 'application/json; charset=utf-8', 'User-Agent': 'TheBhomBot/2.0'}
        elif isinstance(data, str):
            data = data.encode('utf-8')
            h = {'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'TheBhomBot/2.0'}
        else:
            h = {'User-Agent': 'TheBhomBot/2.0'}
        if headers:
            h.update(headers)
        req = urllib.request.Request(url, data=data, headers=h, method='POST')
        with urllib.request.urlopen(req, context=CTX, timeout=timeout) as r:
            return r.status, r.read().decode('utf-8', errors='ignore')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8', errors='ignore')
    except Exception as e:
        return 0, str(e)

def http_get(url, headers=None, timeout=10):
    try:
        req = urllib.request.Request(url, headers=headers or {'User-Agent': 'TheBhomBot/2.0'})
        with urllib.request.urlopen(req, context=CTX, timeout=timeout) as r:
            return r.status, r.read().decode('utf-8', errors='ignore')
    except Exception as e:
        return 0, str(e)

def get_news_urls(limit=100):
    _, xml = http_get(f'{SITE_URL}/sitemap-news.xml')
    return re.findall(r'<loc>([^<]+)</loc>', xml)[:limit]

def parse_articles(urls, limit=10):
    arts = []
    news_dir = os.path.join(BASE_DIR, 'news')
    for url in urls[:limit]:
        slug = url.rstrip('/').split('/')[-1]
        html_file = os.path.join(news_dir, f"{slug}.html")
        if not os.path.exists(html_file):
            arts.append({'url': url, 'title': slug.replace('-', ' ').title(), 'desc': '', 'category': 'India'})
            continue
        with open(html_file, encoding='utf-8') as f:
            html = f.read()
        title_m = re.search(r'<title>([^<]+)</title>', html)
        desc_m  = re.search(r'<meta name="description" content="([^"]+)"', html)
        img_m   = re.search(r'<meta property="og:image" content="([^"]+)"', html)
        cat_m   = re.search(r'"articleSection"\s*:\s*"([^"]+)"', html)
        arts.append({
            'url': url,
            'title': (title_m.group(1) if title_m else slug).replace(' — TheBhom News', '').strip(),
            'desc': desc_m.group(1) if desc_m else '',
            'image': img_m.group(1) if img_m else f"{SITE_URL}/assets/og-default.jpg",
            'category': cat_m.group(1) if cat_m else 'India',
        })
    return arts

# ── IndexNow ──────────────────────────────────────────────────────────────────
def submit_indexnow(urls):
    payload = {"host": "www.thebhom.in", "key": INDEXNOW_KEY,
               "keyLocation": f"{SITE_URL}/{INDEXNOW_KEY}.txt", "urlList": urls[:100]}
    for ep in ["https://api.indexnow.org/indexnow", "https://www.bing.com/indexnow"]:
        s, _ = http_post(ep, payload)
        log(f"[IndexNow] {ep} -> HTTP {s} ({len(urls)} URLs)")
        time.sleep(1)

# ── RSS Feed ──────────────────────────────────────────────────────────────────
def generate_rss(arts):
    now_rfc = datetime.now(timezone.utc).strftime('%a, %d %b %Y %H:%M:%S +0000')
    items = ""
    for a in arts:
        items += f"""  <item>
    <title><![CDATA[{a['title']}]]></title>
    <link>{a['url']}</link>
    <description><![CDATA[{a['desc']}]]></description>
    <pubDate>{now_rfc}</pubDate>
    <guid isPermaLink="true">{a['url']}</guid>
    <category><![CDATA[{a['category']}]]></category>
    <media:content url="{a['image']}" medium="image"/>
  </item>\n"""
    feed = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>TheBhom News — ताज़ा खबरें</title>
    <link>{SITE_URL}/news/</link>
    <description>भारत की ताज़ा खबरें, ट्रेंडिंग स्टोरीज़, स्पेस, टेक और मनोरंजन</description>
    <language>hi-IN</language>
    <managingEditor>bhomvratrai@gmail.com (TheBhom)</managingEditor>
    <atom:link href="{SITE_URL}/news/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>{now_rfc}</lastBuildDate>
    <ttl>60</ttl>
{items}  </channel>
</rss>"""
    path = os.path.join(BASE_DIR, 'news', 'feed.xml')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(feed)
    log(f"[RSS] Generated feed.xml with {len(arts)} items -> {SITE_URL}/news/feed.xml")

# ── Telegram ──────────────────────────────────────────────────────────────────
def post_telegram(arts):
    if not TELEGRAM_TOKEN or not TELEGRAM_CHAT:
        log("[Telegram] Not configured (add TELEGRAM_BOT_TOKEN + TELEGRAM_CHANNEL_ID to credentials.env)")
        return
    for a in arts[:5]:
        msg = f"🔴 *{a['title']}*\n\n{a['desc'][:200]}\n\n[📰 पूरी खबर पढ़ें]({a['url']})"
        s, r = http_post(f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage",
                          {"chat_id": TELEGRAM_CHAT, "text": msg, "parse_mode": "Markdown"})
        log(f"[Telegram] HTTP {s} — {a['title'][:40]}")
        time.sleep(2)

# ── Pinterest ─────────────────────────────────────────────────────────────────
def post_pinterest(arts):
    if not PINTEREST_TOKEN:
        log("[Pinterest] PINTEREST_ACCESS_TOKEN not set — skipping")
        return
    for a in arts[:3]:
        payload = {"title": a['title'][:100], "description": a['desc'][:500] + f"\n\n{a['url']}",
                   "link": a['url'], "board_id": "1136030754424748023",
                   "media_source": {"source_type": "image_url", "url": a['image']}}
        s, r = http_post("https://api.pinterest.com/v5/pins", payload,
                          headers={"Authorization": f"Bearer {PINTEREST_TOKEN}"})
        log(f"[Pinterest] HTTP {s} — {a['title'][:40]}")
        time.sleep(3)

# ── Reddit ────────────────────────────────────────────────────────────────────
REDDIT_SUBS = {
    'bollywood': ['bollywood', 'india'], 'cinema': ['bollywood'],
    'cricket': ['Cricket'], 'sports': ['Cricket'],
    'stock': ['IndianStockMarket'], 'business': ['IndianStockMarket'],
    'space': ['space'], 'isro': ['space', 'india'],
    'tech': ['technology'], 'ai': ['technology'],
    'politics': ['IndiaSpeaks'], 'india': ['india'],
}

def reddit_token():
    if not REDDIT_CLIENT_ID: return None
    import base64
    auth = base64.b64encode(f"{REDDIT_CLIENT_ID}:{REDDIT_CLIENT_SECRET}".encode()).decode()
    s, r = http_post("https://www.reddit.com/api/v1/access_token",
                      "grant_type=client_credentials",
                      headers={"Authorization": f"Basic {auth}",
                                "User-Agent": "TheBhomBot/2.0 by bhomvratrai-glitch"})
    if s == 200:
        return json.loads(r).get('access_token')
    return None

def post_reddit(arts, token):
    if not token:
        log("[Reddit] No token — add REDDIT_CLIENT_ID + REDDIT_CLIENT_SECRET to credentials.env")
        return
    posted = set()
    for a in arts[:5]:
        cat = a.get('category', 'india').lower()
        subs = REDDIT_SUBS.get(cat, ['india'])
        for sub in subs[:1]:
            if sub in posted: continue
            data = urllib.parse.urlencode({'sr': sub, 'kind': 'link',
                                            'title': a['title'][:300], 'url': a['url'],
                                            'resubmit': True})
            s, r = http_post("https://oauth.reddit.com/api/submit", data,
                              headers={"Authorization": f"bearer {token}",
                                        "User-Agent": "TheBhomBot/2.0 by bhomvratrai-glitch"})
            errs = json.loads(r).get('json', {}).get('errors', []) if s == 200 else []
            status_txt = "✅" if s == 200 and not errs else f"HTTP {s}"
            log(f"[Reddit] {status_txt} r/{sub}: {a['title'][:50]}")
            posted.add(sub)
            time.sleep(3)

# ── Feedly/RSS Discovery ───────────────────────────────────────────────────────
def rss_aggregator_ping():
    rss = urllib.parse.quote(f"{SITE_URL}/news/feed.xml")
    s, _ = http_get(f"https://cloud.feedly.com/v3/search/feeds?query={urllib.parse.quote(SITE_URL)}")
    log(f"[Feedly] Discovery ping HTTP {s}")

# ── MAIN ──────────────────────────────────────────────────────────────────────
def main():
    log("=" * 58)
    log("TheBhom Traffic Booster STARTED")

    urls = get_news_urls(100)
    arts = parse_articles(urls, 10)
    log(f"Loaded {len(urls)} URLs, parsed {len(arts)} articles")

    log("--- IndexNow Bulk Submit ---")
    submit_indexnow(urls)

    log("--- RSS Feed Generation ---")
    all_arts = parse_articles(urls, 30)
    generate_rss(all_arts)

    log("--- Telegram Push ---")
    post_telegram(arts)

    log("--- Pinterest Auto-Pin ---")
    post_pinterest(arts)

    log("--- Reddit Submissions ---")
    tok = reddit_token()
    post_reddit(arts, tok)

    log("--- RSS Aggregator Ping ---")
    rss_aggregator_ping()

    log("Traffic Booster cycle DONE!")
    log("=" * 58)

if __name__ == '__main__':
    main()
