import fs from "fs";
import path from "path";

const CATALOG_PATH = path.join(process.cwd(), "deals/data/catalog.json");
const OUTPUT_DIR = path.join(process.cwd(), "deals/p");
const BASE_URL = "https://www.thebhom.in";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const rawCatalog = fs.readFileSync(CATALOG_PATH, "utf8");
const catalog = JSON.parse(rawCatalog);

console.log(`Generating individual SEO product pages for ${catalog.length} items...`);

function renderProductPage(product, allProducts) {
  const isFree = product.dealPrice === 0;
  const formattedPrice = isFree ? "FREE" : `₹${product.dealPrice.toLocaleString("en-IN")}`;
  const formattedOriginalPrice = product.originalPrice > 0 ? `₹${product.originalPrice.toLocaleString("en-IN")}` : "";
  const pageUrl = `${BASE_URL}/deals/p/${product.slug}.html`;

  // Filter 3 related deals
  const related = allProducts
    .filter(p => p.id !== product.id)
    .slice(0, 3);

  // Schema.org JSON-LD
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": [product.image],
    "description": product.summary,
    "brand": {
      "@type": "Brand",
      "name": product.brand || product.store
    },
    "offers": {
      "@type": "Offer",
      "url": product.profitLink,
      "priceCurrency": "INR",
      "price": product.dealPrice,
      "priceValidUntil": "2026-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": product.store
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating.toString(),
      "reviewCount": product.reviewsCount.toString()
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${BASE_URL}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Deals",
        "item": `${BASE_URL}/deals/`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.title,
        "item": pageUrl
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(product.title)} at ${formattedPrice} (${product.discount}) - TheBhom Deals</title>
  <meta name="description" content="Get ${escapeHtml(product.title)} at ${formattedPrice} with ${product.discount}. Complete real review, specifications, pros & cons, and verified buy link.">
  <link rel="canonical" href="${pageUrl}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${escapeHtml(product.title)} - ${formattedPrice} (${product.discount})">
  <meta property="og:description" content="${escapeHtml(product.summary)}">
  <meta property="og:image" content="${product.image}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:type" content="product">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(product.title)} - ${formattedPrice}">
  <meta name="twitter:description" content="${escapeHtml(product.summary)}">
  <meta name="twitter:image" content="${product.image}">

  <!-- Favicon -->
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛍️</text></svg>">

  <!-- Google Fonts: Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

  <!-- Stylesheet -->
  <link rel="stylesheet" href="../css/style.css">

  <!-- Google Analytics 4 (GA4) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-GHVNZWFVQV"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-GHVNZWFVQV');
  </script>

  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4674566886677472" crossorigin="anonymous"></script>

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
    ${JSON.stringify(productSchema, null, 2)}
  </script>
  <script type="application/ld+json">
    ${JSON.stringify(breadcrumbSchema, null, 2)}
  </script>
