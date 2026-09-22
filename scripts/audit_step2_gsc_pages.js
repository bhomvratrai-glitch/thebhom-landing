const { evalInTab, navigateTab, getTabs } = require('./operate_google.js');

async function run() {
  const tabs = await getTabs();
  const gscTab = tabs.find(t => t.url.includes('search-console'));
  console.log('Navigating to GSC Pages Indexing report...');
  await navigateTab(gscTab.webSocketDebuggerUrl, 'https://search.google.com/search-console/pages?resource_id=sc-domain:thebhom.in');
  
  await new Promise(r => setTimeout(r, 4500));

  const pagesReport = await evalInTab(gscTab.webSocketDebuggerUrl, `
    (() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr')).map(tr => tr.innerText);
      const text = document.body.innerText;
      return {
        title: document.title,
        url: window.location.href,
        rows,
        pageSnippet: text.slice(0, 2000)
      };
    })()
  `);
  console.log('\n=== GSC PAGES INDEXING REASONS ===');
  console.log(pagesReport.rows);
  console.log('\n=== PAGE SNIPPET ===');
  console.log(pagesReport.pageSnippet);
}

run().catch(console.error);
