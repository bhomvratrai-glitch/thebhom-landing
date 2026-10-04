#!/usr/bin/env python3
import os
import glob
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TODAY = datetime.utcnow().strftime('%Y-%m-%d')

urls = []

# 1. Main Landing Pages & Subdomains
main_pages = [
    ('/', '1.0', 'daily'),
    ('/deals/', '0.95', 'daily'),
    ('/downloader/', '0.9', 'daily'),
    ('/wallpapers', '0.9', 'daily'),
    ('/ebooks', '0.9', 'weekly'),
    ('/magazines', '0.9', 'weekly'),
    ('/cards', '0.9', 'weekly'),
    ('/templates', '0.9', 'weekly'),
    ('/about', '0.8', 'monthly'),
    ('/contact', '0.8', 'monthly'),
    ('/privacy-policy', '0.7', 'monthly'),
    ('/terms', '0.7', 'monthly'),
    ('/disclaimer', '0.7', 'monthly'),
]
for path, priority, freq in main_pages:
    urls.append((f'https://www.thebhom.in{path}', priority, freq))

# 2. Main Web Tools Suite
for f in sorted(glob.glob(os.path.join(BASE_DIR, 'tools', '*.html'))):
    b = os.path.basename(f)
    if b in ['contact.html', 'privacy.html', 'terms.html', 'checkout.html']:
        continue
    slug = b[:-5]
    if slug == 'index':
        urls.append(('https://www.thebhom.in/tools/', '0.9', 'daily'))
    else:
        urls.append((f'https://www.thebhom.in/tools/{slug}', '0.85', 'weekly'))

# 3. High-Value Guide Articles
for f in sorted(glob.glob(os.path.join(BASE_DIR, 'articles', '*.html'))):
    b = os.path.basename(f)
    slug = b[:-5]
    if slug == 'index':
        urls.append(('https://www.thebhom.in/articles/', '0.95', 'daily'))
    else:
        urls.append((f'https://www.thebhom.in/articles/{slug}', '0.85', 'weekly'))

# 4. ImgPDF Suite (PDF, Image, and Document Utilities)
for root, dirs, files in os.walk(os.path.join(BASE_DIR, 'imgpdf')):
    for f in sorted(files):
        if not f.endswith('.html'):
            continue
        rel = os.path.relpath(os.path.join(root, f), BASE_DIR)
        parts = rel.split(os.sep)
        b = os.path.basename(rel)
        # Exclude internal / non-content pages
        if any(x in rel for x in ['404', 'admin', 'auth', 'dashboard', 'forgot-password', 'login', 'signup', 'reset-password', 'pricing', 'refund', 'acceptable-use', 'data-retention', 'cookies']):
            continue
        slug = b[:-5]
        dir_part = '/'.join(parts[:-1])
        if slug == 'index':
            urls.append((f'https://www.thebhom.in/{dir_part}/', '0.9', 'weekly'))
        else:
            urls.append((f'https://www.thebhom.in/{dir_part}/{slug}', '0.85', 'weekly'))

# 5. News & Viral Stories
for f in sorted(glob.glob(os.path.join(BASE_DIR, 'news', '*.html'))):
    b = os.path.basename(f)
    slug = b[:-5]
    if slug == 'index':
        urls.append(('https://www.thebhom.in/news/', '0.95', 'hourly'))
    else:
        urls.append((f'https://www.thebhom.in/news/{slug}', '0.85', 'daily'))

# Remove duplicates while preserving order
seen = set()
unique_urls = []
for u, pri, freq in urls:
    if u not in seen:
        seen.add(u)
        unique_urls.append((u, pri, freq))

xml_lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
]

for url, pri, freq in unique_urls:
    xml_lines.append(f'  <url><loc>{url}</loc><lastmod>{TODAY}</lastmod><changefreq>{freq}</changefreq><priority>{pri}</priority></url>')

xml_lines.append('</urlset>\n')

sitemap_path = os.path.join(BASE_DIR, 'sitemap.xml')
with open(sitemap_path, 'w', encoding='utf-8') as out:
    out.write('\n'.join(xml_lines))

print(f"Generated {sitemap_path} successfully with {len(unique_urls)} canonical URLs.")
