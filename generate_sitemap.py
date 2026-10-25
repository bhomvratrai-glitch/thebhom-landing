#!/usr/bin/env python3
import os
import glob
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TODAY = datetime.utcnow().strftime('%Y-%m-%d')

urls = [
    ('https://www.thebhom.in/', '1.0', 'daily'),
    ('https://www.thebhom.in/deals/', '0.95', 'daily'),
    ('https://www.thebhom.in/guides/', '0.95', 'daily'),
]

# Scan all verified guides in guides/
guides_dir = os.path.join(BASE_DIR, 'guides')
for f in sorted(glob.glob(os.path.join(guides_dir, '*.html'))):
    fname = os.path.basename(f)
    if fname == 'index.html':
        continue
    # Exclude any download guides if present
    if 'download' in fname or 'youtube' in fname:
        continue
    urls.append((f'https://www.thebhom.in/guides/{fname}', '0.85', 'weekly'))

# Legal and institutional pages
urls.extend([
    ('https://www.thebhom.in/about', '0.7', 'monthly'),
    ('https://www.thebhom.in/contact', '0.7', 'monthly'),
    ('https://www.thebhom.in/privacy-policy', '0.6', 'monthly'),
    ('https://www.thebhom.in/terms', '0.6', 'monthly'),
    ('https://www.thebhom.in/disclaimer', '0.6', 'monthly'),
])

xml_lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
]

for url, pri, freq in urls:
    xml_lines.append(f'  <url><loc>{url}</loc><lastmod>{TODAY}</lastmod><changefreq>{freq}</changefreq><priority>{pri}</priority></url>')

xml_lines.append('</urlset>\n')

sitemap_main_path = os.path.join(BASE_DIR, 'sitemap-main.xml')
with open(sitemap_main_path, 'w', encoding='utf-8') as out:
    out.write('\n'.join(xml_lines))

print(f"Generated {sitemap_main_path} successfully with {len(urls)} canonical URLs.")
