// ============================================================
// TheBhom.in — Shared App Logic
// shared.js
// ============================================================

const SUBDOMAINS = [
  {label:'⚡ Video Downloader',url:'downloader/',id:'downloader'},
  {label:'🖼️ Wallpapers',url:'wallpapers.html',id:'wallpapers'},
  {label:'📚 E-Books',url:'ebooks.html',id:'ebooks'},
  {label:'📰 Magazines',url:'magazines.html',id:'magazines'},
  {label:'🎨 Templates',url:'templates.html',id:'templates'},
  {label:'💌 Cards',url:'cards.html',id:'cards'},
];

// ===== RENDER HEADER =====
function renderHeader(activePage=''){
  const nav = SUBDOMAINS.map(s=>`<li><a href="${s.url}" class="${s.id===activePage?'active':''}">${s.label}</a></li>`).join('');
  const subLinks = SUBDOMAINS.map(s=>`<a href="${s.url}" class="sub-link ${s.id===activePage?'here':''}">${s.label}</a>`).join('');
  return `
<div class="scroll-prog" id="sp"></div>
<header class="hdr">
  <a href="index.html" class="logo">
    <div class="logo-box">TB</div>
    <span class="logo-txt">The<span>Bhom</span>.in</span>
  </a>
  <nav><ul class="hdr-nav">${nav}</ul></nav>
  <div class="hdr-right">
    <button class="spotlight-btn" onclick="openSpotlight()" style="display:inline-flex;align-items:center;gap:6px;background:rgba(124,58,237,0.18);border:1px solid rgba(124,58,237,0.4);color:#c084fc;font-weight:700;border-radius:50px;padding:6px 14px;cursor:pointer;font-size:.78rem;">🔍 Search <kbd style="background:rgba(0,0,0,0.3);padding:1px 5px;border-radius:4px;font-size:.65rem;border:1px solid rgba(255,255,255,0.2);">⌘K</kbd></button>
    <button class="fav-act-btn" onclick="openFavDrawer()" style="display:inline-flex;align-items:center;gap:6px;background:rgba(244,63,94,0.15);border:1px solid rgba(244,63,94,0.3);color:#f472b6;font-weight:700;border-radius:50px;padding:6px 14px;cursor:pointer;">❤️ Saved (<span class="fav-count-badge">0</span>)</button>
    <button id="langToggleBtn" class="lang-btn" onclick="toggleLanguage()">🇮🇳 हिन्दी</button>
    <button id="pwaInstallBtn" class="pwa-btn" style="display:none;" onclick="triggerAppInstall()">📱 Install App</button>
    <span style="font-size:.8rem;color:var(--green);font-weight:700;background:rgba(34,197,94,.12);padding:5px 14px;border-radius:50px;border:1px solid rgba(34,197,94,.3);">✅ 100% FREE</span>
  </div>
  <button class="ham" id="hamBtn" aria-label="Menu"><span></span><span></span><span></span></button>
</header>
<nav class="mob-nav" id="mobNav">
  <a href="index.html">🏠 Home</a>
  <a href="#" onclick="openSpotlight();return false;" style="color:#c084fc;font-weight:700;">🔍 Global Search (Cmd+K)</a>
  ${SUBDOMAINS.map(s=>`<a href="${s.url}">${s.label}</a>`).join('')}
  <a href="#" onclick="openFavDrawer();return false;" style="color:#f472b6;font-weight:700;">❤️ My Saved Items (<span class="fav-count-badge">0</span>)</a>
  <a href="#" onclick="toggleLanguage();return false;">🌐 Switch Language (HI/EN)</a>
  <a href="#" onclick="triggerAppInstall();return false;" style="color:#a855f7;font-weight:700;">📱 Install TheBhom App</a>
</nav>
<div class="free-band">🎉 TheBhom.in पर सभी Content 100% FREE है — बिना किसी plan या credit card के Download करें!</div>
<div class="sub-nav" style="padding:0 2rem;">${subLinks}</div>
`;
}

// ===== RENDER FOOTER =====
function renderFooter(){
  return `
<div class="div"></div>
<footer class="footer">
  <div class="footer-inner">
    <div class="footer-grid">
      <div class="f-brand">
        <a href="index.html" class="logo">
          <div class="logo-box">TB</div>
          <span class="logo-txt">The<span>Bhom</span>.in</span>
        </a>
        <p>India का #1 Free Digital Content Platform। HD/4K Wallpapers, E-Books, Magazines, Templates, Anniversary Cards और Video Downloader — सब कुछ बिल्कुल Free!</p>
        <div style="margin:1rem 0;">
          <button class="pwa-btn" onclick="triggerAppInstall()">📲 Install Android App (PWA)</button>
        </div>
        <div class="f-social">
          <a class="f-soc" href="#" title="Instagram">📸</a>
          <a class="f-soc" href="#" title="Facebook">📘</a>
          <a class="f-soc" href="#" title="WhatsApp">💬</a>
          <a class="f-soc" href="#" title="YouTube">▶️</a>
          <a class="f-soc" href="#" title="Telegram">✈️</a>
        </div>
      </div>
      <div class="f-col">
        <h5>Content & Tools</h5>
        <ul>
          <li><a href="downloader/">⚡ Video Downloader</a></li>
          <li><a href="wallpapers.html">🖼️ 4K Wallpapers</a></li>
          <li><a href="ebooks.html">📚 E-Books</a></li>
          <li><a href="magazines.html">📰 Magazines</a></li>
          <li><a href="templates.html">🎨 Templates</a></li>
          <li><a href="cards.html">💌 Anniversary Cards</a></li>
        </ul>
      </div>
      <div class="f-col">
        <h5>Subdomains</h5>
        <ul>
          <li><a href="downloader/">downloader.thebhom.in</a></li>
          <li><a href="wallpapers.html">wallpapers.thebhom.in</a></li>
          <li><a href="ebooks.html">ebooks.thebhom.in</a></li>
          <li><a href="magazines.html">magazines.thebhom.in</a></li>
          <li><a href="templates.html">templates.thebhom.in</a></li>
          <li><a href="cards.html">cards.thebhom.in</a></li>
        </ul>
      </div>
      <div class="f-col">
        <h5>Legal & Info</h5>
        <ul>
          <li><a href="about.html">About TheBhom</a></li>
          <li><a href="contact.html">Contact Us</a></li>
          <li><a href="privacy-policy.html">Privacy Policy</a></li>
          <li><a href="disclaimer.html">DMCA & Disclaimer</a></li>
          <li><a href="terms.html">Terms & Conditions</a></li>
          <li><a href="sitemap.xml">Sitemap</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 TheBhom.in — Made with ❤️ in India 🇮🇳 | All Content Free</span>
      <span>Domain: thebhom.in | Google AdSense & Play Ready</span>
    </div>
  </div>
</footer>
<div class="toast-box" id="toastBox"></div>
<button class="b2t" id="b2t" onclick="window.scrollTo({top:0,behavior:'smooth'})">↑</button>
`;
}

// ===== PWA PROMPT & SERVICE WORKER =====
let deferredPwaPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPwaPrompt = e;
  const btn = document.getElementById('pwaInstallBtn');
  if (btn) btn.style.display = 'inline-flex';
});

async function triggerAppInstall() {
  if (deferredPwaPrompt) {
    deferredPwaPrompt.prompt();
    const { outcome } = await deferredPwaPrompt.userChoice;
    if (outcome === 'accepted') {
      showToast('🎉 TheBhom App Install हो रहा है!', 'ok');
    }
    deferredPwaPrompt = null;
    const btn = document.getElementById('pwaInstallBtn');
    if (btn) btn.style.display = 'none';
  } else {
    showToast('💡 Chrome Browser Menu (⋮) में जाकर "Add to Home screen" / "Install app" पर टैप करें।', 'ok');
  }
}
window.triggerAppInstall = triggerAppInstall;
window.promptPwaInstall = triggerAppInstall;

// Register Service Worker with cache invalidation check
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('TheBhom SW registered with scope:', reg.scope);
      if (typeof reg.update === 'function') reg.update();
    }).catch(err => {
      console.log('TheBhom SW registration failed:', err);
    });

    // Automatically bust old caches if SW version updated
    if (!sessionStorage.getItem('thebhom_sw_v6')) {
      sessionStorage.setItem('thebhom_sw_v6', '1');
      if ('caches' in window) {
        caches.keys().then(keys => {
          keys.forEach(k => {
            if (k !== 'thebhom-v2026-v6') {
              caches.delete(k);
            }
          });
        });
      }
    }
  });
}

