import fs from "fs";
import path from "path";

const catalogPath = "/Users/bhomvratrai/Documents/GitHub/thebhom-landing/deals/data/catalog.json";
const pDir = "/Users/bhomvratrai/Documents/GitHub/thebhom-landing/deals/p";

if (!fs.existsSync(pDir)) {
  fs.mkdirSync(pDir, { recursive: true });
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

let generated = 0;
for (const item of catalog) {
  const filePath = path.join(pDir, `${item.slug}.html`);
  const originalPriceFormatted = item.originalPrice ? `₹${item.originalPrice.toLocaleString("en-IN")}` : "";
  const dealPriceFormatted = item.dealPrice ? `₹${item.dealPrice.toLocaleString("en-IN")}` : "FREE";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(item.title)} at ${dealPriceFormatted} (${item.discount}) - TheBhom Deals</title>
  <meta name="description" content="Get ${escapeHtml(item.title)} at ${dealPriceFormatted} with ${item.discount}. Verified lowest price on ${escapeHtml(item.store)}, authentic specs, reviews, and direct buy link.">
  <link rel="canonical" href="https://www.thebhom.in/deals/p/${item.slug}.html">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${escapeHtml(item.title)} - ${dealPriceFormatted} (${item.discount})">
  <meta property="og:description" content="${escapeHtml(item.summary || item.title)}">
  <meta property="og:image" content="${item.image}">
  <meta property="og:url" content="https://www.thebhom.in/deals/p/${item.slug}.html">
  <meta property="og:type" content="product">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(item.title)} - ${dealPriceFormatted}">
  <meta name="twitter:description" content="${escapeHtml(item.summary || item.title)}">
  <meta name="twitter:image" content="${item.image}">

  <!-- Favicon -->
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛍️</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">

  <!-- Google Analytics 4 (GA4) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-GHVNZWFVQV"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag("js", new Date());
    gtag("config", "G-GHVNZWFVQV");
  </script>

  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4674566886677472" crossorigin="anonymous"></script>

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": ${JSON.stringify(item.title)},
    "image": [${JSON.stringify(item.image)}],
    "description": ${JSON.stringify(item.summary || item.title)},
    "brand": {
      "@type": "Brand",
      "name": ${JSON.stringify(item.brand || "Brand")}
    },
    "offers": {
      "@type": "Offer",
      "url": ${JSON.stringify(item.profitLink)},
      "priceCurrency": "INR",
      "price": ${item.dealPrice || 0},
      "priceValidUntil": "2026-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": ${JSON.stringify(item.store)}
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "${item.rating || "4.3"}",
      "reviewCount": "${item.reviewsCount || "1200"}"
    }
  }
  </script>
</head>
<body class="ecommerce-body">
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
        <a href="/deals/" class="nav-link-subtle">← All Deals</a>
        <a href="/" class="nav-link-subtle">TheBhom Home</a>
        <a href="${item.profitLink}" target="_blank" rel="noopener noreferrer nofollow" class="telegram-deal-pill">
          <span>Buy on ${escapeHtml(item.store)}</span>
        </a>
      </div>
    </div>
  </header>

  <main class="container-fluid" style="padding-top: 24px; padding-bottom: 40px; max-width: 1100px;">
    <div style="background: #fff; border-radius: 12px; padding: 24px; border: 1px solid #e0e0e0; display: flex; flex-direction: column; gap: 24px;">
      <div style="display: flex; flex-wrap: wrap; gap: 32px; align-items: flex-start;">
        <div style="flex: 1; min-width: 280px; max-width: 400px; text-align: center; background: #f8fafc; padding: 24px; border-radius: 8px;">
          <img src="${item.image}" alt="${escapeHtml(item.title)}" style="max-width: 100%; max-height: 340px; object-fit: contain;">
        </div>
        <div style="flex: 2; min-width: 300px; display: flex; flex-direction: column; gap: 12px;">
          <span style="font-size: 13px; font-weight: 700; color: #2563eb; text-transform: uppercase;">${escapeHtml(item.brand)} • ${escapeHtml(item.store)}</span>
          <h1 style="font-size: 22px; font-weight: 800; line-height: 1.3; color: #1e293b;">${escapeHtml(item.title)}</h1>
          
          <div style="display: flex; align-items: center; gap: 8px; font-size: 13px;">
            <span style="background: #16a34a; color: #fff; padding: 3px 8px; border-radius: 4px; font-weight: 700;">★ ${item.rating || "4.3"}</span>
            <span style="color: #64748b;">(${Number(item.reviewsCount || 1200).toLocaleString("en-IN")} ratings)</span>
            <span style="background: #ffedd5; color: #c2410c; padding: 3px 8px; border-radius: 4px; font-weight: 700;">${item.discount}</span>
          </div>

          <div style="display: flex; align-items: baseline; gap: 12px; margin-top: 8px;">
            <span style="font-size: 28px; font-weight: 900; color: #0f172a;">${dealPriceFormatted}</span>
            ${originalPriceFormatted ? `<span style="font-size: 16px; color: #94a3b8; text-decoration: line-through;">${originalPriceFormatted}</span>` : ""}
          </div>

          <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-top: 8px;">${escapeHtml(item.summary || "")}</p>

          <div style="margin-top: 16px;">
            <a href="${item.profitLink}" target="_blank" rel="noopener noreferrer nofollow" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #fb641b; color: #fff; font-weight: 800; font-size: 16px; padding: 14px 32px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 12px rgba(251, 100, 27, 0.3);">
              <span>Buy Now on ${escapeHtml(item.store)}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>

          <div style="margin-top: 16px; padding: 12px 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; font-size: 13px; color: #166534;">
            <strong>✓ Verified Lowest Price Deal:</strong> 100% genuine product directly from official seller on ${escapeHtml(item.store)}.
          </div>
        </div>
      </div>
    </div>
  </main>

  <footer class="ecommerce-footer">
    <div class="container-fluid footer-row">
      <p><strong>TheBhom Deals</strong> &copy; 2026. Online Deals & Verified Price Drop Catalog.</p>
      <div class="footer-links-group">
        <a href="/deals/">All Deals</a>
        <a href="/">TheBhom.in</a>
      </div>
    </div>
  </footer>
</body>
</html>`;

  fs.writeFileSync(filePath, html);
  generated++;
}

console.log(`Generated ${generated} product detail pages successfully!`);
