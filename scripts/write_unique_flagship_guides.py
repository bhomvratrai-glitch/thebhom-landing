#!/usr/bin/env python3
"""
Curates /guides/ to 30 100%-unique, zero-boilerplate flagship guides (6 per branch):
1. Quarantines the 81 cloned-boilerplate guides to _drafts/templated_guides/.
2. Adds exact 301 redirects in _redirects for all 81 moved guides -> parent branch hub (0% 404s).
3. Generates 24 genuinely unique, topic-specific guides (zero shared paragraphs, zero <ins> placeholders).
4. Rebuilds guides/index.html cleanly with the 30 flagship guides.
"""

import html
import json
import os
import re
import shutil
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GUIDES_DIR = os.path.join(BASE_DIR, "guides")
DRAFTS_DIR = os.path.join(BASE_DIR, "_drafts", "templated_guides")
REDIRECTS_PATH = os.path.join(BASE_DIR, "_redirects")
GUIDES_INDEX_PATH = os.path.join(GUIDES_DIR, "index.html")

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from unique_guides_data_1 import GUIDES_PART_1
from unique_guides_data_2 import GUIDES_PART_2

EXISTING_UNIQUE = {
    "best-budget-smartphones-under-15000.html": {
        "cat": "smartphones",
        "badge": "Budget 5G",
        "emoji": "📱",
        "gradient": "linear-gradient(135deg, #0ea5e9, #0369a1)",
        "read_time": "10 min read",
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
        "read_time": "10 min read",
    },
    "top-10-smartwatches-under-2000.html": {
        "cat": "audio",
        "badge": "Smartwatches",
        "emoji": "⌚",
        "gradient": "linear-gradient(135deg, #ec4899, #9d174d)",
        "read_time": "10 min read",
    },
    "best-power-banks-fast-charging-india.html": {
        "cat": "smart-home",
        "badge": "Power Banks",
        "emoji": "🔋",
        "gradient": "linear-gradient(135deg, #10b981, #047857)",
        "read_time": "9 min read",
    },
    "how-to-track-real-amazon-flipkart-price-drops.html": {
        "cat": "shopping",
        "badge": "Price Tracking",
        "emoji": "📉",
        "gradient": "linear-gradient(135deg, #ea580c, #9a3412)",
        "read_time": "9 min read",
    },
}

BRANCH_INFO = {
    "smartphones": ("Smartphones & Mobile", "/deals/?category=mobiles", "Explore Live Smartphone Deals →"),
    "laptops": ("Laptops & Computing", "/deals/?category=electronics", "Explore Live Laptop Deals →"),
    "audio": ("Audio & Wearables", "/deals/?category=electronics", "Explore Live Audio Deals →"),
    "smart-home": ("Smart Home & Power", "/deals/?category=home-kitchen", "Explore Live Home & Power Deals →"),
    "shopping": ("Smart Shopping & Security", "/deals/", "Explore Verified Today's Deals →"),
}


def extract_old_cats():
    """Read current guides/index.html to know each file's category before quarantining."""
    if not os.path.exists(GUIDES_INDEX_PATH):
        return {}
    txt = open(GUIDES_INDEX_PATH, "r", encoding="utf-8").read()
    return dict(re.findall(r'<a href="/guides/([^"]+)" class="guide-card" data-cat="([^"]+)">', txt))


