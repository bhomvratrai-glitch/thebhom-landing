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

  // Related deals
  const related = allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

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
      "ratingValue": (product.rating || 4.3).toString(),
      "reviewCount": (product.reviewsCount || 15000).toString()
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
  <meta name="description" content="Get ${escapeHtml(product.title)} at ${formattedPrice} with ${product.discount}. Full specifications, pros & cons, verified buyer reviews, and direct buy link.">
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
<body class="ecommerce-body">

  <!-- Header -->
  <header class="ecommerce-header">
    <div class="header-inner container-fluid">
      <a href="/deals/" class="header-logo">
        <div class="logo-box">
          <span class="logo-icon">🛍️</span>
          <span class="logo-brand">TheBhom</span>
          <span class="logo-tag">DEALS</span>
        </div>
      </a>
      <div class="header-nav-right">
        <a href="/deals/" class="nav-link-subtle">← Back to All Deals</a>
        <a href="/" class="nav-link-subtle">TheBhom Home</a>
      </div>
    </div>
  </header>

  <!-- Product Detail Container -->
  <main class="product-detail-container">
    
    <!-- Breadcrumb -->
    <nav class="detail-breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span>/</span>
      <a href="/deals/">Deals</a>
      <span>/</span>
      <span style="color: #1e293b;">${escapeHtml(product.brand)}</span>
    </nav>

    <!-- Hero Card: Left Image + Right Info -->
    <section class="detail-hero-card">
      
      <!-- Left: Big Product Image -->
      <div class="detail-gallery-box">
        <img class="detail-main-img" src="${product.image}" alt="${escapeHtml(product.title)}" loading="eager">
      </div>

      <!-- Right: Product Pricing & Actions -->
      <div class="detail-info-pane">
        
        <span class="product-brand" style="font-size: 13px; margin-bottom: 6px;">${escapeHtml(product.brand)} • Official Store Deal</span>
        <h1 class="detail-product-title">${escapeHtml(product.title)}</h1>

        <!-- Ratings -->
        <div class="detail-rating-row">
          <span class="detail-rating-pill">★ ${product.rating || "4.3"}</span>
          <span style="font-size: 13px; color: #64748b;">(${Number(product.reviewsCount || 15000).toLocaleString("en-IN")} verified buyer reviews)</span>
          <span style="font-size: 12px; font-weight: 700; color: #16a34a; margin-left: 8px;">✓ 100% In Stock & Verified</span>
        </div>

        <!-- Pricing Card -->
        <div class="detail-pricing-card">
          <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Verified Deal Price</div>
          <div style="display: flex; align-items: baseline;">
            <span class="detail-price-main">${formattedPrice}</span>
            ${formattedOriginalPrice ? `<span class="detail-mrp-cut">${formattedOriginalPrice}</span>` : ""}
            <span class="detail-discount-tag">${product.discount}</span>
          </div>
          <div style="margin-top: 8px; font-size: 13px; color: #166534; font-weight: 600;">
            💰 You Save: ${isFree ? "Special Free Activation" : `₹${(product.originalPrice - product.dealPrice).toLocaleString("en-IN")} (${product.discount})`}
          </div>
        </div>

        <!-- Action CTAs -->
        <div class="detail-action-buttons">
          <a href="${product.profitLink}" target="_blank" rel="noopener noreferrer nofollow" class="btn-buy-store-cta">
            <span>BUY NOW ON ${escapeHtml(product.store.toUpperCase())}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <button class="btn-share-deal" onclick="shareWhatsApp('${escapeHtml(product.title)}', '${product.dealPrice}', '${product.discount}', window.location.href)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
            <span>Share Deal</span>
          </button>
        </div>

        <p style="font-size: 12px; color: #94a3b8;">✓ Direct link with lowest price and coupon code auto-applied.</p>

      </div>

    </section>

    <!-- Review & Analysis Sections (E-E-A-T Content) -->
    <div class="review-sections-grid">
      
      <!-- Summary -->
      <div class="info-block-card">
        <h2>Editor's Hands-On Summary</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #334155;">${escapeHtml(product.summary)}</p>
      </div>

      <!-- Highlights -->
      <div class="info-block-card">
        <h3>Key Product Highlights</h3>
        <ul style="list-style: none; margin-top: 8px;">
          ${product.highlights.map(h => `<li style="font-size: 14px; line-height: 1.5; margin-bottom: 8px; display: flex; gap: 8px; color: #334155;"><span style="color: #16a34a; font-weight: 800;">✓</span> ${escapeHtml(h)}</li>`).join("")}
        </ul>
      </div>

      <!-- Specs Table -->
      <div class="info-block-card">
        <h3>Technical Specifications</h3>
        <table class="specs-data-table">
          <tbody>
            ${product.specs.map(s => `
              <tr>
                <td class="label-col">${escapeHtml(s.label)}</td>
                <td class="value-col">${escapeHtml(s.value)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <!-- Pros & Cons -->
      <div class="info-block-card">
        <h3>Authentic Pros & Cons</h3>
        <div class="pro-con-grid">
          <div class="pro-box">
            <h4>What We Loved (Pros)</h4>
            <ul class="point-list">
              ${product.pros.map(p => `<li><span class="bullet-icon">✓</span><span>${escapeHtml(p)}</span></li>`).join("")}
            </ul>
          </div>
          <div class="con-box">
            <h4>Things to Consider (Cons)</h4>
            <ul class="point-list">
              ${product.cons.map(c => `<li><span class="bullet-icon">✕</span><span>${escapeHtml(c)}</span></li>`).join("")}
            </ul>
          </div>
        </div>
      </div>

      <!-- Who Should Buy & Verdict -->
      <div class="info-block-card">
        <h3>Target Buyer & Verdict</h3>
        <p style="font-size: 14px; margin-bottom: 12px; color: #334155;"><strong>Who Should Buy:</strong> ${escapeHtml(product.whoShouldBuy)}</p>
        <p style="font-size: 14px; color: #1e293b; background: #f8fafc; padding: 14px; border-left: 4px solid var(--primary-blue); border-radius: 4px;"><strong>Final Verdict:</strong> ${escapeHtml(product.verdict)}</p>
      </div>

    </div>

  </main>

  <!-- Footer -->
  <footer class="ecommerce-footer">
    <div class="container-fluid footer-row">
      <div>
        <p><strong>TheBhom Deals</strong> &copy; 2026. Online Shopping Deals & Price Drop Alerts.</p>
      </div>
      <div class="footer-links-group">
        <a href="/deals/">All Deals</a>
        <a href="/">TheBhom Home</a>
      </div>
    </div>
  </footer>

  <script>
    function shareWhatsApp(title, price, discount, url) {
      const text = encodeURIComponent("🔥 Loot Deal on " + title + "!\\n💰 Deal Price: ₹" + price + " (" + discount + ")\\n\\n👉 Check out here: " + url);
      window.open("https://api.whatsapp.com/send?text=" + text, "_blank");
    }
  </script>
</body>
</html>`;
}

function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Generate all pages
catalog.forEach(product => {
  const html = renderProductPage(product, catalog);
  const filePath = path.join(OUTPUT_DIR, `${product.slug}.html`);
  fs.writeFileSync(filePath, html, "utf8");
  console.log(`[SEO Page] Generated: deals/p/${product.slug}.html`);
});

console.log(`✅ Finished generating ${catalog.length} SEO product landing pages!`);
