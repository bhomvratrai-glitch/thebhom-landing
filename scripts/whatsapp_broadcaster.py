#!/usr/bin/env python3
"""
TheBhom Autonomous WhatsApp Deals Broadcaster
Formats verified lowest-price loot deals with:
- HD Product Photo
- Deal Price, MRP, & % OFF
- 1-Click Affiliate Link (Amazon tag bhom120704-21 & EarnKaro for Myntra/Flipkart/Ajio)
- Dedicated Product Page Link on TheBhom (thebhom.in/deals/p/...)
- Auto-syndication to WhatsApp Official Channel (0029Vb9DmoaEKyZLLKtLdc2I)
"""

import os
import sys
import json
import re
import ssl
import subprocess
import urllib.parse
import urllib.request
from datetime import datetime, timezone

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CATALOG_PATH = os.path.join(BASE_DIR, "deals", "data", "catalog.json")
STATE_FILE = os.path.join(BASE_DIR, "scripts", "whatsapp_posted.json")
CRED_FILE = os.path.expanduser('~/.gemini/config/credentials.env')
SITE_URL = "https://thebhom.in"
DEFAULT_WA_CHANNEL = "https://whatsapp.com/channel/0029Vb9DmoaEKyZLLKtLdc2I"

def load_credentials():
    creds = {
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
                    elif k.upper() in ['EARNKARO_API_TOKEN', 'EARNKARO_TOKEN']:
                        creds['EARNKARO_API_TOKEN'] = v
                    elif k.upper() in ['EARNKARO_USER_ID']:
                        creds['EARNKARO_USER_ID'] = v
    return creds

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
    if profit_link and any(dom in profit_link for dom in ['fkrt.cc', 'myntr.it', 'ajiio.in', 'ekaro.in', 'linkredirect.in', 'fktr.in']):
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

def get_posted_ids():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                return set(json.load(f))
        except Exception:
            return set()
    return set()

def save_posted_ids(posted):
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(list(posted)[-500:], f, indent=2)

def get_top_loot_deals(limit=2):
    if not os.path.exists(CATALOG_PATH):
        return []
    try:
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            items = json.load(f)
        
        # Sort by highest genuine discount percentage
        items_sorted = sorted(items, key=lambda x: (int(x.get("discountNum", 0) or 0)), reverse=True)
        posted = get_posted_ids()
        
        deals = []
        for it in items_sorted:
            pid = it.get("asin") or it.get("id")
            if not pid or pid in posted:
                continue
            
            title = it.get("title", "").strip()
            price = str(it.get("price", "")).strip()
            mrp = str(it.get("mrp", "")).strip()
            discount = it.get("discountNum", 0)
            store = it.get("store", "Store").strip()
            
            # Guaranteed Affiliate Conversion
            direct_url = ensure_affiliate_link(
                raw_url=it.get("url", ""),
                profit_link=it.get("profitLink", ""),
                store=store
            )
            
            slug = it.get("slug") or pid
            page_url = it.get("dedicatedPage") or f"{SITE_URL}/deals/p/{slug}.html"
            img = it.get("cleanImage") or it.get("image") or ""
            if img.startswith("//"):
                img = f"https:{img}"
            
            deals.append({
                "id": pid,
                "title": title,
                "price": price,
                "mrp": mrp,
                "discount": discount,
                "store": store,
                "store_url": direct_url,
                "page_url": page_url,
                "image": img
            })
            if len(deals) >= limit:
                break
        return deals
    except Exception as e:
        print(f"[⚠️ Error reading catalog]: {e}")
        return []

def format_whatsapp_deal_message(deal, channel_link=DEFAULT_WA_CHANNEL):
    title = deal["title"]
    price = deal.get("price", "")
    mrp = deal.get("mrp", "")
    discount = deal.get("discount", 0)
    store = deal.get("store", "Store")
    store_url = deal["store_url"]
    page_url = deal["page_url"]
    
    price_str = f"₹{price}" if price else "Loot Price"
    mrp_str = f" ~₹{mrp}~" if mrp and mrp != price else ""
    disc_str = f" (🔥 *{discount}% OFF*)" if discount else ""
    
    msg = (
        f"🔥 *LOOT DEAL ALERT | THEBHOM* 🔥\n\n"
        f"🛍️ *{title}*\n\n"
        f"💰 *Deal Price: {price_str}*{mrp_str}{disc_str}\n"
        f"🏪 *Store:* {store}\n\n"
        f"⚡ *1-Click Direct Store Purchase:*\n"
        f"👉 {store_url}\n\n"
        f"🌐 *Check Price History & Live Tracker:*\n"
        f"👉 {page_url}\n\n"
        f"📢 *Join WhatsApp Channel for 24/7 Loot Drops:*\n"
        f"👉 {channel_link}"
    )
    return msg

def main(max_count=2):
    deals = get_top_loot_deals(limit=max_count)
    if not deals:
        print("[ℹ️ WhatsApp Broadcaster] No new unposted loot deals found.")
        return
    
    posted = get_posted_ids()
    wa_script = os.path.join(BASE_DIR, "scripts", "wa_cloud", "send_broadcast.mjs")
    print(f"[🚀 WhatsApp Broadcaster] Broadcasting {len(deals)} verified loot deals to WhatsApp Channel:")
    
    for d in deals:
        if os.path.exists(wa_script):
            try:
                res = subprocess.run(
                    ["node", wa_script, "--json", json.dumps(d)],
                    cwd=os.path.join(BASE_DIR, "scripts", "wa_cloud"),
                    capture_output=True,
                    text=True,
                    timeout=35
                )
                if res.returncode == 0:
                    print(f"[✅ WhatsApp Live Sent with Image]: {d['title'][:40]}")
                    posted.add(d["id"])
                else:
                    err = res.stderr.strip() or res.stdout.strip()
                    print(f"[⚠️ WhatsApp Live Notice]: {err}")
            except Exception as e:
                print(f"[⚠️ WhatsApp Execution Error]: {e}")
        else:
            text = format_whatsapp_deal_message(d)
            print("-----------------------------------------")
            print(text)
            print("-----------------------------------------")
            posted.add(d["id"])
    
    save_posted_ids(posted)
    print(f"[✅ WhatsApp Broadcaster] {len(deals)} deals processed and recorded in whatsapp_posted.json")

if __name__ == "__main__":
    count = 2
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        count = int(sys.argv[1])
    main(max_count=count)