def render_unique_guide_html(g):
    fname = g["fname"]
    cat = g["cat"]
    branch_name, deals_url, deals_btn = BRANCH_INFO[cat]
    canonical = f"https://www.thebhom.in/guides/{fname}"

    headers_html = "".join(f"<th>{html.escape(h)}</th>" for h in g["table_headers"])
    rows_html = "\n".join(
        "            <tr>" + "".join(f"<td>{html.escape(cell)}</td>" for cell in row) + "</tr>"
        for row in g["table_rows"]
    )

    sections_html = []
    toc_items = []
    for idx, (heading, body_html) in enumerate(g["sections"], start=1):
        sec_id = f"section-{idx}"
        toc_items.append(f'          <li><a href="#{sec_id}">{idx}. {html.escape(heading)}</a></li>')
        sections_html.append(
            f'      <section id="{sec_id}">\n'
            f'        <h2>{idx}. {html.escape(heading)}</h2>\n'
            f'        {body_html}\n'
            f'      </section>'
        )

    faq_idx = len(g["sections"]) + 1
    toc_items.append(f'          <li><a href="#faqs">{faq_idx}. Frequently Asked Questions</a></li>')

    faq_items_html = []
    faq_ld = []
    for q, a in g["faqs"]:
        faq_items_html.append(
            f'          <div class="faq-item">\n'
            f'            <div class="faq-question">❓ {html.escape(q)}</div>\n'
            f'            <div class="faq-answer">{html.escape(a)}</div>\n'
            f'          </div>'
        )
        faq_ld.append(
            {
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": a},
            }
        )

    schema_graph = json.dumps(
        {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Article",
                    "headline": g["title"],
                    "description": g["desc"],
                    "author": {
                        "@type": "Person",
                        "name": "Bhomvrat Rai",
                        "jobTitle": "Lead Technology & Consumer Electronics Editor",
                        "url": "https://www.thebhom.in/about",
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "TheBhom",
                        "logo": {"@type": "ImageObject", "url": "https://www.thebhom.in/icon-512.png"},
                    },
                    "datePublished": "2026-10-25",
                    "dateModified": "2026-11-11",
                    "mainEntityOfPage": canonical,
                },
                {"@type": "FAQPage", "mainEntity": faq_ld},
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

  <title>{html.escape(g["title"])} | TheBhom</title>
  <meta name="description" content="{html.escape(g["desc"])}">
  <meta property="og:title" content="{html.escape(g["title"])} | TheBhom">
  <meta property="og:description" content="{html.escape(g["desc"])}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="https://www.thebhom.in/og-image.png">
  <link rel="manifest" href="/manifest.json">
  <link rel="canonical" href="{canonical}">
  <link rel="stylesheet" href="/shared.css?v=20261111_v4">

  <script type="application/ld+json">
  {schema_graph}
  </script>

  <style>
    :root, [data-theme="light"] {{
      --art-bg: #f8fafc; --art-card: #ffffff; --art-border: #e2e8f0;
      --art-text: #0f172a; --art-muted: #475569; --art-accent: #10b981;
      --art-accent-light: #ecfdf5;
    }}
    [data-theme="navy"] {{
      --art-bg: #0b132b; --art-card: #142042; --art-border: rgba(56,189,248,0.2);
      --art-text: #f1f5f9; --art-muted: #94a3b8; --art-accent: #38bdf8;
      --art-accent-light: rgba(56,189,248,0.12);
    }}
    [data-theme="dark"] {{
      --art-bg: #0b0f19; --art-card: #131b2e; --art-border: rgba(255,255,255,0.1);
      --art-text: #f8fafc; --art-muted: #94a3b8; --art-accent: #10b981;
      --art-accent-light: rgba(16,185,129,0.12);
    }}
    body {{
      background: var(--art-bg); color: var(--art-text);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      margin: 0; padding: 0; line-height: 1.75; font-size: 16.5px;
    }}
    .article-container {{ max-width: 880px; margin: 0 auto; padding: 84px 20px 80px; }}
    .breadcrumb {{
      display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
      font-size: 0.9rem; color: var(--art-muted); margin-bottom: 20px; font-weight: 600;
    }}
    .breadcrumb a {{ color: var(--art-accent); text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; }}
    .article-header {{ margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1.5px solid var(--art-border); }}
    .article-badge {{
      display: inline-block; background: var(--art-accent-light); color: var(--art-accent);
      padding: 5px 14px; border-radius: 9999px; font-size: 0.85rem; font-weight: 700; margin-bottom: 12px;
    }}
    .article-header h1 {{ font-size: clamp(1.7rem, 3.6vw, 2.45rem); line-height: 1.25; margin: 0 0 14px; font-weight: 800; }}
    .article-meta-row {{ display: flex; flex-wrap: wrap; align-items: center; gap: 12px; font-size: 0.9rem; color: var(--art-muted); }}
    .toc-box {{
      background: var(--art-card); border: 1.5px solid var(--art-border);
      border-radius: 14px; padding: 18px 22px; margin: 22px 0 30px;
    }}
    .toc-title {{ font-weight: 800; margin-bottom: 10px; font-size: 1rem; }}
    .toc-list {{ list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }}
    .toc-list a {{ color: var(--art-accent); text-decoration: none; font-weight: 600; font-size: 0.95rem; }}
    h2 {{ font-size: 1.45rem; font-weight: 800; margin: 36px 0 14px; padding-bottom: 6px; border-bottom: 2px solid rgba(16,185,129,0.2); }}
    p {{ margin: 0 0 18px; }}
    ul, ol {{ padding-left: 22px; margin: 0 0 22px; }}
    li {{ margin-bottom: 10px; }}
    .table-responsive {{ overflow-x: auto; margin: 26px 0; border-radius: 14px; border: 1px solid var(--art-border); background: var(--art-card); }}
    .data-table {{ width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem; }}
    .data-table th {{ background: rgba(16,185,129,0.08); font-weight: 800; padding: 14px 16px; border-bottom: 1.5px solid var(--art-border); }}
    .data-table td {{ padding: 13px 16px; border-bottom: 1px solid var(--art-border); }}
    .data-table tr:last-child td {{ border-bottom: none; }}
    .faq-accordion {{ display: grid; gap: 14px; margin: 22px 0 32px; }}
    .faq-item {{ background: var(--art-card); border: 1px solid var(--art-border); border-radius: 12px; padding: 18px 20px; }}
    .faq-question {{ font-weight: 800; margin-bottom: 8px; font-size: 1.02rem; }}
    .faq-answer {{ color: var(--art-muted); font-size: 0.96rem; }}
    .deal-action-box {{
      background: var(--art-card); border: 1.5px solid var(--art-border);
      border-radius: 16px; padding: 26px; text-align: center; margin-top: 32px;
    }}
    .deal-action-btn {{
      display: inline-flex; align-items: center; justify-content: center; margin-top: 14px;
      background: var(--art-accent); color: #ffffff; padding: 12px 24px; min-height: 44px;
      border-radius: 12px; font-weight: 800; text-decoration: none;
    }}
  </style>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4674566886677472" crossorigin="anonymous"></script>
</head>
<body>
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K2B22XSW" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <div id="shared-header"></div>

  <main class="article-container">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span>›</span>
      <a href="/guides/">Guides</a>
      <span>›</span>
      <a href="/guides/{cat}/">{html.escape(branch_name)}</a>
      <span>›</span>
      <span style="color:var(--art-text);">{html.escape(g["badge"])}</span>
    </nav>

    <article>
      <header class="article-header">
        <span class="article-badge">{g["emoji"]} {html.escape(g["badge"])}</span>
        <h1>{html.escape(g["title"])}</h1>
        <div class="article-meta-row">
          <span><strong>By Bhomvrat Rai</strong></span>
          <span>•</span>
          <span>Updated November 2026</span>
          <span>•</span>
          <span>⏱️ {html.escape(g["read_time"])}</span>
        </div>
      </header>

      <p style="font-size:1.06rem;color:var(--art-muted);">{html.escape(g["desc"])}</p>

      <div class="toc-box">
        <div class="toc-title">📑 Quick Navigation</div>
        <ul class="toc-list">
{chr(10).join(toc_items)}
        </ul>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead><tr>{headers_html}</tr></thead>
          <tbody>
{rows_html}
          </tbody>
        </table>
      </div>

{chr(10).join(sections_html)}

      <section id="faqs">
        <h2>{faq_idx}. Frequently Asked Questions</h2>
        <div class="faq-accordion">
{chr(10).join(faq_items_html)}
        </div>
      </section>

      <div class="deal-action-box">
        <h3 style="margin:0 0 8px;font-size:1.3rem;">🛍️ Compare Verified Live Prices</h3>
        <p style="margin:0;color:var(--art-muted);">Check today's lowest verified prices across Amazon, Flipkart &amp; Myntra before buying.</p>
        <a href="{deals_url}" class="deal-action-btn">{html.escape(deals_btn)}</a>
      </div>
    </article>
  </main>

  <div id="shared-footer"></div>
  <script src="/shared.js?v=20261111_v4"></script>
</body>
</html>
"""


def build_card_html(fname, cat, badge, emoji, gradient, read_time, title, desc):
    return f"""      <a href="/guides/{fname}" class="guide-card" data-cat="{cat}">
        <div class="guide-thumb-wrap" style="background:{gradient};">
          <span>{emoji}</span>
          <span class="guide-category-badge">{html.escape(badge)}</span>
          <span class="guide-read-time">⏱️ {html.escape(read_time)}</span>
        </div>
        <div class="guide-content">
          <div class="guide-meta"><span>By Bhomvrat Rai</span> • <span>Updated Nov 2026</span></div>
          <h2 class="guide-title">{html.escape(title)}</h2>
          <p class="guide-desc">{html.escape(desc)}</p>
          <div class="guide-footer-action">
            <span>Read Complete Guide →</span>
            <span>✓ Verified Guide</span>
          </div>
        </div>
      </a>"""


def main():
    all_new = GUIDES_PART_1 + GUIDES_PART_2
    assert len(all_new) == 24, f"Expected 24 new guides, got {len(all_new)}"
    keep_set = set(EXISTING_UNIQUE.keys()) | {g["fname"] for g in all_new}
    assert len(keep_set) == 30, f"Expected 30 total guides, got {len(keep_set)}"

    old_cats = extract_old_cats()
    os.makedirs(DRAFTS_DIR, exist_ok=True)

    # 1. Quarantine 81 boilerplate guides & collect 301 redirects
    redirects_to_add = []
    moved = 0
    for fname in sorted(os.listdir(GUIDES_DIR)):
        if not fname.endswith(".html") or fname == "index.html":
            continue
        if fname not in keep_set:
            src = os.path.join(GUIDES_DIR, fname)
            dst = os.path.join(DRAFTS_DIR, fname)
            shutil.move(src, dst)
            cat = old_cats.get(fname, "")
            target = f"/guides/{cat}/" if cat in BRANCH_INFO else "/guides/"
            redirects_to_add.append(f"/guides/{fname} {target} 301")
            moved += 1
    print(f"✅ Quarantined {moved} templated guides to _drafts/templated_guides/")

    # Append 301 redirects cleanly without duplicates
    existing_redir = open(REDIRECTS_PATH, "r", encoding="utf-8").read()
    new_rules = [r for r in redirects_to_add if r.split()[0] not in existing_redir]
    if new_rules:
        with open(REDIRECTS_PATH, "a", encoding="utf-8") as rf:
            rf.write("\n# 301 Redirects for consolidated editorial guides (Zero 404s)\n")
            rf.write("\n".join(new_rules) + "\n")
    print(f"✅ Added {len(new_rules)} 301 redirect rules to _redirects")

    # 2. Write 24 100%-unique flagship guides
    for g in all_new:
        out_path = os.path.join(GUIDES_DIR, g["fname"])
        with open(out_path, "w", encoding="utf-8") as out:
            out.write(render_unique_guide_html(g))
    print(f"✅ Wrote {len(all_new)} 100%-unique topic-specific guides")

    # 3. Rebuild guides/index.html cleanly with strictly the 30 flagship guides
    cards_html_list = []
    for fname, meta in EXISTING_UNIQUE.items():
        fpath = os.path.join(GUIDES_DIR, fname)
        content = open(fpath, "r", encoding="utf-8").read()
        h1_m = re.search(r"<h1>(.*?)</h1>", content, re.DOTALL)
        desc_m = re.search(r'<meta name="description" content="([^"]*)"', content)
        title = html.unescape(re.sub(r"<[^>]+>", "", h1_m.group(1))).strip() if h1_m else fname
        desc = html.unescape(desc_m.group(1)).strip() if desc_m else ""
        cards_html_list.append(
            build_card_html(
                fname, meta["cat"], meta["badge"], meta["emoji"], meta["gradient"], meta["read_time"], title, desc
            )
        )
    for g in all_new:
        cards_html_list.append(
            build_card_html(
                g["fname"], g["cat"], g["badge"], g["emoji"], g["gradient"], g["read_time"], g["title"], g["desc"]
            )
        )

    idx_html = open(GUIDES_INDEX_PATH, "r", encoding="utf-8").read()
    idx_html = re.sub(
        r'<div class="guides-grid" id="guidesGrid">.*?</div>\s*</main>',
        '<div class="guides-grid" id="guidesGrid">\n' + "\n\n".join(cards_html_list) + "\n    </div>\n  </main>",
        idx_html,
        flags=re.DOTALL,
    )
    # Normalize initial guide counts cleanly before build_guides_logical_tree runs
    idx_html = re.sub(r"\(\d+\+ Tested\)", "(30 Tested)", idx_html)
    idx_html = re.sub(r"\d+\+ in-depth", "30 original, in-depth", idx_html)
    idx_html = re.sub(r"Over \d+\+ thoroughly", "30 original, thoroughly", idx_html)
    idx_html = re.sub(r"Search \d+\+ tech", "Search 30 original tech", idx_html)
    with open(GUIDES_INDEX_PATH, "w", encoding="utf-8") as out:
        out.write(idx_html)
    print("✅ Rebuilt guides/index.html with 30 pure unique flagship guides.")


if __name__ == "__main__":
    main()

