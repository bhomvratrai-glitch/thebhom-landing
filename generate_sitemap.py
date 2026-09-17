#!/usr/bin/env python3
"""Generate merged flat sitemap.xml with all URLs in one file.
Runs during GitHub Actions deploy."""

import datetime

today = datetime.date.today().isoformat()
base = "https://thebhom.in"

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

cities = [
    "delhi","mumbai","bangalore","hyderabad","ahmedabad","chennai","kolkata","pune",
    "jaipur","lucknow","kanpur","nagpur","indore","bhopal","patna","vadodara","surat",
    "visakhapatnam","coimbatore","kochi","thiruvananthapuram","guwahati","chandigarh",
    "dehradun","ranchi","gurgaon","noida","faridabad","ghaziabad","mysore","nashik",
    "rajkot","varanasi","amritsar","ludhiana","agra","meerut","jodhpur","udaipur",
    "raipur","bhubaneswar","mangalore","thrissur","trichy","madurai","salem",
    "vijayawada","warangal","aurangabad","solapur","jabalpur","gwalior","allahabad",
    "bareilly","moradabad","gorakhpur","bikaner","ajmer","kota","jammu"
]

services = [
    "ac-repair","ac-installation","ac-service","ac-gas-refill","split-ac-repair",
    "window-ac-repair","central-ac-maintenance","ac-amc","ac-compressor-repair",
    "ac-pcb-repair","ac-duct-cleaning","vrv-vrf-system","commercial-ac","ac-rental",
    "ac-shifting","refrigerator-repair","air-cooler-repair","hvac-contractor"
]

# Directory index
lines.append(f"  <url><loc>{base}/directory/</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>")

# City pages
for c in cities:
    lines.append(f"  <url><loc>{base}/directory/city/{c}/</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>")

# Service pages
for s in services:
    lines.append(f"  <url><loc>{base}/directory/service/{s}/</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>")

# City x Service combos (60 x 18 = 1080)
for c in cities:
    for s in services:
        lines.append(f"  <url><loc>{base}/directory/city/{c}/{s}/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>")

lines.append('</urlset>')

with open("sitemap.xml", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

url_count = len(lines) - 2
print(f"Generated merged sitemap.xml with {url_count} URLs")