// Ensure Head PWA meta tags
(function ensurePwaMeta(){
  if(!document.querySelector('link[rel="manifest"]')){
    const m = document.createElement('link');
    m.rel = 'manifest';
    m.href = 'manifest.json';
    document.head.appendChild(m);
  }
  if(!document.querySelector('meta[name="theme-color"]')){
    const tc = document.createElement('meta');
    tc.name = 'theme-color';
    tc.content = '#7c3aed';
    document.head.appendChild(tc);
  }
  if(!document.querySelector('link[rel="apple-touch-icon"]')){
    const ti = document.createElement('link');
    ti.rel = 'apple-touch-icon';
    ti.href = 'icon-192.png';
    document.head.appendChild(ti);
  }
})();

// ===== UNIVERSAL FAVORITES SYSTEM =====
window.getFavorites = function() {
  try { return JSON.parse(localStorage.getItem('thebhom_favs') || '[]'); }
  catch(e) { return []; }
};

function isFavorite(id) {
  return window.getFavorites().some(f => f.id === id);
}
window.isFavorite = isFavorite;

function toggleFavorite(item, e) {
  if (e) {
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
    if (typeof e.preventDefault === 'function') e.preventDefault();
  }
  let favs = window.getFavorites();
  const exists = favs.some(f => f.id === item.id);
  if (exists) {
    favs = favs.filter(f => f.id !== item.id);
    showToast(`💔 "${item.title}" saved list से हटा दिया गया`, 'info');
  } else {
    const pageUrl = item.url || (item.id.startsWith('w')?'wallpapers.html':item.id.startsWith('b')?'ebooks.html':item.id.startsWith('m')?'magazines.html':item.id.startsWith('t')?'templates.html':'cards.html') + '#' + item.id;
    favs.unshift({
      id: item.id,
      title: item.title,
      tag: item.tag || item.sub || item.category || 'General',
      emoji: item.emoji || item.preview || '⭐',
      category: item.category || item.type || (item.id.startsWith('w')?'Wallpapers':item.id.startsWith('b')?'E-Books':item.id.startsWith('m')?'Magazines':item.id.startsWith('t')?'Templates':'Cards'),
      url: pageUrl
    });
    showToast(`❤️ "${item.title}" Saved Items में जुड़ गया!`, 'ok');
  }
  localStorage.setItem('thebhom_favs', JSON.stringify(favs));
  window.updateFavBadges();

  // If e was a button element, toggle its active class
  if (e && e.classList) {
    e.classList.toggle('active', !exists);
  }

  // Update heart buttons and pin buttons on current page
  document.querySelectorAll(`.fav-btn-${item.id}`).forEach(b => {
    b.classList.toggle('active', !exists);
  });
  document.querySelectorAll(`.pin-save-btn[data-id="${item.id}"]`).forEach(b => {
    b.classList.toggle('saved', !exists);
    b.innerHTML = !exists ? '✅ Saved' : '📌 Save';
  });
  if (document.getElementById('favDrawer')?.classList.contains('open')) {
    window.renderFavDrawerBody();
  }
}
window.toggleFavorite = toggleFavorite;

window.updateFavBadges = function() {
  const count = window.getFavorites().length;
  document.querySelectorAll('.fav-count-badge').forEach(b => {
    b.textContent = count;
  });
};

window.openFavDrawer = function() {
  window.renderFavDrawer();
  const d = document.getElementById('favDrawer');
  const o = document.getElementById('favOverlay');
  if (d && o) {
    window.renderFavDrawerBody();
    d.classList.add('open');
    o.classList.add('open');
  }
};

window.closeFavDrawer = function() {
  const d = document.getElementById('favDrawer');
  const o = document.getElementById('favOverlay');
  if (d) d.classList.remove('open');
  if (o) o.classList.remove('open');
};

window.renderFavDrawer = function() {
  if (document.getElementById('favDrawer')) return;
  const mount = document.createElement('div');
  mount.innerHTML = `
    <div class="fav-overlay" id="favOverlay" onclick="closeFavDrawer()"></div>
    <div class="fav-drawer" id="favDrawer">
      <div class="fav-header">
        <h3>❤️ My Saved Items (<span class="fav-count-badge">0</span>)</h3>
        <button class="fav-close" onclick="closeFavDrawer()">✕</button>
      </div>
      <div class="fav-body" id="favBody"></div>
    </div>
  `;
  document.body.appendChild(mount);
};

window.renderFavDrawerBody = function() {
  const body = document.getElementById('favBody');
  if (!body) return;
  const favs = window.getFavorites();
  if (favs.length === 0) {
    body.innerHTML = `
      <div class="fav-empty">
        <div class="fav-empty-icon">📂</div>
        <h4>कोई Saved Item नहीं है</h4>
        <p style="font-size:0.83rem;margin-top:0.5rem;">किसी भी Wallpaper, E-Book, Magazine या Card पर ❤️ दबाकर यहाँ सेव करें।</p>
      </div>
    `;
    return;
  }
  body.innerHTML = favs.map(item => `
    <div class="fav-card">
      <div class="fav-thumb" style="background:#1e1e38;">${item.emoji}</div>
      <div class="fav-info">
        <div class="fav-name" title="${item.title}">${item.title}</div>
        <div class="fav-sub">${item.category} • ${item.tag}</div>
      </div>
      <div class="fav-act">
        <a href="${item.url}" class="fav-act-btn" target="_self">Open ↗</a>
        <button class="fav-rm-btn" onclick="toggleFavorite({id:'${item.id}',title:'${item.title.replace(/'/g,"\\'")}'})" title="Remove">✕</button>
      </div>
    </div>
  `).join('');
};

// ===== INIT SHARED =====
function initShared(){
  // Mount favorites drawer & update badges
  window.renderFavDrawer();
  window.updateFavBadges();

  // Floating saved button
  if (!document.getElementById('favFloatBtn')) {
    const fb = document.createElement('button');
    fb.id = 'favFloatBtn';
    fb.className = 'fav-btn-float';
    fb.innerHTML = `❤️ Saved <span class="fav-badge fav-count-badge">0</span>`;
    fb.onclick = window.openFavDrawer;
    document.body.appendChild(fb);
    window.updateFavBadges();
  }

  // Floating Spotlight shortcut button on mobile/desktop
  if (!document.getElementById('spotlightFloatBtn')) {
    const sb = document.createElement('button');
    sb.id = 'spotlightFloatBtn';
    sb.style.cssText = 'position:fixed;bottom:20px;right:90px;z-index:9990;background:#111128;border:1px solid rgba(124,58,237,0.5);color:#c084fc;font-weight:700;border-radius:50px;padding:8px 16px;cursor:pointer;font-size:.78rem;box-shadow:0 8px 24px rgba(0,0,0,0.6);display:flex;align-items:center;gap:6px;';
    sb.innerHTML = `🔍 Search <kbd style="background:rgba(0,0,0,0.4);padding:1px 5px;border-radius:4px;font-size:.65rem;border:1px solid rgba(255,255,255,0.2);">⌘K</kbd>`;
    sb.onclick = window.openSpotlight;
    document.body.appendChild(sb);
  }

  // Init features
  initSpotlight();
  initActivityTicker();
  initQuoteHighlighter();
  applyLanguage(currentLang);

  // Check if install button should show
  if (deferredPwaPrompt) {
    const btn = document.getElementById('pwaInstallBtn');
    if (btn) btn.style.display = 'inline-flex';
  }

  // Scroll effects
  const sp=document.getElementById('sp');
  const b2t=document.getElementById('b2t');
  window.addEventListener('scroll',()=>{
    const pct=(window.scrollY/(document.documentElement.scrollHeight-window.innerHeight))*100;
    if(sp)sp.style.width=pct+'%';
    if(b2t)b2t.classList.toggle('show',window.scrollY>350);
  });

  // Hamburger
  const hamBtn=document.getElementById('hamBtn');
  const mobNav=document.getElementById('mobNav');
  hamBtn?.addEventListener('click',()=>{
    mobNav.classList.toggle('open');
    const spans=hamBtn.querySelectorAll('span');
    if(mobNav.classList.contains('open')){
      spans[0].style.transform='rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity='0';
      spans[2].style.transform='rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s=>{s.style.transform='';s.style.opacity='';});
    }
  });

  // Intersection observer for cards
  if (typeof IntersectionObserver !== 'undefined') {
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.style.opacity='1';
          e.target.style.transform='translateY(0)';
        }
      });
    },{threshold:0.05});
    document.querySelectorAll('.c-card,.hub-card').forEach(el=>{
      el.style.opacity='0';
      el.style.transform='translateY(20px)';
      el.style.transition='opacity .5s ease, transform .5s ease';
      io.observe(el);
    });
  }
}

