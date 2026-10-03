#!/usr/bin/env python3
"""Generate merged flat sitemap.xml with all URLs in one file.
Runs during GitHub Actions deploy."""

import datetime

today = datetime.date.today().isoformat()
base = "https://www.thebhom.in"

lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
]

# Core Tools & Digital Products (High Priority)
main_pages = [
    (f"{base}/", "daily", "1.0"),
    (f"{base}/tools/", "daily", "0.95"),
    (f"{base}/tools/clean-csv.html", "weekly", "0.85"),
    (f"{base}/tools/compress-image.html", "weekly", "0.85"),
    (f"{base}/tools/convert-jpg-to-webp.html", "weekly", "0.85"),
    (f"{base}/tools/convert-png-to-jpg.html", "weekly", "0.85"),
    (f"{base}/tools/merge-pdf.html", "weekly", "0.85"),
    (f"{base}/tools/pdf-to-image.html", "weekly", "0.85"),
    (f"{base}/tools/resize-image-online.html", "weekly", "0.85"),
    (f"{base}/tools/rotate-pdf.html", "weekly", "0.85"),
    (f"{base}/tools/split-pdf-pages.html", "weekly", "0.85"),
    (f"{base}/tools/watermark-pdf.html", "weekly", "0.85"),
    (f"{base}/tools/ai.html", "weekly", "0.85"),
    (f"{base}/tools/automation.html", "weekly", "0.85"),
    (f"{base}/tools/products.html", "weekly", "0.85"),
    (f"{base}/downloader/", "daily", "0.9"),
    (f"{base}/wallpapers.html", "daily", "0.9"),
    (f"{base}/ebooks.html", "weekly", "0.9"),
    (f"{base}/magazines.html", "weekly", "0.9"),
    (f"{base}/cards.html", "weekly", "0.9"),
    (f"{base}/templates.html", "weekly", "0.9"),
    (f"{base}/pricing.html", "weekly", "0.85"),
    (f"{base}/checkout.html", "weekly", "0.85"),
    (f"{base}/dashboard.html", "weekly", "0.8"),
    (f"{base}/voices/", "weekly", "0.85"),
    (f"{base}/cartoon/", "weekly", "0.85"),
    (f"{base}/marvel/", "weekly", "0.85"),
    (f"{base}/about.html", "monthly", "0.6"),
    (f"{base}/contact.html", "monthly", "0.6"),
    (f"{base}/privacy-policy.html", "monthly", "0.5"),
    (f"{base}/terms.html", "monthly", "0.5"),
    (f"{base}/disclaimer.html", "monthly", "0.5"),
]

for loc, freq, pri in main_pages:
    lines.append(f"  <url><loc>{loc}</loc><lastmod>{today}</lastmod><changefreq>{freq}</changefreq><priority>{pri}</priority></url>")

# Editorial Authority Hub & Articles
import os
articles_dir = "articles"
if os.path.exists(articles_dir):
    lines.append(f"  <url><loc>{base}/articles/</loc><lastmod>{today}</lastmod><changefreq>daily</changefreq><priority>0.95</priority></url>")
    lines.append(f"  <url><loc>{base}/articles/index.html</loc><lastmod>{today}</lastmod><changefreq>daily</changefreq><priority>0.95</priority></url>")
    for art_file in sorted(os.listdir(articles_dir)):
        if art_file.endswith(".html") and art_file != "index.html":
            lines.append(f"  <url><loc>{base}/articles/{art_file}</loc><lastmod>{today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>")

# Online Deals & Shopping Offers Hub
deals_p_dir = "deals/p"
lines.append(f"  <url><loc>{base}/deals/</loc><lastmod>{today}</lastmod><changefreq>daily</changefreq><priority>0.95</priority></url>")
if os.path.exists(deals_p_dir):
    for deal_file in sorted(os.listdir(deals_p_dir)):
        if deal_file.endswith(".html"):
            lines.append(f"  <url><loc>{base}/deals/p/{deal_file}</loc><lastmod>{today}</lastmod><changefreq>daily</changefreq><priority>0.85</priority></url>")

lines.append('</urlset>')

with open("sitemap.xml", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

url_count = len(lines) - 2
print(f"Generated merged sitemap.xml with {url_count} URLs")
