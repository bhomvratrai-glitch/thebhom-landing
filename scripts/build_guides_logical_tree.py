#!/usr/bin/env python3
"""
Build the Logical Tree (Topic Silo / Hub-and-Spoke) architecture for /guides/
without moving or renaming any existing leaf URLs (0% 404 risk, 100% AdSense-safe).

Structure:
  Root: /
    └── /guides/ (Branch 1 Hub)
          ├── /guides/smartphones/  -> 26 smartphone guides
          ├── /guides/laptops/      -> 21 laptop & computing guides
          ├── /guides/audio/        -> 22 audio & wearables guides
          ├── /guides/smart-home/   -> 21 smart home & power guides
          └── /guides/shopping/     -> 21 smart shopping & security guides
"""

import html
import json
import os
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GUIDES_DIR = os.path.join(BASE_DIR, "guides")
GUIDES_INDEX = os.path.join(GUIDES_DIR, "index.html")

BRANCHES = [
    {
        "slug": "smartphones",
        "name": "Smartphones & Mobile",
        "short_name": "Smartphones",
        "icon": "📱",
        "color": "#2563eb",
        "gradient": "linear-gradient(135deg, #2563eb, #1d4ed8)",
        "deals_url": "/deals/?category=mobiles",
        "deals_label": "Browse Live Smartphone Deals →",
        "meta_title": "Smartphone Buying Guides, SoC Benchmarks & 5G Reviews (India) | TheBhom",
        "meta_desc": "Explore tested smartphone buying guides for India: Snapdragon vs Dimensity rankings, camera sensors, OLED PWM tests, 5G bands, and battery longevity.",
        "intro": (
            "Choosing a smartphone in India means looking past spec-sheet marketing like inflated megapixel counts and "
            "peak burst charging claims. Our Smartphones & Mobile branch brings together silicon hierarchy benchmarks, "
            "Sony vs Samsung sensor breakdowns, display PWM flickering analysis, 5G band checklists (n28/n78), and real "
            "thermal-throttling tests tuned for Indian ambient temperatures."
        ),
    },
    {
        "slug": "laptops",
        "name": "Laptops & Computing",
        "short_name": "Laptops & PC",
        "icon": "💻",
        "color": "#d97706",
        "gradient": "linear-gradient(135deg, #f59e0b, #d97706)",
        "deals_url": "/deals/?category=electronics",
        "deals_label": "Browse Live Laptop & Tech Deals →",
        "meta_title": "Laptop, SSD, RAM & PC Hardware Buying Guides (India) | TheBhom",
        "meta_desc": "In-depth laptop buying guides for students, developers, and gamers in India: Core Ultra vs Ryzen AI, RTX TGP thermals, NVMe Gen 4 vs Gen 5, and upgrades.",
        "intro": (
            "Laptop performance depends heavily on sustained GPU TGP, thermal dissipation, RAM channel configuration, and "
            "storage controller speeds rather than just CPU model names. This Computing branch covers student laptops "
            "under ₹40,000, RTX gaming laptops under ₹60,000, coding machines (Mac vs Windows vs Linux), NVMe SSD "
            "architectures, external monitors, and step-by-step upgrade tutorials."
        ),
    },
    {
        "slug": "audio",
        "name": "Audio & Wearables",
        "short_name": "Audio & Wearables",
        "icon": "🎧",
        "color": "#7c3aed",
        "gradient": "linear-gradient(135deg, #8b5cf6, #6d28d9)",
        "deals_url": "/deals/?category=electronics",
        "deals_label": "Browse Live Audio & Smartwatch Deals →",
        "meta_title": "Earbuds, ANC Headphones, Soundbars & Smartwatch Guides | TheBhom",
        "meta_desc": "Tested buying guides for TWS earbuds, ANC vs ENC noise cancellation, Bluetooth codecs (LDAC/LHDC), Dolby Atmos soundbars, and smartwatch sensor accuracy.",
        "intro": (
            "Audio gear and budget wearables often exaggerate noise cancellation decibels, driver sizes, and health "
            "sensor accuracy. Inside our Audio & Wearables branch, we break down real ANC vs ENC acoustic isolation, "
            "Bluetooth codec bitrates (SBC, AAC, aptX, LDAC), Dolby Atmos soundbars, Wear OS vs RTOS battery trade-offs, "
            "and practical maintenance tips for TWS earbuds."
        ),
    },
    {
        "slug": "smart-home",
        "name": "Smart Home & Power",
        "short_name": "Smart Home & Power",
        "icon": "🏠",
        "color": "#059669",
        "gradient": "linear-gradient(135deg, #10b981, #047857)",
        "deals_url": "/deals/?category=home-kitchen",
        "deals_label": "Browse Live Home & Appliance Deals →",
        "meta_title": "Smart TVs, Inverter ACs, Power Banks, UPS & Appliance Guides | TheBhom",
        "meta_desc": "Research-backed guides for Indian homes: 4K OLED vs QLED TVs, 1.5-ton inverter ACs, HEPA air purifiers, RO vs UV water purifiers, UPS inverters, and GaN chargers.",
        "intro": (
            "Home appliances and power electronics in India face voltage fluctuations, hard water TDS levels, dust, and "
            "45°C summers. Our Smart Home & Power branch evaluates 4K Smart TVs, inverter AC ISEER efficiency, HEPA air "
            "purifiers, RO/UV TDS filtration, home UPS & solar inverters, 65W PD power banks, and GaN fast-charging safety."
        ),
    },
    {
        "slug": "shopping",
        "name": "Smart Shopping & Security",
        "short_name": "Shopping & Security",
        "icon": "💳",
        "color": "#e11d48",
        "gradient": "linear-gradient(135deg, #f43f5e, #be123c)",
        "deals_url": "/deals/",
        "deals_label": "Explore Verified Daily Loot Deals →",
        "meta_title": "Smart Shopping, Price Tracking, Credit Cards & Cyber Security Guides | TheBhom",
        "meta_desc": "Protect your wallet online in India: track real Amazon & Flipkart price drops, spot fake products, master open-box delivery, credit card rewards, and UPI safety.",
        "intro": (
            "Saving money online is as much about avoiding traps as finding discounts. This Smart Shopping & Security "
            "branch covers how to verify real Amazon and Flipkart price drops, detect counterfeit listings, handle "
            "open-box delivery disputes, decode no-cost EMI GST charges, maximize cashback credit cards, and protect "
            "against UPI, phishing, and SIM-swap fraud."
        ),
    },
]

