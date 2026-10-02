// ==========================================================================
// TheBhom Deals - Main Hub Application Logic
// ==========================================================================

const AFFILIATE_ID = "5610321";
const AMAZON_TAG = "bhom120704-21";

let catalog = [];
let currentCategory = "all";
let searchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
  initCatalog();
  setupEventListeners();
  startFlashTimers();
});

// Load Catalog
async function initCatalog() {
  try {
    const res = await fetch("data/catalog.json");
    if (!res.ok) throw new Error("Catalog fetch error");
    catalog = await res.json();
  } catch (err) {
    console.warn("Catalog fetch failed, falling back:", err);
  }
  renderDeals();
}

// Render Deals
function renderDeals() {
  const container = document.getElementById("dealsContainer");
  if (!container) return;

  const filtered = catalog.filter(item => {
    const matchesCategory = currentCategory === "all" || item.category === currentCategory;
    const matchesSearch = !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.discount.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <h3 style="font-size: 20px; font-weight: 700; color: #475569; margin-bottom: 8px;">No matching deals found</h3>
        <p style="color: #94a3b8; font-size: 14px;">Try searching for another keyword or browse all categories.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => createCardHtml(item)).join("");
}

// Create Card HTML
function createCardHtml(item) {
  const isFree = item.dealPrice === 0;
  const formattedPrice = isFree ? "FREE" : `₹${item.dealPrice.toLocaleString("en-IN")}`;
  const formattedOriginalPrice = item.originalPrice > 0 ? `₹${item.originalPrice.toLocaleString("en-IN")}` : "";
  const detailUrl = `p/${item.slug}.html`;

  return `
    <article class="deal-card" data-id="${item.id}">
      <div class="card-top">
        <a href="${detailUrl}">
          <img class="card-img" src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy">
        </a>
        <span class="card-badge">${item.badge || item.discount}</span>
        <span class="store-tag">${escapeHtml(item.store)}</span>
        ${item.isFlashDeal ? `<div class="flash-timer">⚡ Ends in <span class="time-text">02:14:30</span></div>` : ""}
      </div>
      <div class="card-body">
        <h3 class="deal-title">
          <a href="${detailUrl}">${escapeHtml(item.title)}</a>
        </h3>
        <div class="pricing-row">
          <span class="deal-price">${formattedPrice}</span>
          ${formattedOriginalPrice ? `<span class="original-price">${formattedOriginalPrice}</span>` : ""}
          <span class="discount-pill">${item.discount}</span>
        </div>
        <div class="deal-savings-badge">
          <span class="savings-tag">💰 You Save: ${isFree ? "Zero Joining Fee" : (item.originalPrice > item.dealPrice ? `₹${(item.originalPrice - item.dealPrice).toLocaleString("en-IN")}` : item.discount)}</span>
          <span class="verified-dot">✓ Verified Deal</span>
        </div>
        <div class="card-actions">
          <a href="${item.profitLink}" target="_blank" rel="noopener noreferrer nofollow" class="btn-grab">
            <span>BUY NOW</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <button class="btn-icon-action" onclick="copyLink('${item.profitLink}')" title="Copy Affiliate Link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
          <button class="btn-icon-action whatsapp" onclick="shareWhatsApp('${escapeHtml(item.title)}', '${item.dealPrice}', '${item.discount}', '${item.profitLink}')" title="Share via WhatsApp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
          </button>
        </div>
      </div>
    </article>
  `;
}

// Event Listeners
function setupEventListeners() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      renderDeals();
    });
  }

  const pills = document.querySelectorAll(".category-pill");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentCategory = pill.getAttribute("data-category");
      renderDeals();
    });
  });

  const convertForm = document.getElementById("convertForm");
  if (convertForm) {
    convertForm.addEventListener("submit", handleUniversalLinkConversion);
  }
}

// Handle Universal Link Converter
function handleUniversalLinkConversion(e) {
  e.preventDefault();
  const input = document.getElementById("convertUrlInput");
  const resultBox = document.getElementById("converterResult");
  const resultLink = document.getElementById("resultLink");
  if (!input || !input.value) return;

  const rawUrl = input.value.trim();
  let converted = "";

  if (rawUrl.includes("amazon.in") || rawUrl.includes("amzn.to")) {
    const clean = rawUrl.split("?")[0];
    converted = `${clean}?tag=${AMAZON_TAG}`;
  } else if (rawUrl.includes("flipkart.com") || rawUrl.includes("myntra.com") || rawUrl.includes("ajio.com")) {
    converted = `https://earnkaro.com?r=${AFFILIATE_ID}&fname=Bhomvrat+Rai&dl=${encodeURIComponent(rawUrl)}`;
  } else {
    converted = `https://earnkaro.com?r=${AFFILIATE_ID}&fname=Bhomvrat+Rai`;
  }

  if (resultBox && resultLink) {
    resultLink.textContent = converted;
    resultLink.href = converted;
    resultBox.classList.add("active");
  }

  showToast("Profit Link Ready! Tagged to Your ID 🎉");
}

// Copy to Clipboard
window.copyLink = function(url) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      showToast("Affiliate Link Copied to Clipboard! 📋");
    });
  } else {
    const el = document.createElement("textarea");
    el.value = url;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    showToast("Affiliate Link Copied! 📋");
  }
};

// Share to WhatsApp
window.shareWhatsApp = function(title, price, discount, link) {
  const priceText = price === "0" ? "FREE" : `₹${price}`;
  const text = `🔥 *LOOT DEAL ALERT!* 🔥\n\n🛍️ *${title}*\n💰 *Deal Price*: ${priceText} (${discount})\n\n👉 *Buy / Grab Deal*: ${link}\n\n_Hurry, price may rise anytime!_`;
  const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(shareUrl, "_blank");
};

// Toast
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// Flash Timers
function startFlashTimers() {
  setInterval(() => {
    const timerEls = document.querySelectorAll(".flash-timer .time-text");
    timerEls.forEach(el => {
      const parts = el.textContent.split(":").map(Number);
      let [h, m, s] = parts;
      s--;
      if (s < 0) { s = 59; m--; }
      if (m < 0) { m = 59; h--; }
      if (h < 0) { h = 2; m = 30; s = 0; }
      el.textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    });
  }, 1000);
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