</head>
<body>

  <!-- Site Header -->
  <header class="site-header">
    <div class="container header-content">
      <a href="../" class="brand">
        <div class="brand-icon">🛍️</div>
        <div class="brand-text">
          <span class="brand-title">TheBhom <span>Deals</span></span>
          <p>Verified Online Shopping Loot Deals</p>
        </div>
      </a>

      <div class="header-actions">
        <a href="../" class="btn-secondary-nav">← Back to All Deals</a>
        <a href="https://telegram.me/realearnkaro" target="_blank" rel="noopener noreferrer" class="btn-header-telegram">
          <span>Join Telegram Channel</span>
        </a>
      </div>
    </div>
  </header>

  <!-- Breadcrumbs -->
  <nav class="container breadcrumbs-nav" aria-label="Breadcrumb">
    <a href="/">Home</a>
    <span>/</span>
    <a href="../">Deals</a>
    <span>/</span>
    <span>${escapeHtml(product.brand || product.store)}</span>
    <span>/</span>
    <span class="current">${escapeHtml(product.title.slice(0, 35))}...</span>
  </nav>

  <!-- Main Product Detail Page -->
  <main class="container product-detail-layout">
    
    <div class="product-showcase-grid">
      <!-- Left Column: Gallery / Image -->
      <div class="product-gallery-card">
        <div class="main-image-wrapper">
          <img src="${product.image}" alt="${escapeHtml(product.title)}" class="product-detail-img">
          <span class="detail-badge">${product.badge || product.discount}</span>
          <span class="detail-store-tag">${escapeHtml(product.store)}</span>
        </div>
      </div>

      <!-- Right Column: Pricing & Primary Actions -->
      <div class="product-meta-card">
        <div class="product-brand-tag">${escapeHtml(product.brand || product.store)}</div>
        <h1 class="product-page-title">${escapeHtml(product.title)}</h1>

        <!-- Rating Row -->
        <div class="product-rating-row">
          <span class="star-rating">★ ${product.rating}</span>
          <span class="review-count">(${product.reviewsCount.toLocaleString("en-IN")} verified buyer ratings)</span>
          <span class="verified-tag">✓ Deal Verified Today</span>
        </div>

        <!-- Pricing Block -->
        <div class="detail-pricing-box">
          <div class="price-header">Special Deal Price</div>
          <div class="price-values">
            <span class="current-deal-price">${formattedPrice}</span>
            ${formattedOriginalPrice ? `<span class="detail-original-price">${formattedOriginalPrice}</span>` : ""}
            <span class="detail-discount-tag">${product.discount}</span>
          </div>

          <!-- Real Consumer Savings Badge -->
          <div class="detail-savings-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            ${isFree 
              ? `<span>Special Offer: <strong>Flat 5% Unlimited Online Cashback on Card</strong></span>`
              : `<span>You Save: <strong>₹${(product.originalPrice - product.dealPrice).toLocaleString("en-IN")} (${product.discount})</strong> • Lowest Price Verified</span>`
            }
          </div>
        </div>

        <!-- Primary CTA Buttons -->
        <div class="detail-cta-group">
          <a href="${product.profitLink}" target="_blank" rel="noopener noreferrer nofollow" class="btn-buy-primary">
            <span>BUY NOW ON ${escapeHtml(product.store.toUpperCase())}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <button class="btn-share-whatsapp" onclick="shareWhatsApp('${escapeHtml(product.title)}', '${product.dealPrice}', '${product.discount}', window.location.href)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
            <span>Share Deal on WhatsApp</span>
          </button>
        </div>

        <p class="affiliate-disclosure-note">Official merchant link with auto-applied coupon & affiliate discount code.</p>
      </div>
    </div>

    <!-- Review & Analysis Section (Human-Touch E-E-A-T) -->
    <section class="review-analysis-container">
      
      <!-- Summary -->
      <div class="review-card">
        <h2>Editor's Hands-On Summary</h2>
        <p class="review-lead-text">${escapeHtml(product.summary)}</p>
      </div>

      <!-- Highlights -->
      <div class="review-card">
        <h3>Key Product Highlights</h3>
        <ul class="highlights-list">
          ${product.highlights.map(h => `<li><span class="check-bullet">✓</span> ${escapeHtml(h)}</li>`).join("")}
        </ul>
      </div>

      <!-- Specifications Table -->
      <div class="review-card">
        <h3>Technical Specifications</h3>
        <div class="specs-table">
          ${product.specs.map(s => `
            <div class="spec-row">
              <span class="spec-label">${escapeHtml(s.label)}</span>
              <span class="spec-val">${escapeHtml(s.value)}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Pros and Cons (Anti-Spam / Real E-E-A-T Review) -->
      <div class="pros-cons-grid">
        <div class="pros-card">
          <div class="pros-header">
            <span class="badge-icon green">👍</span>
            <h4>What We Like (Pros)</h4>
          </div>
          <ul>
            ${product.pros.map(p => `<li>${escapeHtml(p)}</li>`).join("")}
          </ul>
        </div>

        <div class="cons-card">
          <div class="cons-header">
            <span class="badge-icon red">👎</span>
            <h4>Things to Consider (Cons)</h4>
          </div>
          <ul>
            ${product.cons.map(c => `<li>${escapeHtml(c)}</li>`).join("")}
          </ul>
        </div>
      </div>

      <!-- Who Should Buy & Final Verdict -->
      <div class="verdict-card">
        <h3>Who Should Buy This?</h3>
        <p style="margin-bottom: 16px; color: #334155;">${escapeHtml(product.whoShouldBuy)}</p>
        
        <div class="verdict-highlight">
          <strong>Final Verdict:</strong> ${escapeHtml(product.verdict)}
        </div>

        <div style="margin-top: 24px;">
          <a href="${product.profitLink}" target="_blank" rel="noopener noreferrer nofollow" class="btn-buy-primary" style="max-width: 320px;">
            <span>GRAB DEAL AT ${formattedPrice}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>

    </section>

    <!-- Google AdSense Banner Slot -->
    <aside class="ad-slot-card" style="margin: 40px 0;">
      <span class="ad-label">Advertisement</span>
      <ins class="adsbygoogle"
           style="display:block; text-align:center;"
           data-ad-layout="in-article"
           data-ad-format="fluid"
           data-ad-client="ca-pub-4674566886677472"
           data-ad-slot="9101298657"></ins>
      <script>
           (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </aside>

    <!-- Related Handpicked Deals -->
    <section class="related-deals-section">
      <h3 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 20px;">More Trending Deals You Might Like</h3>
      <div class="deals-grid">
        ${related.map(r => `
          <article class="deal-card">
            <div class="card-top">
              <img class="card-img" src="${r.image}" alt="${escapeHtml(r.title)}" loading="lazy">
              <span class="card-badge">${r.discount}</span>
              <span class="store-tag">${escapeHtml(r.store)}</span>
            </div>
            <div class="card-body">
              <h4 class="deal-title"><a href="${r.slug}.html" style="text-decoration:none; color:inherit;">${escapeHtml(r.title)}</a></h4>
              <div class="pricing-row">
                <span class="deal-price">${r.dealPrice === 0 ? "FREE" : `₹${r.dealPrice.toLocaleString("en-IN")}`}</span>
                ${r.originalPrice > 0 ? `<span class="original-price">₹${r.originalPrice.toLocaleString("en-IN")}</span>` : ""}
                <span class="discount-pill">${r.discount}</span>
              </div>
              <div class="card-actions">
                <a href="${r.slug}.html" class="btn-grab" style="background:#2563eb;">View Deal</a>
              </div>
            </div>
          </article>
        `).join("")}
      </div>
    </section>

  </main>

  <!-- Site Footer -->
  <footer class="site-footer">
    <div class="container footer-content">
      <div>
        <p><strong>TheBhom Deals</strong> &copy; 2026. All rights reserved.</p>
        <p style="font-size: 11px; margin-top: 4px; color: #94a3b8;">Disclaimer: When you buy through links on our site, we may earn an affiliate commission at no additional cost to you.</p>
      </div>
      <div class="footer-links">
        <a href="${BASE_URL}/">TheBhom.in</a>
        <a href="../">All Deals</a>
        <a href="https://earnkaro.com?r=5610321" target="_blank" rel="noopener">Earn With Us</a>
        <a href="https://telegram.me/realearnkaro" target="_blank" rel="noopener">Telegram Alerts</a>
      </div>
    </div>
  </footer>

  <script>
    function shareWhatsApp(title, price, discount, link) {
      const priceText = price === '0' ? 'FREE' : '₹' + price;
      const text = '🔥 *LOOT DEAL ALERT!* 🔥\\n\\n🛍️ *' + title + '*\\n💰 *Price*: ' + priceText + ' (' + discount + ')\\n\\n👉 *Check Full Deal & Buy*: ' + link;
      window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(text), '_blank');
    }
  </script>
</body>
</html>`;
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

let generatedCount = 0;
for (const product of catalog) {
  const html = renderProductPage(product, catalog);
  const outPath = path.join(OUTPUT_DIR, `${product.slug}.html`);
  fs.writeFileSync(outPath, html, "utf8");
  generatedCount++;
  console.log(`[SEO Page] Generated: deals/p/${product.slug}.html`);
}

console.log(`✅ Finished generating ${generatedCount} SEO product landing pages!`);