// ===== TOAST =====
function showToast(msg, type='ok'){
  let box=document.getElementById('toastBox');
  if(!box){
    box = document.createElement('div');
    box.id = 'toastBox';
    box.className = 'toast-box';
    document.body.appendChild(box);
  }
  const t=document.createElement('div');
  t.className=`toast ${type}`;
  t.innerHTML=msg;
  box.appendChild(t);
  requestAnimationFrame(()=>setTimeout(()=>t.classList.add('in'),30));
  setTimeout(()=>{t.classList.remove('in');setTimeout(()=>t.remove(),400);},3500);
}

// ===== CONTENT CARD BUILDER =====
function buildCard(item, downloadFn){
  const [c1,c2]=item.colors||['#0a0a1a','#1a0a2a'];
  const qBadge=window.THEBHOM.getQualityBadge(item.quality);
  const newBadge=item.isNew?'<span class="newbadge">NEW</span>':'';
  const dlCount=window.THEBHOM.formatNum(item.downloads);
  const isFav = window.isFavorite(item.id);
  const safeItemStr = JSON.stringify({id:item.id,title:item.title,emoji:item.emoji,tag:item.tag||item.sub||''}).replace(/"/g,'&quot;');

  return `
<div class="c-card" id="card-${item.id}">
  <div class="c-thumb" style="background:linear-gradient(135deg,${c1},${c2})">
    <button class="fav-heart-btn fav-btn-${item.id} ${isFav?'active':''}" onclick="toggleFavorite(${safeItemStr}, event)" title="Save to Favorites">❤️</button>
    <span class="big-emoji">${item.emoji}</span>
    <span class="sub-label">${item.sub||item.tag}</span>
    ${qBadge}${newBadge}
    <div class="c-overlay">
      <button class="dl-btn" onclick="${downloadFn}('${item.id}')">⬇️ Free Download</button>
    </div>
  </div>
  <div class="c-info">
    <div class="c-title" title="${item.title}">${item.title}</div>
    <div class="c-meta">
      <span>${item.tag}</span>
      <span>⬇️ ${dlCount}</span>
    </div>
  </div>
</div>`;
}

// ===== BULLETPROOF FILE DOWNLOADER =====
function triggerBrowserDownload(blobOrUrl, filename) {
  const a = document.createElement('a');
  a.style.display = 'none';
  let url = '';
  let isBlob = false;
  
  if (typeof blobOrUrl === 'string') {
    url = blobOrUrl;
  } else if (blobOrUrl instanceof Blob) {
    url = URL.createObjectURL(blobOrUrl);
    isBlob = true;
  }
  
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  
  const evt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  a.dispatchEvent(evt);
  
  setTimeout(() => {
    if (a.parentNode) a.parentNode.removeChild(a);
    if (isBlob) {
      URL.revokeObjectURL(url);
    }
  }, 4000);
}

// ===== DOWNLOAD HANDLER =====
function handleDownload(id, type){
  showToast(`✅ "${id}" download हो रही है...`,'ok');
  // Simulate download tracking
  setTimeout(()=>showToast(`🎉 Download complete! Share करें TheBhom.in`,'ok'),2000);
}

// ===== SEARCH & FILTER ENGINE =====
function createContentPage(config){
  const {data, pageId, title, subtitle, emoji, filterTags, downloadFn='handleDownload'} = config;
  let filtered=[...data];
  let activeTag='all';
  let sortBy='popular';
  let searchQ='';
  let page=1;
  const PER_PAGE=20;

  function getFiltered(){
    let d=[...data];
    if(activeTag!=='all')d=d.filter(i=>i.tag===activeTag||i.sub===activeTag);
    if(searchQ)d=d.filter(i=>i.title.toLowerCase().includes(searchQ.toLowerCase())||i.tag.toLowerCase().includes(searchQ.toLowerCase()));
    if(sortBy==='newest')d=[...d.filter(i=>i.isNew),...d.filter(i=>!i.isNew)];
    else if(sortBy==='downloads')d.sort((a,b)=>b.downloads-a.downloads);
    else if(sortBy==='rating')d.sort((a,b)=>b.rating-a.rating);
    return d;
  }

  function render(){
    filtered=getFiltered();
    const slice=filtered.slice(0,(page)*PER_PAGE);
    const grid=document.getElementById('mainGrid');
    if(!grid)return;
    grid.innerHTML=slice.map(item=>buildCard(item,downloadFn)).join('');
    document.getElementById('resCount').textContent=`${filtered.length} items मिले`;
    const lmBtn=document.getElementById('lmBtn');
    if(lmBtn)lmBtn.style.display=filtered.length>slice.length?'inline-flex':'none';
    initShared();
  }

  window.setFilter=function(tag,btn){
    activeTag=tag;
    page=1;
    document.querySelectorAll('.f-btn').forEach(b=>b.classList.remove('on'));
    btn.classList.add('on');
    render();
  };
  window.setSort=function(val){sortBy=val;page=1;render();};
  window.loadMore=function(){page++;render();};
  window.doSearch=function(){
    searchQ=document.getElementById('srchInput')?.value.trim()||'';
    page=1;
    render();
  };

  // Build filter buttons
  const filterHTML=['all',...filterTags].map((t,i)=>
    `<button class="f-btn${i===0?' on':''}" onclick="setFilter('${t}',this)">${t==='all'?'🔥 All':t}</button>`
  ).join('');

  return {filterHTML, render};
}

// ============================================================
// GLOBAL SPOTLIGHT OMNISEARCH (Cmd+K / Ctrl+K)
// ============================================================
let spotlightActiveIndex = 0;
let spotlightActiveCategory = 'all';

function getAllContentItems() {
  const items = [];
  if (window.THEBHOM) {
    (THEBHOM.WALLPAPERS || []).forEach(w => items.push({ id: w.id, title: w.title, cat: 'wallpapers', tag: w.tag || '4K Wallpaper', emoji: '🖼️', url: 'wallpapers.html#' + w.id }));
    (THEBHOM.EBOOKS || []).forEach(b => items.push({ id: b.id, title: b.title, cat: 'ebooks', tag: b.category || 'E-Book', emoji: b.emoji || '📚', url: 'ebooks.html#' + b.id }));
    (THEBHOM.MAGAZINES || []).forEach(m => items.push({ id: m.id, title: m.title, cat: 'magazines', tag: m.category || 'Magazine', emoji: m.emoji || '📰', url: 'magazines.html#' + m.id }));
    (THEBHOM.TEMPLATES || []).forEach(t => items.push({ id: t.id, title: t.title, cat: 'templates', tag: t.cat || 'Template', emoji: '🎨', url: 'templates.html#' + t.id }));
    (THEBHOM.CARDS || []).forEach(c => items.push({ id: c.id, title: c.title, cat: 'cards', tag: c.cat || 'Greeting Card', emoji: c.emoji || '💌', url: 'cards.html#' + c.id }));
  }
  // Local fallbacks if available
  if (items.length === 0) {
    if (typeof ALL_WALLS !== 'undefined') {
      ALL_WALLS.forEach(w => items.push({ id: w.id, title: w.title, cat: 'wallpapers', tag: w.cat || 'Wallpaper', emoji: '🖼️', url: 'wallpapers.html#' + w.id }));
    }
    if (typeof BOOKS !== 'undefined') {
      BOOKS.forEach(b => items.push({ id: b.id, title: b.title, cat: 'ebooks', tag: b.cat || 'E-Book', emoji: b.emoji || '📚', url: 'ebooks.html#' + b.id }));
    }
    if (typeof MAGS !== 'undefined') {
      MAGS.forEach(m => items.push({ id: m.id, title: m.title, cat: 'magazines', tag: m.cat || 'Magazine', emoji: m.emoji || '📰', url: 'magazines.html#' + m.id }));
    }
    if (typeof CARDS_DB !== 'undefined') {
      CARDS_DB.forEach(c => items.push({ id: c.id, title: c.title, cat: 'cards', tag: c.cat || 'Card', emoji: c.emoji || '💌', url: 'cards.html#' + c.id }));
    }
  }
  return items;
}

function openSpotlightItem(url, id, cat) {
  closeSpotlight();
  const curPage = window.location.pathname.split('/').pop() || 'index.html';
  const targetPage = url.split('#')[0];
  if (curPage === targetPage) {
    if (cat === 'wallpapers' && typeof openPreview === 'function') openPreview(id);
    else if (cat === 'ebooks' && typeof openReader === 'function') openReader(id);
    else if (cat === 'magazines' && typeof openMagReader === 'function') openMagReader(id);
    else if (cat === 'cards' && typeof openCardZoom === 'function') openCardZoom(id);
    else if (cat === 'templates' && typeof openZoom === 'function') openZoom(id);
    else if (cat === 'templates' && typeof openTplModal === 'function') openTplModal(id);
    window.location.hash = '#' + id;
  } else {
    window.location.href = url;
  }
}

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  if (!hash) return;
  if (typeof openAmazonBookModal === 'function' && hash.startsWith('b')) {
    openAmazonBookModal(hash);
  } else if (typeof openPreview === 'function' && (hash.startsWith('w') || hash.startsWith('lw') || hash.startsWith('u'))) {
    openPreview(hash);
  } else if (typeof openMagReader === 'function' && hash.startsWith('m')) {
    openMagReader(hash);
  } else if (typeof openCardZoom === 'function' && hash.startsWith('c')) {
    openCardZoom(hash);
  } else if (typeof openZoom === 'function' && hash.startsWith('t')) {
    openZoom(hash);
  }
});

