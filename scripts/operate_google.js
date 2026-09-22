/**
 * Advanced Google Console Operator via CDP
 */

async function sendCDP(wsUrl, method, params = {}) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const id = Math.floor(Math.random() * 1000000);

    const timer = setTimeout(() => {
      ws.close();
      reject(new Error(`Timeout waiting for ${method}`));
    }, 15000);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id, method, params }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.id === id) {
          clearTimeout(timer);
          ws.close();
          if (msg.error) {
            reject(msg.error);
          } else {
            resolve(msg.result);
          }
        }
      } catch (e) {}
    };

    ws.onerror = (err) => {
      clearTimeout(timer);
      reject(err);
    };
  });
}

async function evalInTab(wsUrl, expression) {
  const result = await sendCDP(wsUrl, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  return result?.result?.value;
}

async function navigateTab(wsUrl, url) {
  return await sendCDP(wsUrl, 'Page.navigate', { url });
}

async function getTabs() {
  const res = await fetch('http://localhost:9222/json/list');
  return (await res.json()).filter(t => t.type === 'page');
}

module.exports = { sendCDP, evalInTab, navigateTab, getTabs };
