#!/usr/bin/env python3
"""Generate merged flat sitemap.xml with all 1163 URLs in one file.
Runs during GitHub Actions deploy."""

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

base = "https://hvac.thebhom.in"
lines = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']

# Main pages
for loc, freq, pri in [
    (f"{base}/", "weekly", "1.0"),
    (f"{base}/refer.html", "monthly", "0.8"),
    (f"{base}/pitch-bold.html", "monthly", "0.7"),
    (f"{base}/pitch-premium.html", "monthly", "0.7"),
]:
    lines.append(f"<url><loc>{loc}</loc><lastmod>2026-09-03</lastmod><changefreq>{freq}</changefreq><priority>{pri}</priority></url>")

# Directory index
lines.append(f"<url><loc>{base}/directory/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>")

# City pages
for c in cities:
    lines.append(f"<url><loc>{base}/directory/city/{c}/</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>")

# Service pages
for s in services:
    lines.append(f"<url><loc>{base}/directory/service/{s}/</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>")

# City x Service combos (60 x 18 = 1080)
for c in cities:
    for s in services:
        lines.append(f"<url><loc>{base}/directory/city/{c}/{s}/</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>")

lines.append('</urlset>')

with open("sitemap.xml", "w") as f:
    f.write("\n".join(lines))

url_count = len(lines) - 2
print(f"Generated merged sitemap.xml with {url_count} URLs")
