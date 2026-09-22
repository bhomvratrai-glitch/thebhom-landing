const { sendCDP, evalInTab, navigateTab, getTabs } = require('./operate_google.js');

async function submitSitemap() {
  const tabs = await getTabs();
  const scTab = tabs.find(t => t.url.includes('search.google.com/search-console'));
  if (!scTab) {
    console.log('Search console tab not found');
    return;
  }
  const wsUrl = scTab.webSocketDebuggerUrl;
  console.log('Navigating to GSC Sitemaps page...');
  await navigateTab(wsUrl, 'https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Athebhom.in');
  await new Promise(r => setTimeout(r, 4500));

  const pageInfo = await evalInTab(wsUrl, `
    (() => {
      const inputs = Array.from(document.querySelectorAll('input')).map(i => ({ placeholder: i.placeholder, val: i.value, ariaLabel: i.getAttribute('aria-label') }));
      const rows = Array.from(document.querySelectorAll('[role="row"]')).map(r => r.innerText.replace(/\\n/g, ' | '));
      return { title: document.title, inputs, rows: rows.slice(0, 5) };
    })()
  `);
  console.log('GSC Sitemaps Page Info:', JSON.stringify(pageInfo, null, 2));

  // If there's an input to enter sitemap URL
  const submitted = await evalInTab(wsUrl, `
    (() => {
      const input = document.querySelector('input[aria-label*="sitemap" i], input[placeholder*="sitemap" i]');
      if (input) {
        input.value = 'sitemap.xml';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Find Submit button
        const btns = Array.from(document.querySelectorAll('button, div[role="button"]'));
        const submitBtn = btns.find(b => b.innerText.trim().toLowerCase() === 'submit');
        if (submitBtn) {
          submitBtn.click();
          return 'Entered sitemap.xml and clicked Submit';
        }
        return 'Found input, but submit button not found';
      }
      return 'Sitemap input not found';
    })()
  `);
  console.log('Submission status:', submitted);

  await new Promise(r => setTimeout(r, 4000));

  const afterStatus = await evalInTab(wsUrl, `
    (() => {
      const rows = Array.from(document.querySelectorAll('[role="row"]')).map(r => r.innerText.replace(/\\n/g, ' | '));
      return rows.slice(0, 5);
    })()
  `);
  console.log('Updated Sitemaps list:', afterStatus);
}

submitSitemap().catch(console.error);