BRANCH_BY_SLUG = {b["slug"]: b for b in BRANCHES}

EXTRA_GUIDES_META = {
    "best-budget-smartphones-under-15000.html": {
        "cat": "smartphones",
        "badge": "Budget 5G",
        "emoji": "📱",
        "gradient": "linear-gradient(135deg, #0ea5e9, #0369a1)",
        "read_time": "12 min read",
    },
    "best-budget-laptops-for-students-under-40000.html": {
        "cat": "laptops",
        "badge": "Student Laptops",
        "emoji": "💻",
        "gradient": "linear-gradient(135deg, #f59e0b, #b45309)",
        "read_time": "10 min read",
    },
    "best-tws-earbuds-under-1500-anc.html": {
        "cat": "audio",
        "badge": "TWS & ANC",
        "emoji": "🎧",
        "gradient": "linear-gradient(135deg, #8b5cf6, #5b21b6)",
        "read_time": "11 min read",
    },
    "top-10-smartwatches-under-2000.html": {
        "cat": "audio",
        "badge": "Smartwatches",
        "emoji": "⌚",
        "gradient": "linear-gradient(135deg, #ec4899, #9d174d)",
        "read_time": "12 min read",
    },
    "best-power-banks-fast-charging-india.html": {
        "cat": "smart-home",
        "badge": "Power Banks",
        "emoji": "🔋",
        "gradient": "linear-gradient(135deg, #10b981, #047857)",
        "read_time": "10 min read",
    },
    "how-to-track-real-amazon-flipkart-price-drops.html": {
        "cat": "shopping",
        "badge": "Price Tracking",
        "emoji": "📉",
        "gradient": "linear-gradient(135deg, #ea580c, #9a3412)",
        "read_time": "9 min read",
    },
}