function initSpotlight() {
  // Global key listener active
}

function openSpotlight() {
  let overlay = document.getElementById('spotlightOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'spotlight-overlay';
    overlay.id = 'spotlightOverlay';
    overlay.innerHTML = `
      <div class="spotlight-modal" onclick="event.stopPropagation()">
        <div class="spotlight-top">
          <span class="spotlight-icon">🔍</span>
          <input type="text" id="spotlightInput" class="spotlight-input" placeholder="Search 1,750+ Wallpapers, E-Books, Magazines, Templates, Cards..." autocomplete="off" />
          <span class="spotlight-esc" onclick="closeSpotlight()">ESC</span>
        </div>
        <div class="spotlight-filter-bar">
          <button class="spotlight-chip active" onclick="setSpotlightCat('all', this)">🔥 All Items</button>
          <button class="spotlight-chip" onclick="setSpotlightCat('wallpapers', this)">🖼️ Wallpapers</button>
          <button class="spotlight-chip" onclick="setSpotlightCat('ebooks', this)">📚 E-Books</button>
          <button class="spotlight-chip" onclick="setSpotlightCat('magazines', this)">📰 Magazines</button>
          <button class="spotlight-chip" onclick="setSpotlightCat('templates', this)">🎨 Templates</button>
          <button class="spotlight-chip" onclick="setSpotlightCat('cards', this)">💌 Cards</button>
        </div>
        <div class="spotlight-results" id="spotlightResults"></div>
        <div class="spotlight-footer">
          <div class="spotlight-kbd-hints">
            <span>↑↓ Navigate</span>
            <span>↵ Open</span>
            <span>Esc Close</span>
          </div>
          <span style="color:#a855f7;font-weight:700;">TheBhom Omnisearch</span>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', closeSpotlight);

    const input = document.getElementById('spotlightInput');
    input.addEventListener('input', () => {
      spotlightActiveIndex = 0;
      renderSpotlightResults();
    });
    input.addEventListener('keydown', (e) => {
      const resultsEl = document.getElementById('spotlightResults');
      const items = resultsEl.querySelectorAll('.spotlight-item');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (items.length) {
          spotlightActiveIndex = (spotlightActiveIndex + 1) % items.length;
          updateSpotlightFocus(items);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (items.length) {
          spotlightActiveIndex = (spotlightActiveIndex - 1 + items.length) % items.length;
          updateSpotlightFocus(items);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (items[spotlightActiveIndex]) items[spotlightActiveIndex].click();
      } else if (e.key === 'Escape') {
        closeSpotlight();
      }
    });
  }

  overlay.classList.add('open');
  const input = document.getElementById('spotlightInput');
  input.value = '';
  spotlightActiveIndex = 0;
  renderSpotlightResults();
  setTimeout(() => input.focus(), 60);
}

function closeSpotlight() {
  const overlay = document.getElementById('spotlightOverlay');
  if (overlay) overlay.classList.remove('open');
}

function setSpotlightCat(cat, btn) {
  spotlightActiveCategory = cat;
  document.querySelectorAll('.spotlight-chip').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');
  spotlightActiveIndex = 0;
  renderSpotlightResults();
}

function renderSpotlightResults() {
  const input = document.getElementById('spotlightInput');
  const query = (input?.value || '').trim().toLowerCase();
  const resultsEl = document.getElementById('spotlightResults');
  if (!resultsEl) return;

  let all = getAllContentItems();
  if (spotlightActiveCategory !== 'all') {
    all = all.filter(item => item.cat === spotlightActiveCategory);
  }
  if (query) {
    all = all.filter(item => item.title.toLowerCase().includes(query) || (item.tag && item.tag.toLowerCase().includes(query)));
  }

  const topItems = all.slice(0, 16);
  if (topItems.length === 0) {
    resultsEl.innerHTML = `<div class="spotlight-empty">🔍 "${query}" के लिए कोई आइटम नहीं मिला। कृपया अलग नाम खोजें।</div>`;
    return;
  }

  resultsEl.innerHTML = topItems.map((item, idx) => `
    <a href="${item.url}" class="spotlight-item${idx === spotlightActiveIndex ? ' focused' : ''}" onclick="openSpotlightItem('${item.url}','${item.id}','${item.cat}'); return false;">
      <span class="spotlight-item-emoji">${item.emoji}</span>
      <span class="spotlight-item-title">${item.title}</span>
      <span class="spotlight-item-badge">${item.cat}</span>
      <span class="spotlight-item-arrow">➔</span>
    </a>
  `).join('');
}

function updateSpotlightFocus(items) {
  items.forEach((item, idx) => {
    item.classList.toggle('focused', idx === spotlightActiveIndex);
    if (idx === spotlightActiveIndex) item.scrollIntoView({ block: 'nearest' });
  });
}

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    openSpotlight();
  }
  if (e.key === 'Escape') closeSpotlight();
});

// ============================================================
// SCAN-TO-MOBILE QR CODE GENERATOR
// ============================================================
function openQRModal(url, title) {
  let overlay = document.getElementById('qrOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'qr-overlay';
    overlay.id = 'qrOverlay';
    document.body.appendChild(overlay);
  }
  const fullUrl = url.startsWith('http') ? url : (window.location.origin + '/' + url);
  const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(fullUrl)}`;

  overlay.innerHTML = `
    <div class="qr-modal" onclick="event.stopPropagation()">
      <button class="qr-close" onclick="closeQRModal()">✕</button>
      <div style="font-size:2.2rem;margin-bottom:.3rem;">📱</div>
      <div class="qr-title">Scan on Mobile</div>
      <div class="qr-desc">${title || 'Open on your smartphone instantly'}</div>
      <div class="qr-box">
        <img src="${qrImgUrl}" alt="QR Code" width="190" height="190" style="display:block;border-radius:8px;" />
      </div>
      <div style="font-size:0.75rem;color:#94a3b8;line-height:1.5;">
        अपने फोन के कैमरा या Google Lens से स्कैन करें और 1-टैप में मोबाइल पर डाउनलोड करें!
      </div>
    </div>
  `;
  overlay.onclick = closeQRModal;
  overlay.classList.add('open');
}

function closeQRModal() {
  const overlay = document.getElementById('qrOverlay');
  if (overlay) overlay.classList.remove('open');
}

// ============================================================
// SOCIAL PROOF LIVE ACTIVITY TICKER
// ============================================================
const TICKER_ACTIVITIES = [
  { city: 'Mumbai', action: '4K Cyberpunk Tokyo Wallpaper', type: 'downloaded 📱' },
  { city: 'Delhi', action: 'Autonomous AI Agents 2026', type: 'started reading 📚' },
  { city: 'Bengaluru', action: 'Instagram Carousel Masterpack', type: 'customized 🎨' },
  { city: 'Jaipur', action: 'Royal Gold Anniversary Card', type: 'personalized 💌' },
  { city: 'Pune', action: 'Solopreneur 2026 Blueprint', type: 'downloaded PDF 📚' },
  { city: 'Hyderabad', action: '4K Cosmic Nebula Wallpaper', type: 'saved to Favorites ❤️' },
  { city: 'Ahmedabad', action: 'TechVision AI Magazine', type: 'read full issue 📰' },
  { city: 'Kolkata', action: 'Minimalist Business Card Pack', type: 'exported 🎨' },
  { city: 'Chandigarh', action: 'Heartfelt Rose Foldable Card', type: 'shared on WhatsApp 💬' }
];

function initActivityTicker() {
  if (document.getElementById('activityTicker')) return;
  const ticker = document.createElement('div');
  ticker.className = 'activity-ticker';
  ticker.id = 'activityTicker';
  ticker.innerHTML = `
    <div class="ticker-avatar">⚡</div>
    <div class="ticker-content">
      <div class="ticker-title" id="tickerTitle">Someone from Mumbai</div>
      <div class="ticker-meta" id="tickerMeta">Downloaded 4K Wallpaper • Just now</div>
    </div>
    <button class="ticker-close" onclick="this.parentElement.classList.remove('show')">✕</button>
  `;
  document.body.appendChild(ticker);

  let idx = 0;
  function showNextTicker() {
    const act = TICKER_ACTIVITIES[idx % TICKER_ACTIVITIES.length];
    idx++;
    const tTitle = document.getElementById('tickerTitle');
    const tMeta = document.getElementById('tickerMeta');
    if (tTitle && tMeta) {
      tTitle.textContent = `Someone from ${act.city}`;
      tMeta.textContent = `${act.type} "${act.action}" • Just now`;
    }
    ticker.classList.add('show');
    setTimeout(() => {
      ticker.classList.remove('show');
    }, 5500);
  }

  setTimeout(showNextTicker, 6000);
  setInterval(showNextTicker, 30000);
}

// ============================================================
// SMART QUOTE HIGHLIGHTER TOOLTIP
// ============================================================
function initQuoteHighlighter() {
  let tooltip = document.getElementById('quoteTooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.className = 'quote-tooltip';
    tooltip.id = 'quoteTooltip';
    tooltip.innerHTML = `
      <button class="quote-tooltip-btn" onclick="copySelectedQuote()">📋 Copy Quote</button>
      <button class="quote-tooltip-btn" onclick="shareSelectedQuote()">💬 WhatsApp</button>
    `;
    document.body.appendChild(tooltip);
  }

  document.addEventListener('selectionchange', () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      tooltip.style.display = 'none';
      return;
    }
    const text = sel.toString().trim();
    if (text.length < 15) {
      tooltip.style.display = 'none';
      return;
    }
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    tooltip.style.display = 'inline-flex';
    tooltip.style.top = `${window.scrollY + rect.top - 42}px`;
    tooltip.style.left = `${window.scrollX + rect.left + (rect.width / 2) - 80}px`;
  });
}

