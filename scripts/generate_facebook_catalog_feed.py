#!/usr/bin/env python3
"""
Generate Facebook Commerce Manager / Meta Catalog Product XML Feed.
Outputs a 100% standards-compliant Meta Catalog Data Feed for Facebook Page / Shop / Instagram Shopping.
"""

import os
import json
import xml.sax.saxutils as saxutils
from datetime import datetime, timezone

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CATALOG_PATH = os.path.join(BASE_DIR, "deals", "data", "catalog.json")
OUTPUT_FEED = os.path.join(BASE_DIR, "facebook-fashion-feed.xml")
OUTPUT_ALL_FEED = os.path.join(BASE_DIR, "facebook-catalog-feed.xml")

def escape_xml(val):
    if not val:
        return ""
    return saxutils.escape(str(val))

def build_feed(items, title, feed_path):
    print(f"Building {os.path.basename(feed_path)} with {len(items)} products...")
    
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">',
        '  <channel>',
        f'    <title>{escape_xml(title)}</title>',
        '    <link>https://thebhom.in</link>',
        '    <description>Best online shopping verified deals and fashion discounts in India with price tracker.</description>',
        f'    <lastBuildDate>{datetime.now(timezone.utc).strftime("%a, %d %b %Y %H:%M:%S GMT")}</lastBuildDate>'
    ]

    count = 0
    for it in items:
        pid = it.get("asin") or it.get("id")
        if not pid:
            continue
        
        # Clean ID (Meta prefers alphanumeric, underscores, hyphens)
        clean_id = str(pid).strip()
        
        # Clean title (Meta recommends max 150 chars, but accepts longer)
        raw_title = it.get("title", "").strip()
        if not raw_title:
            continue
        title_str = raw_title[:150]
        
        # Clean Price
        try:
            price_val = float(it.get("price") or 0)
        except (ValueError, TypeError):
            price_val = 0
        if price_val <= 0:
            continue
        price_str = f"{price_val:.2f} INR"

        # Dedicated Page Link on thebhom.in
        slug = it.get("slug") or clean_id
        page_link = it.get("dedicatedPage") or f"https://www.thebhom.in/deals/p/{slug}.html"
        if not page_link.startswith("http"):
            page_link = f"https://www.thebhom.in{page_link}"

        # Image
        img_link = it.get("cleanImage") or it.get("image") or ""
        if img_link.startswith("//"):
            img_link = f"https:{img_link}"
        if not img_link or not img_link.startswith("http"):
            continue

        brand = it.get("brand") or it.get("store") or "TheBhom"
        store = it.get("store") or "Store"
        discount = it.get("discountNum") or 0
        cat = it.get("category") or "fashion"
        
        desc = (
            f"Verified {discount}% OFF Deal on {store}. "
            f"Compare price history, lowest drop alerts & buy directly with verified guarantee on TheBhom. "
            f"{raw_title[:200]}"
        )

        lines.append('    <item>')
        lines.append(f'      <g:id>{escape_xml(clean_id)}</g:id>')
        lines.append(f'      <g:title>{escape_xml(title_str)}</g:title>')
        lines.append(f'      <g:description>{escape_xml(desc)}</g:description>')
        lines.append(f'      <g:link>{escape_xml(page_link)}</g:link>')
        lines.append(f'      <g:image_link>{escape_xml(img_link)}</g:image_link>')
        lines.append(f'      <g:brand>{escape_xml(brand[:70])}</g:brand>')
        lines.append('      <g:condition>new</g:condition>')
        lines.append('      <g:availability>in_stock</g:availability>')
        lines.append(f'      <g:price>{price_str}</g:price>')
        
        # Original MRP if higher
        try:
            mrp_val = float(it.get("mrp") or 0)
            if mrp_val > price_val:
                lines.append(f'      <g:sale_price>{price_str}</g:sale_price>')
        except (ValueError, TypeError):
            pass

        # Category mapping for Meta
        if cat in ["fashion", "footwear", "clothing"]:
            lines.append('      <g:google_product_category>Apparel &amp; Accessories</g:google_product_category>')
            lines.append('      <g:fb_product_category>clothing &amp; accessories</g:fb_product_category>')
        elif cat in ["beauty", "personal care"]:
            lines.append('      <g:google_product_category>Health &amp; Beauty</g:google_product_category>')
            lines.append('      <g:fb_product_category>health &amp; beauty</g:fb_product_category>')
        else:
            lines.append('      <g:google_product_category>Home &amp; Garden</g:google_product_category>')

        lines.append(f'      <g:custom_label_0>{escape_xml(cat)}</g:custom_label_0>')
        lines.append(f'      <g:custom_label_1>{escape_xml(store)}</g:custom_label_1>')
        if discount:
            lines.append(f'      <g:custom_label_2>{discount}% OFF</g:custom_label_2>')
            
        lines.append('    </item>')
        count += 1

    lines.append('  </channel>')
    lines.append('</rss>')

    with open(feed_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    print(f"✅ Generated {os.path.basename(feed_path)} with {count} items.")
    return count

def main():
    if not os.path.exists(CATALOG_PATH):
        print(f"❌ Catalog file not found at {CATALOG_PATH}")
        return

    with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
        catalog = json.load(f)

    print(f"Loaded {len(catalog)} total catalog items.")

    # 1. Fashion Only Feed (fashion, footwear, beauty)
    fashion_items = [
        it for it in catalog
        if it.get("category") in ["fashion", "footwear", "beauty"] or "women" in str(it.get("department", "")).lower()
    ]
    build_feed(fashion_items, "TheBhom Fashion & Ethnic Deals — Facebook Catalog Feed", OUTPUT_FEED)

    # 2. All Deals Feed
    build_feed(catalog, "TheBhom Verified Deals — Facebook Catalog Feed", OUTPUT_ALL_FEED)

if __name__ == "__main__":
    main()