def strip_tags(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s)).strip()


def extract_cards_from_index(index_html):
    pattern = re.compile(
        r'(<a href="/guides/([^"]+)" class="guide-card" data-cat="([^"]+)">.*?</a>)',
        re.DOTALL,
    )
    cards = []
    seen_files = set()
    for full_html, fname, cat in pattern.findall(index_html):
        if fname in seen_files:
            continue
        seen_files.add(fname)
        title_m = re.search(r'<h2 class="guide-title">(.*?)</h2>', full_html, re.DOTALL)
        desc_m = re.search(r'<p class="guide-desc">(.*?)</p>', full_html, re.DOTALL)
        badge_m = re.search(r'<span class="guide-category-badge">(.*?)</span>', full_html, re.DOTALL)
        cards.append(
            {
                "fname": fname,
                "cat": cat,
                "title": strip_tags(title_m.group(1)) if title_m else fname,
                "desc": strip_tags(desc_m.group(1)) if desc_m else "",
                "badge": strip_tags(badge_m.group(1)) if badge_m else cat.title(),
                "card_html": full_html,
            }
        )
    return cards, seen_files


def build_extra_card(fname, meta):
    fpath = os.path.join(GUIDES_DIR, fname)
    content = open(fpath, "r", encoding="utf-8").read()
    h1_m = re.search(r"<h1>(.*?)</h1>", content, re.DOTALL)
    desc_m = re.search(r'<meta name="description" content="([^"]*)"', content)
    title = strip_tags(h1_m.group(1)) if h1_m else fname
    desc = html.unescape(desc_m.group(1)).strip() if desc_m else ""
    card_html = f"""      <a href="/guides/{fname}" class="guide-card" data-cat="{meta['cat']}">
        <div class="guide-thumb-wrap" style="background:{meta['gradient']};">
          <span>{meta['emoji']}</span>
          <span class="guide-category-badge">{html.escape(meta['badge'])}</span>
          <span class="guide-read-time">⏱️ {meta['read_time']}</span>
        </div>
        <div class="guide-content">
          <div class="guide-meta"><span>By Bhomvrat Rai</span> • <span>Updated Oct 2026</span></div>
          <h2 class="guide-title">{html.escape(title)}</h2>
          <p class="guide-desc">{html.escape(desc)}</p>
          <div class="guide-footer-action">
            <span>Read Complete Guide →</span>
            <span>⭐ 4.9/5</span>
          </div>
        </div>
      </a>"""
    return {
        "fname": fname,
        "cat": meta["cat"],
        "title": title,
        "desc": desc,
        "badge": meta["badge"],
        "card_html": card_html,
    }


def extract_guides_css(index_html):
    m = re.search(r"(<style>.*?</style>)", index_html, re.DOTALL)
    return m.group(1) if m else ""