function copySelectedQuote() {
  const sel = window.getSelection();
  if (!sel) return;
  const text = sel.toString().trim();
  const quoteWithCitation = `"${text}"\n\n— Via TheBhom.in (Free Digital Library)\nhttps://www.thebhom.in`;
  navigator.clipboard.writeText(quoteWithCitation).then(() => {
    showToast('📋 Quote source ke sath copy ho gaya!', 'ok');
    const t = document.getElementById('quoteTooltip');
    if (t) t.style.display = 'none';
  });
}

function shareSelectedQuote() {
  const sel = window.getSelection();
  if (!sel) return;
  const text = sel.toString().trim();
  const quoteWithCitation = `"${text}"\n\n— Via TheBhom.in (Free Digital Library)\nhttps://www.thebhom.in`;
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(quoteWithCitation)}`);
  const t = document.getElementById('quoteTooltip');
  if (t) t.style.display = 'none';
}

// ============================================================
// ROMANTIC BGM WEB AUDIO SYNTHESIZER (CARDS)
// ============================================================
let bgmAudioCtx = null;
let bgmInterval = null;
let isBgmPlaying = false;

function toggleRomanticBGM(btn) {
  if (isBgmPlaying) {
    stopRomanticBGM(btn);
  } else {
    playRomanticBGM(btn);
  }
}

function playRomanticBGM(btn) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      showToast('⚠️ Web Audio not supported in this browser', 'info');
      return;
    }
    if (!bgmAudioCtx) bgmAudioCtx = new AudioCtx();
    if (bgmAudioCtx.state === 'suspended') bgmAudioCtx.resume();

    isBgmPlaying = true;
    if (btn) {
      btn.classList.add('playing');
      btn.innerHTML = '<span class="bgm-icon">🎵</span> Music Playing (Stop)';
    }
    showToast('🎵 Soft Romantic BGM चालू हो गया है...', 'ok');

    const notes = [
      [261.63, 329.63, 392.00, 493.88],
      [220.00, 261.63, 329.63, 440.00],
      [174.61, 220.00, 261.63, 349.23],
      [196.00, 261.63, 293.66, 392.00]
    ];

    let chordIdx = 0;
    function playChordTone() {
      if (!isBgmPlaying || !bgmAudioCtx) return;
      const currentChord = notes[chordIdx % notes.length];
      const now = bgmAudioCtx.currentTime;

      currentChord.forEach((freq, i) => {
        const osc = bgmAudioCtx.createOscillator();
        const gain = bgmAudioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.35);

        gain.gain.setValueAtTime(0.001, now + i * 0.35);
        gain.gain.exponentialRampToValueAtTime(0.05, now + i * 0.35 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.35 + 1.8);

        osc.connect(gain);
        gain.connect(bgmAudioCtx.destination);
        osc.start(now + i * 0.35);
        osc.stop(now + i * 0.35 + 2.0);
      });

      chordIdx++;
    }

    playChordTone();
    bgmInterval = setInterval(playChordTone, 3200);
  } catch (e) {
    console.warn('Web Audio BGM error:', e);
  }
}

function stopRomanticBGM(btn) {
  isBgmPlaying = false;
  if (bgmInterval) clearInterval(bgmInterval);
  if (btn) {
    btn.classList.remove('playing');
    btn.innerHTML = '<span class="bgm-icon">🎵</span> Romantic Music Play करें';
  }
  showToast('⏹️ Romantic Music Stopped', 'info');
}

// ============================================================
// MULTI-LANGUAGE PREFERENCE (EN / HI)
// ============================================================
let currentLang = localStorage.getItem('thebhom_lang') || 'hi';

const I18N_DICT = {
  hi: {
    langBtn: '🇮🇳 हिन्दी',
    freeBand: '🎉 TheBhom.in पर सभी Content 100% FREE है — बिना किसी plan या credit card के Download करें!',
    savedBtn: '❤️ सेव्ड',
    searchBtn: '🔍 खोजें',
    searchPlaceholder: '1,750+ Wallpapers, E-Books, Magazines, Templates, Cards खोजें...',
    loadMore: 'और लोड करें'
  },
  en: {
    langBtn: '🌐 English',
    freeBand: '🎉 All Content on TheBhom.in is 100% FREE — Download without any plan or credit card!',
    savedBtn: '❤️ Saved',
    searchBtn: '🔍 Search',
    searchPlaceholder: 'Search 1,750+ Wallpapers, E-Books, Magazines, Templates, Cards...',
    loadMore: 'Load More'
  }
};

function toggleLanguage() {
  currentLang = currentLang === 'hi' ? 'en' : 'hi';
  localStorage.setItem('thebhom_lang', currentLang);
  applyLanguage(currentLang);
  showToast(`🌐 Language switched to ${currentLang === 'hi' ? 'हिन्दी (Hindi)' : 'English'}`, 'ok');
}

function applyLanguage(lang) {
  const dict = I18N_DICT[lang] || I18N_DICT.hi;
  const btn = document.getElementById('langToggleBtn');
  if (btn) btn.innerHTML = dict.langBtn;

  const freeBands = document.querySelectorAll('.free-band, .free-banner');
  freeBands.forEach(b => { b.textContent = dict.freeBand; });

  const spotlightInp = document.getElementById('spotlightInput');
  if (spotlightInp) spotlightInp.placeholder = dict.searchPlaceholder;
}

// Universal WhatsApp Status & Story Sharing
function shareToWhatsAppStatus(title, url) {
  const fullUrl = url.startsWith('http') ? url : (window.location.origin + '/' + url);
  const text = `✨ Check out "${title}" on TheBhom.in — 100% Free Downloads without watermark!\n👉 ${fullUrl}`;
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`);
  showToast('💬 WhatsApp Status share window open ho gaya!', 'ok');
}

