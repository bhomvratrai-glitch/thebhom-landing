const { evalInTab, navigateTab, getTabs } = require('./operate_google.js');

async function run() {
  const tabs = await getTabs();
  const gaTab = tabs.find(t => t.url.includes('analytics.google.com'));
  console.log('Navigating to GA4 Data Retention settings...');
  await navigateTab(gaTab.webSocketDebuggerUrl, 'https://analytics.google.com/analytics/web/#/a408501374p554715410/admin/dataretention/overview');
  await new Promise(r => setTimeout(r, 4500));

  const pageInfo = await evalInTab(gaTab.webSocketDebuggerUrl, `
    (() => {
      const selects = Array.from(document.querySelectorAll('mat-select, select, [role="combobox"]')).map(s => s.innerText.replace(/\\n/g, ' '));
      const buttons = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim());
      return {
        title: document.title,
        selects,
        buttons,
        body: document.body.innerText.slice(0, 1500)
      };
    })()
  `);
  console.log('\n=== DATA RETENTION PAGE INFO ===');
  console.log(pageInfo);

  // Try to click dropdown and change to 14 months
  const changed = await evalInTab(gaTab.webSocketDebuggerUrl, `
    (() => {
      const select = document.querySelector('mat-select, [role="combobox"]');
      if (select) {
        select.click();
        return 'Clicked dropdown';
      }
      return 'Dropdown not found';
    })()
  `);
  console.log('Dropdown click status:', changed);

  await new Promise(r => setTimeout(r, 1500));

  // Check dropdown options
  const options = await evalInTab(gaTab.webSocketDebuggerUrl, `
    (() => {
      const opts = Array.from(document.querySelectorAll('mat-option, [role="option"]'));
      const found14 = opts.find(o => o.innerText.includes('14'));
      if (found14) {
        found14.click();
        return 'Selected 14 months!';
      }
      return opts.map(o => o.innerText.trim());
    })()
  `);
  console.log('Option selection:', options);

  await new Promise(r => setTimeout(r, 1000));

  // Click Save button if enabled
  const saveResult = await evalInTab(gaTab.webSocketDebuggerUrl, `
    (() => {
      const saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.toLowerCase().includes('save') && !b.disabled);
      if (saveBtn) {
        saveBtn.click();
        return 'Save button clicked!';
      }
      return 'Save button not enabled or not found';
    })()
  `);
  console.log('Save result:', saveResult);
}

run().catch(console.error);