def render_branch_hub_page(branch, branch_cards):
    slug = branch["slug"]
    canonical = f"https://www.thebhom.in/guides/{slug}/"
    branch_pills = []
    for b in BRANCHES:
        active_cls = " active" if b["slug"] == slug else ""
        branch_pills.append(
            f'<a href="/guides/{b["slug"]}/" class="filter-btn{active_cls}" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px;">{b["icon"]} {html.escape(b["name"])}</a>'
        )
    pills_html = "\n      ".join(branch_pills)
    cards_html = "\n\n".join(c["card_html"] for c in branch_cards)

    ld_json = json.dumps(
        {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "CollectionPage",
                    "name": f"{branch['name']} Buying Guides | TheBhom",
                    "url": canonical,
                    "description": branch["meta_desc"],
                    "publisher": {
                        "@type": "Organization",
                        "name": "TheBhom",
                        "url": "https://www.thebhom.in",
                    },
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.thebhom.in/"},
                        {"@type": "ListItem", "position": 2, "name": "Guides", "item": "https://www.thebhom.in/guides/"},
                        {"@type": "ListItem", "position": 3, "name": branch["name"], "item": canonical},
                    ],
                },
            ],
        },
        indent=2,
        ensure_ascii=False,
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <script>(function(){{try{{const t=localStorage.getItem('thebhom_theme')||'light';document.documentElement.setAttribute('data-theme',t);}}catch(e){{}}}})();</script>
  <meta name="google-adsense-account" content="ca-pub-4674566886677472">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4674566886677472" crossorigin="anonymous"></script>
  <meta name="google-site-verification" content="googlec324d892b7f2bbf5"/>

  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){{w[l]=w[l]||[];w[l].push({{'gtm.start':
  new Date().getTime(),event:'gtm.js'}});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  }})(window,document,'script','dataLayer','GTM-K2B22XSW');</script>

  <!-- Google Analytics (GA4) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-GHVNZWFVQV"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', 'G-GHVNZWFVQV');
  </script>

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">

  <title>{html.escape(branch["meta_title"])}</title>
  <meta name="description" content="{html.escape(branch["meta_desc"])}">
  <meta property="og:title" content="{html.escape(branch["meta_title"])}">
  <meta property="og:description" content="{html.escape(branch["meta_desc"])}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="https://www.thebhom.in/og-image.png">
  <link rel="manifest" href="/manifest.json">
  <link rel="canonical" href="{canonical}">
  <link rel="stylesheet" href="/shared.css?v=20261111_v4">

  <script type="application/ld+json">
  {ld_json}
  </script>

  <style>
    :root, [data-theme="light"] {{
      --g-bg: #f8fafc;
      --g-card: #ffffff;
      --g-border: #e2e8f0;
      --g-text: #0f172a;
      --g-muted: #64748b;
      --g-accent: #10b981;
      --g-accent-light: #ecfdf5;
      --g-shadow: 0 4px 20px rgba(0,0,0,0.04);
    }}
    [data-theme="navy"] {{
      --g-bg: #0b132b; --g-card: #142042; --g-border: rgba(56,189,248,0.18);
      --g-text: #f1f5f9; --g-muted: #94a3b8; --g-accent: #38bdf8; --g-accent-light: rgba(56,189,248,0.12);
      --g-shadow: 0 8px 32px rgba(0,0,0,0.4);
    }}
    [data-theme="dark"] {{
      --g-bg: #0b0f19; --g-card: #131b2e; --g-border: rgba(255,255,255,0.08);
      --g-text: #f8fafc; --g-muted: #94a3b8; --g-accent: #10b981; --g-accent-light: rgba(16,185,129,0.12);
      --g-shadow: 0 8px 32px rgba(0,0,0,0.4);
    }}
    body {{
      background: var(--g-bg);
      color: var(--g-text);
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 0;
    }}
    .guides-container {{ max-width: 1240px; margin: 0 auto; padding: 32px 20px 80px; }}
    .silo-breadcrumb {{
      display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
      font-size: 0.9rem; color: var(--g-muted); margin-bottom: 24px; font-weight: 600;
    }}
    .silo-breadcrumb a {{ color: var(--g-accent); text-decoration: none; }}
    .silo-breadcrumb a:hover {{ text-decoration: underline; }}
    .guides-hero {{ text-align: center; margin-bottom: 32px; }}
    .guides-badge {{
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--g-accent-light); color: var(--g-accent);
      border: 1px solid rgba(16,185,129,0.25); padding: 6px 16px;
      border-radius: 9999px; font-size: 13.5px; font-weight: 700; margin-bottom: 14px;
    }}
    .guides-hero h1 {{
      font-size: 2.3rem; font-weight: 800; color: var(--g-text);
      line-height: 1.25; margin: 0 0 14px; letter-spacing: -0.5px;
    }}
    .guides-hero p {{
      font-size: 1.05rem; color: var(--g-muted); max-width: 780px;
      margin: 0 auto 24px; line-height: 1.65;
    }}
    .guides-search-bar {{ max-width: 560px; margin: 0 auto 28px; position: relative; }}
    .guides-search-input {{
      width: 100%; padding: 14px 20px 14px 46px; border-radius: 14px;
      border: 1.5px solid var(--g-border); background: var(--g-card); color: var(--g-text);
      font-size: 15px; outline: none; box-shadow: var(--g-shadow); box-sizing: border-box;
    }}
    .guides-search-input:focus {{ border-color: var(--g-accent); }}
    .guides-search-icon {{
      position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
      color: var(--g-muted); font-size: 18px;
    }}
    .filter-tabs {{
      display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin-bottom: 36px;
    }}
    .filter-btn {{
      background: var(--g-card); border: 1px solid var(--g-border); color: var(--g-muted);
      padding: 10px 16px; min-height: 44px; border-radius: 9999px; font-size: 14px; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
    }}
    .filter-btn:hover, .filter-btn.active {{
      background: var(--g-accent); color: #ffffff; border-color: var(--g-accent);
    }}
    .guides-grid {{
      display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px;
    }}
    .guide-card {{
      background: var(--g-card); border: 1px solid var(--g-border); border-radius: 18px;
      overflow: hidden; box-shadow: var(--g-shadow); text-decoration: none; color: inherit;
      display: flex; flex-direction: column; transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
    }}
    .guide-card:hover {{ transform: translateY(-5px); border-color: var(--g-accent); }}
    .guide-thumb-wrap {{
      position: relative; width: 100%; height: 185px; display: flex;
      align-items: center; justify-content: center; font-size: 56px; overflow: hidden;
    }}
    .guide-category-badge {{
      position: absolute; top: 14px; left: 14px; background: rgba(15,23,42,0.75);
      backdrop-filter: blur(8px); color: #fff; font-size: 12px; font-weight: 700;
      padding: 4px 12px; border-radius: 9999px;
    }}
    .guide-read-time {{
      position: absolute; bottom: 12px; right: 14px; background: rgba(15,23,42,0.75);
      backdrop-filter: blur(8px); color: #fff; font-size: 12px; font-weight: 600;
      padding: 3px 10px; border-radius: 9999px;
    }}
    .guide-content {{ padding: 22px; flex: 1; display: flex; flex-direction: column; }}
    .guide-meta {{
      font-size: 12.5px; color: var(--g-muted); font-weight: 600; margin-bottom: 8px;
      display: flex; align-items: center; gap: 10px;
    }}
    .guide-title {{ font-size: 1.2rem; font-weight: 800; color: var(--g-text); line-height: 1.35; margin: 0 0 10px; }}
    .guide-desc {{ font-size: 0.95rem; color: var(--g-muted); line-height: 1.6; margin: 0 0 18px; flex: 1; }}
    .guide-footer-action {{
      border-top: 1px solid var(--g-border); padding-top: 14px; display: flex;
      align-items: center; justify-content: space-between; font-size: 13.5px;
      font-weight: 700; color: var(--g-accent);
    }}
    .branch-deals-bridge {{
      margin-top: 48px; padding: 28px; border-radius: 18px;
      background: var(--g-card); border: 1.5px solid var(--g-border);
      display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px;
      box-shadow: var(--g-shadow);
    }}
    .branch-deals-btn {{
      background: var(--g-accent); color: #fff; padding: 12px 22px; border-radius: 12px;
      font-weight: 700; text-decoration: none; white-space: nowrap;
    }}
  </style>