// ============================================================
// AMAZON KINDLE STOREFRONT MODAL
// ============================================================
function openAmazonBookModal(bookId) {
  let book = null;
  if (window.THEBHOM && THEBHOM.EBOOKS) {
    book = THEBHOM.EBOOKS.find(b => b.id === bookId);
  }
  if (!book && typeof BOOKS !== 'undefined') {
    book = BOOKS.find(b => b.id === bookId);
  }
  if (!book) {
    book = { id: bookId, title: 'Autonomous AI Agents & Swarms (2026)', author: 'Dr. Aravind Menon', category: 'Technology', emoji: '🤖', downloads: 48200 };
  }

  let overlay = document.getElementById('amzBookOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'amz-modal-overlay';
    overlay.id = 'amzBookOverlay';
    overlay.onclick = (e) => { if (e.target === overlay) closeAmazonBookModal(); };
    document.body.appendChild(overlay);
  }

  const mrp = 499;
  const ratingVal = "4.9";
  const ratingCount = "1,842";
  const pages = "240 Pages";
  const fileSize = "3.8 MB (Print Replica PDF)";
  const isbn = "978-81-965412-" + (Math.floor(Math.random() * 89) + 10);
  const companion1 = (window.THEBHOM?.EBOOKS || [])[1] || { title: 'The Solopreneur 2026 Blueprint', emoji: '🚀' };
  const companion2 = (window.THEBHOM?.EBOOKS || [])[3] || { title: 'The 2026 Attention Monopoly', emoji: '⚡' };

  overlay.innerHTML = `
    <div class="amz-modal" onclick="event.stopPropagation()">
      <button class="amz-close" onclick="closeAmazonBookModal()">✕</button>
      
      <div class="amz-header-bar">
        <div class="amz-breadcrumb">
          <a href="index.html">TheBhom Store</a> <span>›</span>
          <a href="ebooks.html">Kindle eBooks</a> <span>›</span>
          <span>${book.category || book.tag || 'Bestseller'}</span>
        </div>
        <div style="color:#f59e0b;font-weight:700;">🇮🇳 India's #1 Free Reading Hub</div>
      </div>

      <div class="amz-body-layout">
        <!-- LEFT COLUMN: 3D COVER & BUY BOX -->
        <div class="amz-left-col">
          <div class="amz-3d-cover-wrap">
            <div class="amz-3d-cover" style="background:linear-gradient(135deg,#0f172a,#1e1b4b);">
              <span class="amz-look-inside-ribbon">📖 Look Inside</span>
              <div style="font-size:3.5rem;margin-bottom:0.5rem;">${book.emoji || '📚'}</div>
              <div style="font-size:0.95rem;font-weight:900;color:#fff;line-height:1.3;text-shadow:0 2px 8px rgba(0,0,0,0.8);">${book.title}</div>
              <div style="font-size:0.75rem;color:#cbd5e1;margin-top:6px;">By ${book.author || 'TheBhom Editorial'}</div>
              <div style="margin-top:10px;font-size:0.65rem;color:#f59e0b;font-weight:800;letter-spacing:1px;">THEBHOM EXCLUSIVE 2026</div>
            </div>
          </div>

          <div class="amz-buy-box">
            <div class="amz-price-section">
              <div class="amz-mrp-row">M.R.P.: ₹${mrp}.00</div>
              <div class="amz-deal-row">
                <span class="amz-deal-price">₹0.00</span>
                <span class="amz-deal-badge">100% OFF FREE</span>
              </div>
              <div class="amz-save-text">You Save: ₹${mrp}.00 (100% Free Forever)</div>
            </div>

            <div class="amz-ku-badge">
              <span class="amz-ku-logo">kindle unlimited</span>
              <span>Unlimited Free Access • No Card Needed</span>
            </div>

            <button class="amz-btn-buy" onclick="buyBookOneClick('${book.id}', '${book.title.replace(/'/g, "\\'")}')">
              🛒 Buy Now with 1-Click (FREE)
            </button>
            <button class="amz-btn-read" onclick="closeAmazonBookModal(); if(typeof openReader==='function'){ openReader('${book.id}'); } else { window.location.href='ebooks.html?read='+'${book.id}'; }">
              📖 Read Sample / Cloud Reader
            </button>

            <div class="amz-delivery-info">
              ⚡ Instant Digital Download • Read on Phone, iPad, PC & Kindle • Virus-Free Verified
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: DETAILS, SYNOPSIS, BUNDLES & REVIEWS -->
        <div class="amz-right-col">
          <div>
            <div style="font-size:0.75rem;font-weight:800;color:#f59e0b;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">#1 Bestseller in ${book.category || book.tag || 'Digital Tech'} 2026</div>
            <h2 class="amz-book-title">${book.title}</h2>
            <div class="amz-book-subtitle">Complete Unabridged 10-Chapter Edition • Formatted for Peak Reading</div>
            <div class="amz-author-row" style="margin-top:8px;">
              <span>By <a href="#" class="amz-author-name">${book.author || 'Bhom Vrat Rai'}</a> (Author)</span>
              <span class="amz-star-rating">⭐⭐⭐⭐⭐ ${ratingVal}</span>
              <span class="amz-rating-count">(${ratingCount} global ratings)</span>
            </div>
          </div>

          <div class="amz-early-access-banner">
            <span style="font-size:1.2rem;">⚡</span>
            <div><strong>Early Access Beta:</strong> All e-books on TheBhom.in are currently ₹0 (100% Free). Download and claim now to keep in your library forever before premium plans launch!</div>
          </div>

          <!-- TECHNICAL SPECIFICATIONS -->
          <div class="amz-specs-table">
            <div class="amz-spec-box">
              <span class="amz-spec-label">Print Length</span>
              <span class="amz-spec-val">${pages}</span>
            </div>
            <div class="amz-spec-box">
              <span class="amz-spec-label">Language</span>
              <span class="amz-spec-val">English / हिन्दी</span>
            </div>
            <div class="amz-spec-box">
              <span class="amz-spec-label">Publisher</span>
              <span class="amz-spec-val">TheBhom Press</span>
            </div>
            <div class="amz-spec-box">
              <span class="amz-spec-label">File Size</span>
              <span class="amz-spec-val">${fileSize}</span>
            </div>
            <div class="amz-spec-box">
              <span class="amz-spec-label">ISBN-13</span>
              <span class="amz-spec-val">${isbn}</span>
            </div>
          </div>

          <!-- SYNOPSIS -->
          <div>
            <div class="amz-section-heading">📖 Book Description & Synopsis</div>
            <div class="amz-synopsis-box">
              "${book.title}" represents the definitive blueprint for high-impact knowledge in 2026. Packed with actionable frameworks, real-world case studies, and zero fluff, this masterclass edition delivers practical insights designed to transform your understanding and execution within minutes. Read seamlessly across mobile, tablet, or desktop with integrated text-to-speech audio narration.
            </div>
          </div>

          <!-- FREQUENTLY DOWNLOADED TOGETHER BUNDLE -->
          <div class="amz-bundle-card">
            <div class="amz-section-heading" style="font-size:0.95rem;margin:0;">📦 Frequently Downloaded Together (3-Book Bundle)</div>
            <div class="amz-bundle-items">
              <div class="amz-bundle-thumb" title="${book.title}">${book.emoji || '📚'}</div>
              <span class="amz-bundle-plus">+</span>
              <div class="amz-bundle-thumb" title="${companion1.title}">${companion1.emoji || '🚀'}</div>
              <span class="amz-bundle-plus">+</span>
              <div class="amz-bundle-thumb" title="${companion2.title}">${companion2.emoji || '⚡'}</div>
              <div style="flex:1;min-width:180px;">
                <div style="font-size:0.78rem;font-weight:700;color:#fff;">Triple Bestseller Bundle</div>
                <div style="font-size:0.72rem;color:#22c55e;font-weight:800;">Total Price: ₹0.00 (Save ₹1,497)</div>
                <button onclick="buyBookOneClick('${book.id}', '${book.title.replace(/'/g, "\\'")}'); showToast('🎉 Triple Bundle downloaded for ₹0!', 'ok');" style="margin-top:6px;padding:6px 14px;background:#f59e0b;color:#000;border:none;border-radius:50px;font-size:0.75rem;font-weight:800;cursor:pointer;">
                  ⬇️ Download All 3 for FREE
                </button>
              </div>
            </div>
          </div>

          <!-- CUSTOMER REVIEWS -->
          <div class="amz-reviews-card">
            <div class="amz-section-heading" style="font-size:0.95rem;">⭐ Top Customer Reviews from India</div>
            <div class="amz-user-review">
              <div class="amz-reviewer">
                <span>Rohit Verma (Jaipur)</span>
                <span class="amz-verified">✓ Verified Reader</span>
                <span style="color:#f59e0b;font-size:0.75rem;">⭐⭐⭐⭐⭐</span>
              </div>
              <div class="amz-review-text">
                "Incredible quality! Usually these 10-chapter books cost ₹400-500 on Amazon Kindle, but finding it on TheBhom.in completely free with zero ads or watermarks is game-changing. The audio narration is super helpful during commute."
              </div>
            </div>
            <div class="amz-user-review">
              <div class="amz-reviewer">
                <span>Ananya Sharma (Bengaluru)</span>
                <span class="amz-verified">✓ Verified Reader</span>
                <span style="color:#f59e0b;font-size:0.75rem;">⭐⭐⭐⭐⭐</span>
              </div>
              <div class="amz-review-text">
                "Clear, concise, and futuristic 2026 insights. The reading layout with dark theme makes reading on phone a breeze. Highly recommended!"
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAmazonBookModal() {
  const overlay = document.getElementById('amzBookOverlay');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function buyBookOneClick(bookId, title) {
  if (typeof dlBook === 'function') {
    dlBook(bookId);
  } else if (typeof printBook === 'function') {
    printBook(bookId);
  } else if (typeof dlBookPDF === 'function') {
    dlBookPDF(bookId);
  } else {
    showToast(`🎉 "${title}" purchased for ₹0! Instant Download starting...`, 'ok');
    setTimeout(() => {
      window.location.href = `ebooks.html?download=${bookId}`;
    }, 450);
  }
  showToast(`✅ "${title}" claimed & added to your permanent library! (100% Free)`, 'ok');
}

// ============================================================
// PINTEREST-STYLE SAVING & MEGA-FEED LOGIC
// ============================================================
function pinItem(id, title, tag, emoji, btn) {
  if (typeof window.toggleFavorite === 'function') {
    window.toggleFavorite({id, title, tag, emoji});
  }
  const isSaved = window.isFavorite ? window.isFavorite(id) : true;
  if (btn) {
    btn.classList.toggle('saved', isSaved);
    btn.innerHTML = isSaved ? '✅ Saved' : '📌 Save';
  }
  document.querySelectorAll(`.pin-save-btn[data-id="${id}"]`).forEach(b => {
    b.classList.toggle('saved', isSaved);
    b.innerHTML = isSaved ? '✅ Saved' : '📌 Save';
  });
  if (isSaved) {
    showToast(`📌 "${title}" Saved to your Board!`, 'ok');
  } else {
    showToast(`🗑️ Removed from Saved Board`, 'info');
  }
};

let currentHomeFeedCat = 'all';
let currentHomeFeedLimit = 28;

function renderPinterestHomeFeed(containerId = 'pinterestFeedContainer', category = 'all', append = false) {
  const container = document.getElementById(containerId);
  if (!container || !window.THEBHOM) return;

  currentHomeFeedCat = category;
  if (!append) currentHomeFeedLimit = 28;

  let allPins = [];

  // 1. Wallpapers (Unsplash/Wallhaven research)
  if (category === 'all' || category === 'wallpapers' || category === 'dark' || category === 'space') {
    const walls = window.THEBHOM.WALLPAPERS || [];
    walls.forEach(w => {
      let match = true;
      if (category === 'dark' && w.tag !== 'Dark' && !w.title.toLowerCase().includes('dark') && !w.title.toLowerCase().includes('black')) match = false;
      if (category === 'space' && w.tag !== 'Space' && !w.title.toLowerCase().includes('galaxy') && !w.title.toLowerCase().includes('star')) match = false;
      if (match) {
        allPins.push({
          id: w.id,
          title: w.title,
          category: 'wallpapers',
          badgeText: '🖼️ 4K WALLPAPER',
          tag: w.tag,
          emoji: w.emoji || '🖼️',
          ratio: (w.id.charCodeAt(0) % 2 === 0) ? '9/16' : '3/4',
          author: 'TheBhom Wallpapers',
          authorInitials: 'TW',
          authorBg: '#7c3aed',
          priceBadge: '4K Ultra-HD',
          actionText: '📱 4K Download',
          actionHandler: `location.href='wallpapers.html#${w.id}'`,
          openHandler: `location.href='wallpapers.html#${w.id}'`,
          thumb: `https://picsum.photos/seed/${w.id}p/600/${(w.id.charCodeAt(0) % 2 === 0) ? '900' : '750'}`
        });
      }
    });
  }

  // 2. E-Books (Amazon Kindle Storefront research)
  if (category === 'all' || category === 'ebooks' || category === 'business') {
    const books = window.THEBHOM.EBOOKS || [];
    books.forEach(b => {
      let match = true;
      if (category === 'business' && b.tag !== 'Business' && b.tag !== 'Career' && b.tag !== 'Finance') match = false;
      if (match) {
        allPins.push({
          id: b.id,
          title: b.title,
          category: 'ebooks',
          badgeText: '📖 KINDLE STORE',
          tag: b.tag,
          emoji: b.emoji || '📚',
          ratio: '2/3',
          author: 'TheBhom Publishing',
          authorInitials: 'TP',
          authorBg: '#f59e0b',
          priceBadge: '₹499 ₹0 FREE',
          actionText: '📖 Kindle Store',
          actionHandler: `openAmazonBookModal('${b.id}')`,
          openHandler: `openAmazonBookModal('${b.id}')`,
          customCover: true,
          color: b.color || '#7c3aed',
          pages: b.pages || 10
        });
      }
    });
  }

  // 3. Magazines (Issuu Glossy Flip research)
  if (category === 'all' || category === 'magazines' || category === 'business') {
    const mags = window.THEBHOM.MAGAZINES || [];
    mags.forEach(m => {
      let match = true;
      if (category === 'business' && m.tag !== 'Business' && m.tag !== 'Tech') match = false;
      if (match) {
        allPins.push({
          id: m.id,
          title: m.title,
          category: 'magazines',
          badgeText: '📰 DIGITAL ISSUE',
          tag: m.tag,
          emoji: m.emoji || '📰',
          ratio: '3/4',
          author: 'TheBhom Editorial',
          authorInitials: 'ME',
          authorBg: '#10b981',
          priceBadge: `${m.month || 'New'} Edition`,
          actionText: '📖 Flip Reader',
          actionHandler: `location.href='magazines.html#${m.id}'`,
          openHandler: `location.href='magazines.html#${m.id}'`,
          customMag: true,
          headline: m.headline || 'Exclusive Cover Story',
          color: '#064e3b'
        });
      }
    });
  }

  // 4. Templates (Canva & Figma research)
  if (category === 'all' || category === 'templates' || category === 'business') {
    const tmpls = window.THEBHOM.TEMPLATES || [];
    tmpls.forEach(t => {
      let match = true;
      if (category === 'business' && t.tag !== 'Resume' && t.tag !== 'Business' && t.tag !== 'Deck') match = false;
      if (match) {
        allPins.push({
          id: t.id,
          title: t.title,
          category: 'templates',
          badgeText: '🎨 CANVA & FIGMA',
          tag: t.tag,
          emoji: t.emoji || '🎨',
          ratio: '1/1',
          author: 'TheBhom Design Studio',
          authorInitials: 'DS',
          authorBg: '#06b6d4',
          priceBadge: '100% Free Pack',
          actionText: '🎨 Edit Template',
          actionHandler: `location.href='templates.html#${t.id}'`,
          openHandler: `location.href='templates.html#${t.id}'`,
          customTmpl: true,
          sub: t.sub || 'Social Media Pack',
          colors: t.colors || ['#06b6d4', '#7c3aed']
        });
      }
    });
  }

  // 5. Anniversary Cards (Greetings Island / 3D Flip research)
  if (category === 'all' || category === 'cards' || category === 'love') {
    const cards = window.THEBHOM.CARDS || [];
    cards.forEach(c => {
      let match = true;
      if (category === 'love' && c.tag !== 'Anniversary' && c.tag !== 'Love' && c.tag !== 'Wedding') match = false;
      if (match) {
        allPins.push({
          id: c.id,
          title: c.title,
          category: 'cards',
          badgeText: '💌 4-PANEL 3D CARD',
          tag: c.tag,
          emoji: c.emoji || '💌',
          ratio: '4/5',
          author: 'TheBhom Greetings',
          authorInitials: 'TG',
          authorBg: '#ec4899',
          priceBadge: 'Print Ready 300 DPI',
          actionText: '💌 3D Flip & Play',
          actionHandler: `location.href='cards.html#${c.id}'`,
          openHandler: `location.href='cards.html#${c.id}'`,
          customCard: true,
          sub: c.sub || 'Foldable Card'
        });
      }
    });
  }

  // Deterministic shuffle using title hash for consistent masonry mixing
  allPins.sort((a, b) => {
    const hA = (a.id + a.title).split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const hB = (b.id + b.title).split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return (hA % 100) - (hB % 100);
  });

  const sliced = allPins.slice(0, currentHomeFeedLimit);

  const pinsHtml = sliced.map(pin => {
    const isFav = window.isFavorite ? window.isFavorite(pin.id) : false;
    const safeTitle = pin.title.replace(/'/g, "\\'");

    let mediaContent = '';
    if (pin.customCover) {
      mediaContent = `
        <div style="width:100%;height:100%;min-height:280px;background:linear-gradient(135deg,${pin.color}22,#090d16);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1.5rem;text-align:center;position:relative;border-left:5px solid rgba(255,255,255,0.2);">
          <div style="font-size:3rem;margin-bottom:0.75rem;filter:drop-shadow(0 6px 12px rgba(0,0,0,0.6));">${pin.emoji}</div>
          <div style="font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:900;color:#fff;line-height:1.3;margin-bottom:0.4rem;">${pin.title}</div>
          <div style="font-size:0.72rem;color:#f59e0b;font-weight:700;">⭐⭐⭐⭐⭐ 4.9 • 10-Page Unabridged</div>
          <div style="margin-top:0.75rem;display:inline-flex;align-items:center;gap:6px;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.3);padding:4px 10px;border-radius:20px;font-size:0.72rem;font-weight:800;color:#f59e0b;">
            <span style="text-decoration:line-through;color:#94a3b8;font-weight:500;">₹499</span> ₹0 FREE
          </div>
        </div>
      `;
    } else if (pin.customMag) {
      mediaContent = `
        <div style="width:100%;height:100%;min-height:260px;background:linear-gradient(135deg,#062e24,#0f172a);display:flex;flex-direction:column;justify-content:space-between;padding:1.2rem;text-align:left;position:relative;">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid rgba(255,255,255,0.2);padding-bottom:6px;">
            <span style="font-size:0.8rem;font-weight:900;letter-spacing:2px;color:#34d399;">THE BHOM MAGAZINE</span>
            <span style="font-size:0.65rem;color:#94a3b8;">${pin.priceBadge}</span>
          </div>
          <div style="margin:1.5rem 0;">
            <div style="font-size:2rem;margin-bottom:6px;">${pin.emoji}</div>
            <div style="font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:900;color:#fff;line-height:1.25;">${pin.title}</div>
            <div style="font-size:0.72rem;color:#a7f3d0;margin-top:4px;font-style:italic;">${pin.headline}</div>
          </div>
          <div style="font-size:0.68rem;color:#94a3b8;border-top:1px dashed rgba(255,255,255,0.15);padding-top:6px;">
            📄 Full 10-Page Interactive Issue
          </div>
        </div>
      `;
    } else if (pin.customTmpl) {
      mediaContent = `
        <div style="width:100%;height:100%;min-height:240px;background:linear-gradient(135deg,${pin.colors[0]}33,${pin.colors[1]||'#1e1b4b'});display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1.2rem;text-align:center;position:relative;">
          <div style="font-size:2.8rem;margin-bottom:0.5rem;">${pin.emoji}</div>
          <div style="font-size:1rem;font-weight:800;color:#fff;line-height:1.3;">${pin.title}</div>
          <div style="font-size:0.72rem;color:#38bdf8;margin-top:4px;">${pin.sub}</div>
          <div style="margin-top:0.75rem;display:flex;gap:4px;font-size:0.62rem;font-weight:800;">
            <span style="background:rgba(0,0,0,0.4);color:#a855f7;padding:2px 6px;border-radius:4px;">CANVA</span>
            <span style="background:rgba(0,0,0,0.4);color:#06b6d4;padding:2px 6px;border-radius:4px;">FIGMA</span>
            <span style="background:rgba(0,0,0,0.4);color:#22c55e;padding:2px 6px;border-radius:4px;">PNG</span>
          </div>
        </div>
      `;
    } else if (pin.customCard) {
      mediaContent = `
        <div style="width:100%;height:100%;min-height:250px;background:linear-gradient(135deg,#370926,#180b1e);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1.4rem;text-align:center;position:relative;border:1px dashed rgba(236,72,153,0.3);border-radius:12px;margin:8px;">
          <div style="font-size:2.5rem;margin-bottom:0.4rem;">${pin.emoji}</div>
          <div style="font-family:'Dancing Script',cursive;font-size:1.4rem;font-weight:700;color:#f472b6;line-height:1.2;">${pin.title}</div>
          <div style="font-size:0.7rem;color:#fbcfe8;margin-top:4px;">💌 4-Panel Foldable Romantic Card</div>
          <div style="margin-top:0.6rem;font-size:0.65rem;color:#f59e0b;font-weight:700;">🎵 Includes Romantic Audio BGM</div>
        </div>
      `;
    } else {
      mediaContent = `<img src="${pin.thumb}" alt="${pin.title}" loading="lazy" onerror="this.parentElement.style.background='linear-gradient(135deg,#1e1b4b,#0f172a)'"/>`;
    }

    return `
      <div class="pin-item" id="pin_${pin.id}" onclick="${pin.openHandler}">
        <div class="pin-thumb" style="aspect-ratio:${pin.ratio};">
          ${mediaContent}
          <div style="position:absolute;top:10px;left:10px;background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,0.15);padding:3px 8px;border-radius:6px;font-size:0.64rem;font-weight:800;color:#f8fafc;letter-spacing:0.5px;z-index:2;">
            ${pin.badgeText}
          </div>

          <!-- Pinterest Floating Hover Overlay -->
          <div class="pin-overlay">
            <div class="pin-top-actions">
              <button class="pin-save-btn ${isFav?'saved':''}" data-id="${pin.id}" onclick="event.stopPropagation();pinItem('${pin.id}','${safeTitle}','${pin.tag}','${pin.emoji}',this)">
                ${isFav?'✅ Saved':'📌 Save'}
              </button>
            </div>
            <div class="pin-bottom-actions">
              <button class="pin-action-pill" onclick="event.stopPropagation();${pin.actionHandler}">
                ${pin.actionText}
              </button>
              <button class="pin-action-icon" title="Quick View" onclick="event.stopPropagation();${pin.openHandler}">
                ↗
              </button>
            </div>
          </div>
        </div>

        <div class="pin-info">
          <div class="pin-title">${pin.title}</div>
          <div class="pin-meta">
            <div class="pin-creator">
              <div class="pin-avatar" style="background:${pin.authorBg}">${pin.authorInitials}</div>
              <span>${pin.author}</span>
            </div>
            <span style="font-weight:700;color:#22c55e;">${pin.priceBadge}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (append) {
    container.insertAdjacentHTML('beforeend', pinsHtml);
  } else {
    container.innerHTML = pinsHtml;
  }

  // Update Load More button
  const lmBtn = document.getElementById('homeLoadMorePins');
  if (lmBtn) {
    lmBtn.style.display = allPins.length > currentHomeFeedLimit ? 'inline-flex' : 'none';
  }
};

function loadMoreHomePins() {
  currentHomeFeedLimit += 24;
  renderPinterestHomeFeed('pinterestFeedContainer', currentHomeFeedCat, false);
}

function filterHomePinterest(cat, chipEl) {
  document.querySelectorAll('.explore-chip').forEach(c => c.classList.remove('active'));
  if (chipEl) chipEl.classList.add('active');
  renderPinterestHomeFeed('pinterestFeedContainer', cat, false);
}

// Global window exposure
window.openSpotlight = openSpotlight;
window.closeSpotlight = closeSpotlight;
window.openSpotlightItem = openSpotlightItem;
window.openQRModal = openQRModal;
window.closeQRModal = closeQRModal;
window.toggleRomanticBGM = toggleRomanticBGM;
window.playRomanticBGM = playRomanticBGM;
window.stopRomanticBGM = stopRomanticBGM;
window.toggleLanguage = toggleLanguage;
window.copySelectedQuote = copySelectedQuote;
window.shareSelectedQuote = shareSelectedQuote;
window.shareToWhatsAppStatus = shareToWhatsAppStatus;
window.openAmazonBookModal = openAmazonBookModal;
window.closeAmazonBookModal = closeAmazonBookModal;
window.buyBookOneClick = buyBookOneClick;
window.pinItem = pinItem;
window.renderPinterestHomeFeed = renderPinterestHomeFeed;
window.loadMoreHomePins = loadMoreHomePins;
window.filterHomePinterest = filterHomePinterest;
window.promptPwaInstall = triggerAppInstall;
window.initShared = initShared;

// Auto-initialize shared features on every page so buttons, modals, and spotlight always work
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    try { initShared(); } catch(e) { console.log('initShared err:', e); }
  });
} else {
  try { initShared(); } catch(e) { console.log('initShared err:', e); }
}



