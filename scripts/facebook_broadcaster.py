#!/usr/bin/env python3
"""
TheBhom Autonomous Facebook Page Deals Broadcaster
Broadcasts verified lowest-price fashion & lifestyle loot drops directly to Facebook Page
with HD product photos, 1-click affiliate links, and TheBhom price tracker pages.
"""

import json
import os
import re
import ssl
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CRED_FILE = os.path.expanduser('~/.gemini/config/credentials.env')
STATE_FILE = os.path.join(BASE_DIR, 'scripts', 'facebook_posted.json')
CATALOG_PATH = os.path.join(BASE_DIR, 'deals', 'data', 'catalog.json')
SITE_URL = "https://thebhom.in"

def load_credentials():
    creds = {
        'FB_PAGE_ID': os.environ.get('FB_PAGE_ID', os.environ.get('FACEBOOK_PAGE_ID', '')),
        'FB_PAGE_ACCESS_TOKEN': os.environ.get('FB_PAGE_ACCESS_TOKEN', os.environ.get('FACEBOOK_PAGE_ACCESS_TOKEN', '')),
        'EARNKARO_API_TOKEN': os.environ.get('EARNKARO_API_TOKEN', ''),
        'EARNKARO_USER_ID': os.environ.get('EARNKARO_USER_ID', '5610321')
    }
    if os.path.exists(CRED_FILE):
        with open(CRED_FILE, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line.startswith('export '):
                    line = line[7:]
                if '=' in line and not line.startswith('#'):
                    k, v = line.split('=', 1)
                    v = v.strip().strip('"').strip("'")
                    if k in creds and not creds[k]:
                        creds[k] = v
                    elif k.upper() in ['FB_PAGE_ID', 'FACEBOOK_PAGE_ID']:
                        creds['FB_PAGE_ID'] = v
                    elif k.upper() in ['FB_PAGE_ACCESS_TOKEN', 'FACEBOOK_PAGE_ACCESS_TOKEN', 'FB_ACCESS_TOKEN']:
                        creds['FB_PAGE_ACCESS_TOKEN'] = v
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

def ensure_affiliate_link(raw_url, profit_link=None, store=""):
    """
    Guarantees active affiliate attribution for commission:
    - Amazon: binds tag=bhom120704-21
    - Flipkart / Myntra / Ajio / Tatacliq / Reliance / Others: converts to EarnKaro profit link
    """
    store_lower = store.lower()
    
    # 1. Amazon direct tracking
    if 'amazon' in store_lower or 'amazon.in' in raw_url or 'amzn.to' in raw_url:
        target = raw_url or profit_link or ''
        if 'tag=' not in target:
            sep = '&' if '?' in target else '?'
            return f"{target}{sep}tag=bhom120704-21"
        return target
        
    # 2. Check existing profitLink if already an EarnKaro shortlink
    if profit_link and any(dom in profit_link for dom in ['fkrt.cc', 'myntr.it', 'ajiio.in', 'ekaro.in', 'linkredirect.in']):
        return profit_link
        
    dest_url = raw_url or profit_link or ''
    if not dest_url:
        return ''
        
    # 3. EarnKaro API conversion for Flipkart / Myntra / Ajio / etc.
    creds = load_credentials()
    token = creds.get('EARNKARO_API_TOKEN', '')
    user_id = creds.get('EARNKARO_USER_ID', '5610321')
    
    if token:
        try:
            req = urllib.request.Request(
                "https://ekaro-api.affiliaters.in/api/converter/public",
                data=json.dumps({"deal": dest_url, "convert_option": "convert_only"}).encode("utf-8"),
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {token}",
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
                }
            )
            ctx = ssl._create_unverified_context()
            with urllib.request.urlopen(req, context=ctx, timeout=8) as res:
                data = json.loads(res.read().decode("utf-8"))
                if data.get("success") and data.get("data"):
                    return data["data"].strip()
        except Exception as e:
            print(f"[⚠️ EarnKaro API Fallback for {dest_url[:40]}]: {e}")
            
    # 4. Reliable EarnKaro Redirect Fallback
    encoded = urllib.parse.quote(dest_url, safe='')
    return f"https://trackingv3.linkredirect.in/visitretailer/2?id={user_id}&url={encoded}"

def get_latest_fashion_deals(limit=10):
    if not os.path.exists(CATALOG_PATH):
        return []
    try:
        with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
            items = json.load(f)
        
        # Filter for Fashion / Ethnic / Footwear / Beauty
        fashion_items = [
            it for it in items
            if it.get("category") in ["fashion", "footwear", "beauty"] or "women" in str(it.get("department", "")).lower()
        ]
        
        # Sort by highest verified discount %
        fashion_items.sort(key=lambda x: int(x.get('discountNum', 0) or 0), reverse=True)
        posted = get_posted_ids()
        
        deals = []
        for it in fashion_items:
            pid = it.get('asin') or it.get('id')
            if not pid or pid in posted:
                continue
                
            title = it.get('title', '').strip()
            price = str(it.get('price', '')).strip()
            mrp = str(it.get('mrp', '')).strip()
            discount = it.get('discountNum', 0)
            store = it.get('store', 'Store').strip()
            
            direct_url = ensure_affiliate_link(
                raw_url=it.get('url', ''),
                profit_link=it.get('profitLink', ''),
                store=store
            )
            
            slug = it.get('slug') or pid
            page_url = it.get('dedicatedPage') or f"{SITE_URL}/deals/p/{slug}.html"
            img = it.get('cleanImage') or it.get('image') or ""
            if img.startswith('//'):
                img = f"https:{img}"
                
            deals.append({
                'id': pid,
                'title': title,
                'price': price,
                'mrp': mrp,
                'discount': discount,
                'store': store,
                'store_url': direct_url,
                'page_url': page_url,
                'image': img
            })
            if len(deals) >= limit:
                break
        return deals
    except Exception as e:
        print(f"[⚠️ Error loading catalog]: {e}")
        return []