</head>
<body>
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K2B22XSW" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <div id="shared-header"></div>

  <main class="guides-container">
    <nav class="silo-breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span>›</span>
      <a href="/guides/">Guides</a>
      <span>›</span>
      <span style="color:var(--g-text);">{html.escape(branch["name"])}</span>
    </nav>

    <section class="guides-hero">
      <div class="guides-badge">{branch["icon"]} Topic Branch Hub • {len(branch_cards)} Tested Guides</div>
      <h1>{html.escape(branch["name"])} Buying Guides</h1>
      <p>{html.escape(branch["intro"])}</p>

      <div class="guides-search-bar">
        <span class="guides-search-icon">🔍</span>
        <input type="text" id="guideSearchInput" class="guides-search-input" placeholder="Search within {html.escape(branch['short_name'])} guides..." oninput="searchGuides(this.value)">
      </div>
    </section>

    <div class="filter-tabs" aria-label="Guide Topic Branches">
      <a href="/guides/" class="filter-btn" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px;">📚 All Branches</a>
      {pills_html}
    </div>

    <div class="guides-grid" id="guidesGrid">
{cards_html}
    </div>

    <div class="branch-deals-bridge">
      <div>
        <h2 style="margin:0 0 6px;font-size:1.3rem;">🛍️ Ready to Compare Live Prices for {html.escape(branch["short_name"])}?</h2>
        <p style="margin:0;color:var(--g-muted);">Track verified Amazon &amp; Flipkart price drops curated alongside our editorial testing.</p>
      </div>
      <a href="{branch["deals_url"]}" class="branch-deals-btn">{html.escape(branch["deals_label"])}</a>
    </div>
  </main>

  <div id="shared-footer"></div>
  <script src="/shared.js?v=20261026_v2"></script>
  <script>
    function searchGuides(query) {{
      const q = query.toLowerCase().trim();
      document.querySelectorAll('.guide-card').forEach(card => {{
        const title = card.querySelector('.guide-title')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.guide-desc')?.textContent.toLowerCase() || '';
        const tag = card.querySelector('.guide-category-badge')?.textContent.toLowerCase() || '';
        card.style.display = (!q || title.includes(q) || desc.includes(q) || tag.includes(q)) ? 'flex' : 'none';
      }});
    }}
  </script>
