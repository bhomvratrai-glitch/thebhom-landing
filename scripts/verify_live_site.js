const { sendCDP, evalInTab, navigateTab, getTabs } = require('./operate_google.js');

async function verify() {
  console.log('1. Creating new tab via PUT /json/new ...');
  const res = await fetch('http://localhost:9222/json/new', { method: 'PUT' });
  const newTab = await res.json();
  const wsUrl = newTab.webSocketDebuggerUrl;

  console.log('Navigating to https://www.thebhom.in/articles/ ...');
  await navigateTab(wsUrl, 'https://www.thebhom.in/articles/');
  await new Promise(r => setTimeout(r, 4500));

  const hubData = await evalInTab(wsUrl, `
    (() => {
      const title = document.title;
      const h1 = document.querySelector('h1')?.innerText || '';
      const articles = Array.from(document.querySelectorAll('.art-card')).map(c => ({
        title: c.querySelector('h2')?.innerText || '',
        cat: c.querySelector('.art-cat-pill')?.innerText || '',
        href: c.href || ''
      }));
      const pills = Array.from(document.querySelectorAll('.cat-pill')).map(p => p.innerText.trim());
      const gaScript = !!document.querySelector('script[src*="G-GHVNZWFVQV"]');
      const adScript = !!document.querySelector('script[src*="pub-4674566886677472"]');
      return { title, h1, articleCount: articles.length, sampleArticles: articles.slice(0, 3), categories: pills, gaScript, adScript };
    })()
  `);

  console.log('\n=== LIVE ARTICLES HUB VERIFICATION ===');
  console.log(JSON.stringify(hubData, null, 2));

  console.log('\n2. Testing navigation to sample article: "how-to-compress-pdf-without-losing-quality" ...');
  await navigateTab(wsUrl, 'https://www.thebhom.in/articles/how-to-compress-pdf-without-losing-quality.html');
  await new Promise(r => setTimeout(r, 4500));

  const articleData = await evalInTab(wsUrl, `
    (() => {
      const title = document.title;
      const h1 = document.querySelector('h1')?.innerText || '';
      const breadcrumbs = Array.from(document.querySelectorAll('.breadcrumb-item')).map(b => b.innerText.trim());
      const tocLinks = Array.from(document.querySelectorAll('.toc a')).map(a => a.innerText.trim());
      const author = document.querySelector('.byline-author')?.innerText || '';
      const schemas = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => {
        try { return JSON.parse(s.innerText); } catch(e) { return null; }
      });
      const gaScript = !!document.querySelector('script[src*="G-GHVNZWFVQV"]');
      const adScript = !!document.querySelector('script[src*="pub-4674566886677472"]');
      const adSlots = Array.from(document.querySelectorAll('ins.adsbygoogle')).map(ins => ins.getAttribute('data-ad-slot'));
      return { title, h1, breadcrumbs, tocCount: tocLinks.length, author, schemasFound: schemas.length, gaScript, adScript, adSlots };
    })()
  `);

  console.log('\n=== LIVE ARTICLE PAGE VERIFICATION ===');
  console.log(JSON.stringify(articleData, null, 2));

  // Close tab to leave browser clean
  await fetch(`http://localhost:9222/json/close/${newTab.id}`);
  console.log('\nVerification tab closed cleanly.');
}

verify().catch(console.error);