def format_facebook_post(deal):
    title = deal['title']
    price = deal.get('price', '')
    mrp = deal.get('mrp', '')
    discount = deal.get('discount', 0)
    store = deal.get('store', 'Store')
    store_url = deal['store_url']
    page_url = deal['page_url']
    
    price_str = f"₹{price}" if price else "Loot Price"
    mrp_str = f" (~₹{mrp}~)" if mrp and mrp != price else ""
    disc_str = f" (🔥 {discount}% OFF)" if discount else ""
    
    clean_store = store.replace(" ", "")
    
    message = (
        f"🔥 LOOT DEAL ALERT | THEBHOM 🔥\n\n"
        f"🛍️ {title}\n\n"
        f"💰 Deal Price: {price_str}{mrp_str}{disc_str}\n"
        f"🏪 Store: {store}\n\n"
        f"⚡ 1-Click Direct Store Purchase:\n"
        f"👉 {store_url}\n\n"
        f"🌐 View Full Price History & Verified Tracker:\n"
        f"👉 {page_url}\n\n"
        f"📢 Join Our Deal Alerts Channel: https://thebhom.in/deals/\n\n"
        f"#FashionDeals #LootDeals #IndianFashion #{clean_store} #OnlineShopping #TheBhom #EthnicWear #DiscountAlerts"
    )
    return message

def post_to_facebook_page(page_id, access_token, deal):
    """
    Publishes a photo post with caption to Facebook Page using Graph API v19.0.
    """
    caption = format_facebook_post(deal)
    image_url = deal.get('image')
    
    ctx = ssl._create_unverified_context()
    
    # 1. Post Photo with Caption
    if image_url and image_url.startswith('http'):
        url = f"https://graph.facebook.com/v19.0/{page_id}/photos"
        payload = {
            'url': image_url,
            'caption': caption,
            'access_token': access_token
        }
        data = urllib.parse.urlencode(payload).encode('utf-8')
        req = urllib.request.Request(
            url,
            data=data,
            headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}
        )
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=20) as resp:
                res_body = json.loads(resp.read().decode('utf-8'))
                post_id = res_body.get('id') or res_body.get('post_id')
                print(f"[✅ Facebook Photo Post Sent]: {deal['title'][:40]} (Post ID: {post_id})")
                return True
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode('utf-8', errors='ignore')
            print(f"[⚠️ Facebook Photo Post Failed]: HTTP {e.code} - {err_msg}")
        except Exception as e:
            print(f"[⚠️ Facebook Photo Post Error]: {e}")
            
    # 2. Fallback to Link/Text Post on Page Feed
    url = f"https://graph.facebook.com/v19.0/{page_id}/feed"
    payload = {
        'message': caption,
        'link': deal.get('page_url'),
        'access_token': access_token
    }
    data = urllib.parse.urlencode(payload).encode('utf-8')
    req = urllib.request.Request(
        url,
        data=data,
        headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}
    )
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=20) as resp:
            res_body = json.loads(resp.read().decode('utf-8'))
            post_id = res_body.get('id')
            print(f"[✅ Facebook Feed Post Sent]: {deal['title'][:40]} (Post ID: {post_id})")
            return True
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8', errors='ignore')
        print(f"[❌ Facebook Feed Post Failed]: HTTP {e.code} - {err_msg}")
        return False
    except Exception as e:
        print(f"[❌ Facebook Feed Post Error]: {e}")
        return False

def run_broadcast(max_items=2):
    creds = load_credentials()
    page_id = creds.get('FB_PAGE_ID')
    access_token = creds.get('FB_PAGE_ACCESS_TOKEN')
    
    deals = get_latest_fashion_deals(limit=max_items)
    if not deals:
        print("[ℹ️ Facebook Broadcaster] No new unposted fashion deals found.")
        return False
        
    if not page_id or not access_token:
        print("="*60)
        print("⚠️ [Facebook Broadcaster Notice]: FB_PAGE_ID or FB_PAGE_ACCESS_TOKEN not yet configured!")
        print("Here is a preview of the high-converting Fashion Deal Post ready to be published:")
        print("="*60)
        sample = deals[0]
        print(f"Target Image: {sample['image']}")
        print("Post Text:")
        print(format_facebook_post(sample))
        print("="*60)
        print("💡 To enable 24/7 automated live posting to Facebook:")
        print("1. Set FB_PAGE_ID and FB_PAGE_ACCESS_TOKEN in ~/.gemini/config/credentials.env")
        print("2. Or add them as GitHub Secrets (FB_PAGE_ID & FB_PAGE_ACCESS_TOKEN)")
        print("="*60)
        return False
        
    posted = get_posted_ids()
    sent_count = 0
    
    for deal in deals:
        success = post_to_facebook_page(page_id, access_token, deal)
        if success:
            posted.add(deal['id'])
            sent_count += 1
            time.sleep(3)
        else:
            print(f"[⚠️ Facebook Broadcaster] Stopping loop after post failure.")
            break
            
    save_posted_ids(posted)
    print(f"[🚀 Facebook Broadcast Complete] Successfully published {sent_count} deals to Facebook Page {page_id}.")
    return sent_count > 0

if __name__ == '__main__':
    max_count = 2
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        max_count = int(sys.argv[1])
    run_broadcast(max_items=max_count)

