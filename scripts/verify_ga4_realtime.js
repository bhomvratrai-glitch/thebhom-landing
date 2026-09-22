const { evalInTab, navigateTab, getTabs } = require('./operate_google.js');

async function run() {
  console.log('Opening https://www.thebhom.in to trigger live GA4 hit...');
  const res = await fetch('http://localhost:9222/json/new?https://www.thebhom.in', { method: 'PUT' });
  const siteTab = await res.json();
  console.log('Site opened in tab:', siteTab.id);

  await new Promise(r => setTimeout(r, 6000));

  // Check GA4 tab realtime report
  const tabs = await getTabs();
  const gaTab = tabs.find(t => t.url.includes('analytics.google.com'));
  if (gaTab) {
    console.log('Navigating GA4 tab to Realtime overview...');
    await navigateTab(gaTab.webSocketDebuggerUrl, 'https://analytics.google.com/analytics/web/#/a408501374p554715410/reports/realtime');
    await new Promise(r => setTimeout(r, 5000));

    const realtimeData = await evalInTab(gaTab.webSocketDebuggerUrl, `
      (() => {
        return {
          title: document.title,
          url: window.location.href,
          text: document.body.innerText.slice(0, 1500)
        };
      })()
    `);
    console.log('\n=== GA4 REALTIME REPORT ===');
    console.log(realtimeData);
  }
}

run().catch(console.error);
