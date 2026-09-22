/**
 * TheBhom Chrome CDP Controller
 * Controls Google Chrome via native WebSocket CDP protocol
 */

async function sendCDPCommand(wsUrl, method, params = {}) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const id = Math.floor(Math.random() * 100000);

    const timer = setTimeout(() => {
      ws.close();
      reject(new Error(`Timeout waiting for ${method}`));
    }, 10000);

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
      } catch (err) {
        // Ignore other messages
      }
    };

    ws.onerror = (err) => {
      clearTimeout(timer);
      reject(err);
    };
  });
}

async function main() {
  const res = await fetch('http://localhost:9222/json/list');
  const tabs = await res.json();
  const pages = tabs.filter(t => t.type === 'page');
  console.log(`Found ${pages.length} active pages:`);
  for (const p of pages) {
    console.log(`- [${p.id}] ${p.title} (${p.url})`);
  }
}

main().catch(console.error);
