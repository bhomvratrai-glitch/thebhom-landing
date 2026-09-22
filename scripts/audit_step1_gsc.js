const { sendCDP, evalInTab, navigateTab, getTabs } = require('./operate_google.js');

async function run() {
  const tabs = await getTabs();
  const gscTab = tabs.find(t => t.url.includes('search-console'));
  if (!gscTab) {
    console.error('Search Console tab not found');
    return;
  }
  console.log(`Operating on Search Console Tab: ${gscTab.id}`);

  // 1. Get current Overview text & summary
  const overviewData = await evalInTab(gscTab.webSocketDebuggerUrl, `
    (() => {
      return {
        title: document.title,
        url: window.location.href,
        bodyTextSnippet: document.body.innerText.slice(0, 1500)
      };
    })()
  `);
  console.log('=== GSC OVERVIEW ===');
  console.log(overviewData);

  // 2. Navigate to Sitemaps tab
  console.log('\nNavigating to Sitemaps tab...');
  await navigateTab(gscTab.webSocketDebuggerUrl, 'https://search.google.com/search-console/sitemaps?resource_id=sc-domain:thebhom.in');
  
  await new Promise(r => setTimeout(r, 4000));

  const sitemapsData = await evalInTab(gscTab.webSocketDebuggerUrl, `
    (() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr')).map(tr => tr.innerText);
      const text = document.body.innerText;
      const input = document.querySelector('input[aria-label*="sitemap" i], input[placeholder*="sitemap" i], input[type="text"]');
      return {
        title: document.title,
        url: window.location.href,
        hasInput: !!input,
        inputValue: input ? input.value : null,
        rows,
        pageSnippet: text.slice(0, 1200)
      };
    })()
  `);
  console.log('\n=== GSC SITEMAPS TAB ===');
  console.log(sitemapsData);
}

run().catch(console.error);