</body>
</html>
"""


def update_guides_index(index_html, all_cards_by_cat, extra_cards):
    total_count = sum(len(v) for v in all_cards_by_cat.values())

    # 1. Update title/hero/All Guides counts accurately
    index_html = index_html.replace("(105+ Tested)", f"({total_count}+ Tested)")
    index_html = index_html.replace("105+ in-depth", f"{total_count}+ in-depth")
    index_html = index_html.replace("Over 105+ thoroughly", f"Over {total_count}+ thoroughly")
    index_html = index_html.replace("Search 105+ tech", f"Search {total_count}+ tech")
    index_html = re.sub(r"All Guides \(\d+\)", f"All Guides ({total_count})", index_html)
    for b in BRANCHES:
        cnt = len(all_cards_by_cat[b["slug"]])
        index_html = re.sub(
            rf"(filterGuides\('{b['slug']}'[^>]*>[^<]*?\()\d+(\))",
            rf"\g<1>{cnt}\g<2>",
            index_html,
        )

    # 2. Insert missing 6 cards if not already present
    for ec in extra_cards:
        if f'/guides/{ec["fname"]}' not in index_html:
            index_html = index_html.replace(
                '<div class="guides-grid" id="guidesGrid">\n',
                '<div class="guides-grid" id="guidesGrid">\n' + ec["card_html"] + "\n\n",
                1,
            )

    # 3. Inject Crawlable Sub-Branch Hub Strip right before <!-- Category Filter Tabs -->
    branch_cards_html = []
    for b in BRANCHES:
        cnt = len(all_cards_by_cat[b["slug"]])
        branch_cards_html.append(
            f'<a href="/guides/{b["slug"]}/" style="display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--g-card);border:1.5px solid var(--g-border);border-radius:14px;text-decoration:none;color:var(--g-text);box-shadow:var(--g-shadow);transition:border-color 0.2s,transform 0.2s;" onmouseover="this.style.borderColor=\'{b["color"]}\';this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.borderColor=\'var(--g-border)\';this.style.transform=\'none\'">'
            f'<span style="font-size:1.7rem;line-height:1;">{b["icon"]}</span>'
            f'<div><div style="font-weight:800;font-size:0.98rem;">{html.escape(b["name"])}</div>'
            f'<div style="font-size:0.8rem;color:var(--g-muted);font-weight:600;">{cnt} Guides • Open Hub →</div></div></a>'
        )
    silo_block = (
        "<!-- SILO_BRANCHES_START -->\n"
        '    <section aria-label="Topic Branch Hubs" style="margin-bottom:28px;">\n'
        '      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:12px;">\n'
        "        " + "\n        ".join(branch_cards_html) + "\n"
        "      </div>\n"
        "    </section>\n"
        "    <!-- SILO_BRANCHES_END -->"
    )

    if "<!-- SILO_BRANCHES_START -->" in index_html:
        index_html = re.sub(
            r"<!-- SILO_BRANCHES_START -->.*?<!-- SILO_BRANCHES_END -->",
            silo_block,
            index_html,
            flags=re.DOTALL,
        )
    else:
        index_html = index_html.replace(
            "<!-- Category Filter Tabs -->",
            silo_block + "\n\n    <!-- Category Filter Tabs -->",
            1,
        )

    # 4. Support ?cat=<slug> on load in guides/index.html
    if "URLSearchParams(window.location.search)" not in index_html:
        cat_script = """
    (function applyQueryCat() {
      const cat = new URLSearchParams(window.location.search).get('cat');
      if (!cat) return;
      const btn = document.querySelector(`.filter-btn[onclick*="'${cat}'"]`);
      if (btn) filterGuides(cat, btn);
    })();
  </script>"""
        index_html = index_html.replace("  </script>", cat_script, 1)

    with open(GUIDES_INDEX, "w", encoding="utf-8") as f:
        f.write(index_html)


def update_leaf_guide(card, branch_cards):
    fname = card["fname"]
    fpath = os.path.join(GUIDES_DIR, fname)
    content = open(fpath, "r", encoding="utf-8").read()
    cat = card["cat"]
    branch = BRANCH_BY_SLUG[cat]
    branch_url = f"/guides/{cat}/"
    leaf_url = f"https://www.thebhom.in/guides/{fname}"

    # 1. Fix visible breadcrumb href="/guides/?cat=..." -> href="/guides/<cat>/"
    content = re.sub(
        r'<a href="/guides/\?cat=[^"]+">([^<]+)</a>',
        f'<a href="{branch_url}">{html.escape(branch["name"])}</a>',
        content,
    )
    # Also fix the 6 older guides using .article-breadcrumb
    content = re.sub(
        r'(<div class="article-breadcrumb">\s*<a href="/">Home</a>\s*<span>/</span>\s*<a href="/guides/">Guides</a>\s*<span>/</span>\s*)(?:<span>[^<]+</span>|<a href="/guides/[^"]+">[^<]+</a>)',
        rf'\1<a href="{branch_url}">{html.escape(branch["name"])}</a>',
        content,
    )

    # 2. Inject BreadcrumbList JSON-LD cleanly in <head> (idempotent)
    breadcrumb_ld = json.dumps(
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.thebhom.in/"},
                {"@type": "ListItem", "position": 2, "name": "Guides", "item": "https://www.thebhom.in/guides/"},
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": branch["name"],
                    "item": f"https://www.thebhom.in{branch_url}",
                },
                {"@type": "ListItem", "position": 4, "name": card["title"], "item": leaf_url},
            ],
        },
        ensure_ascii=False,
    )
    bc_tag = f'<script type="application/ld+json" data-silo="breadcrumb">\n  {breadcrumb_ld}\n  </script>'
    if 'data-silo="breadcrumb"' in content:
        content = re.sub(
            r'<script type="application/ld\+json" data-silo="breadcrumb">.*?</script>',
            bc_tag,
            content,
            flags=re.DOTALL,
        )
    else:
        content = content.replace("</head>", f"  {bc_tag}\n</head>", 1)

    # 3. Pick 5 deterministic sibling guides from the SAME branch
    siblings = [c for c in branch_cards if c["fname"] != fname]
    idx = next((i for i, c in enumerate(branch_cards) if c["fname"] == fname), 0)
    picked = []
    if siblings:
        for offset in range(min(5, len(siblings))):
            picked.append(siblings[(idx + offset) % len(siblings)])

    sibling_links = "\n".join(
        f'          <a href="/guides/{c["fname"]}" style="display:block;padding:12px 14px;background:var(--art-bg);border:1px solid var(--art-border);border-radius:10px;text-decoration:none;color:var(--art-text);font-weight:700;font-size:0.92rem;line-height:1.4;">'
        f'{html.escape(c["title"])}'
        f'<span style="display:block;font-size:0.78rem;color:var(--art-accent);margin-top:4px;font-weight:600;">{html.escape(c["badge"])} • Read Guide →</span></a>'
        for c in picked
    )

    related_box = (
        f"<!-- SILO_RELATED_START -->\n"
        f'      <section aria-label="Related Guides in {html.escape(branch["name"])}" style="margin:36px 0 28px;padding:24px;background:var(--art-card);border:1.5px solid var(--art-border);border-radius:16px;">\n'
        f'        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:16px;">\n'
        f'          <h3 style="margin:0;font-size:1.15rem;font-weight:800;color:var(--art-text);">{branch["icon"]} More in {html.escape(branch["name"])}</h3>\n'
        f'          <a href="{branch_url}" style="color:var(--art-accent);font-weight:700;font-size:0.88rem;text-decoration:none;">View All {len(branch_cards)} {html.escape(branch["short_name"])} Guides →</a>\n'
        f"        </div>\n"
        f'        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;">\n'
        f"{sibling_links}\n"
        f"        </div>\n"
        f"      </section>\n"
        f"      <!-- SILO_RELATED_END -->"
    )

    if "<!-- SILO_RELATED_START -->" in content:
        content = re.sub(
            r"<!-- SILO_RELATED_START -->.*?<!-- SILO_RELATED_END -->",
            related_box,
            content,
            flags=re.DOTALL,
        )
    elif '<div class="deal-action-box">' in content:
        content = content.replace(
            '<div class="deal-action-box">',
            related_box + '\n\n      <div class="deal-action-box">',
            1,
        )
    else:
        content = content.replace("</article>", related_box + "\n    </article>", 1)

    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)


def main():
    index_html = open(GUIDES_INDEX, "r", encoding="utf-8").read()
    cards, seen = extract_cards_from_index(index_html)

    extra_cards = []
    for fname, meta in EXTRA_GUIDES_META.items():
        if fname not in seen and os.path.exists(os.path.join(GUIDES_DIR, fname)):
            ec = build_extra_card(fname, meta)
            cards.append(ec)
            extra_cards.append(ec)
            seen.add(fname)

    all_cards_by_cat = {b["slug"]: [] for b in BRANCHES}
    for c in cards:
        if c["cat"] in all_cards_by_cat:
            all_cards_by_cat[c["cat"]].append(c)

    # 1. Generate the 5 Sub-Branch Hub pages
    for branch in BRANCHES:
        slug = branch["slug"]
        branch_dir = os.path.join(GUIDES_DIR, slug)
        os.makedirs(branch_dir, exist_ok=True)
        hub_path = os.path.join(branch_dir, "index.html")
        with open(hub_path, "w", encoding="utf-8") as f:
            f.write(render_branch_hub_page(branch, all_cards_by_cat[slug]))
        print(f"✅ Built branch hub: /guides/{slug}/ ({len(all_cards_by_cat[slug])} guides)")

    # 2. Update guides/index.html with crawlable branch hub strip & accurate counts
    update_guides_index(index_html, all_cards_by_cat, extra_cards)
    print(f"✅ Updated guides/index.html ({sum(len(v) for v in all_cards_by_cat.values())} total guides)")

    # 3. Update all 111 leaf guides with parent branch breadcrumb + BreadcrumbList JSON-LD + same-branch related links
    updated_count = 0
    for cat, branch_cards in all_cards_by_cat.items():
        for card in branch_cards:
            update_leaf_guide(card, branch_cards)
            updated_count += 1
    print(f"✅ Updated {updated_count} leaf guides with parent branch links, BreadcrumbList JSON-LD, and sibling silos.")


if __name__ == "__main__":
    main()

