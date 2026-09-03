/**
 * HVAC AI Chat Widget by BHOM
 * Embed: <script src="https://hvac.thebhom.in/widget/hvac-chat.js" data-business-id="YOUR_ID"></script>
 */
(function() {
  'use strict';
  const SUPABASE_URL = 'https://xunuljixksicxprmaobd.supabase.co';
  const API_BASE = SUPABASE_URL + '/functions/v1';
  
  // Get business ID from script tag
  const scriptTag = document.currentScript || document.querySelector('script[data-business-id]');
  const BUSINESS_ID = scriptTag?.getAttribute('data-business-id');
  if (!BUSINESS_ID) { console.error('HVAC Chat: data-business-id missing'); return; }
  
  let config = null;
  let conversationId = null;
  let isOpen = false;
  let isLoading = false;
  
  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #hvac-chat-widget * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    #hvac-chat-bubble { position: fixed; bottom: 24px; right: 24px; width: 64px; height: 64px; border-radius: 50%; background: var(--hvac-color, #2563eb); color: white; border: none; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; z-index: 99999; transition: transform 0.3s, box-shadow 0.3s; }
    #hvac-chat-bubble:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(0,0,0,0.35); }
    #hvac-chat-bubble svg { width: 28px; height: 28px; fill: white; }
    #hvac-chat-badge { position: absolute; top: -2px; right: -2px; width: 18px; height: 18px; background: #ef4444; border-radius: 50%; border: 2px solid white; display: none; }
    #hvac-chat-window { position: fixed; bottom: 100px; right: 24px; width: 380px; max-width: calc(100vw - 48px); height: 520px; max-height: calc(100vh - 140px); background: white; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); z-index: 99998; display: none; flex-direction: column; overflow: hidden; animation: hvac-slide-up 0.3s ease; }
    @keyframes hvac-slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    #hvac-chat-header { background: var(--hvac-color, #2563eb); color: white; padding: 16px 20px; display: flex; align-items: center; gap: 12px; }
    #hvac-chat-header-avatar { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
    #hvac-chat-header-info h3 { font-size: 15px; font-weight: 600; }
    #hvac-chat-header-info p { font-size: 12px; opacity: 0.85; }
    #hvac-chat-close { margin-left: auto; background: none; border: none; color: white; cursor: pointer; font-size: 20px; padding: 4px; opacity: 0.8; }
    #hvac-chat-close:hover { opacity: 1; }
    #hvac-chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; background: #f8fafc; }
    .hvac-msg { max-width: 85%; padding: 10px 14px; border-radius: 16px; font-size: 14px; line-height: 1.5; word-wrap: break-word; }
    .hvac-msg-user { align-self: flex-end; background: var(--hvac-color, #2563eb); color: white; border-bottom-right-radius: 4px; }
    .hvac-msg-bot { align-self: flex-start; background: white; color: #1e293b; border: 1px solid #e2e8f0; border-bottom-left-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .hvac-msg-welcome { text-align: center; font-size: 13px; color: #64748b; padding: 8px; }
    .hvac-typing { display: flex; gap: 4px; padding: 12px 16px; }
    .hvac-typing span { width: 8px; height: 8px; border-radius: 50%; background: #94a3b8; animation: hvac-bounce 1.4s infinite; }
    .hvac-typing span:nth-child(2) { animation-delay: 0.2s; }
    .hvac-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes hvac-bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-8px); } }
    #hvac-chat-input-area { padding: 12px 16px; border-top: 1px solid #e2e8f0; display: flex; gap: 8px; background: white; }
    #hvac-chat-input { flex: 1; border: 1px solid #e2e8f0; border-radius: 24px; padding: 10px 16px; font-size: 14px; outline: none; transition: border-color 0.2s; }
    #hvac-chat-input:focus { border-color: var(--hvac-color, #2563eb); }
    #hvac-chat-send { width: 40px; height: 40px; border-radius: 50%; background: var(--hvac-color, #2563eb); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: opacity 0.2s; }
    #hvac-chat-send:disabled { opacity: 0.5; cursor: not-allowed; }
    #hvac-chat-send svg { width: 18px; height: 18px; fill: white; }
    #hvac-chat-powered { text-align: center; padding: 6px; font-size: 11px; color: #94a3b8; background: white; }
    #hvac-chat-powered a { color: #64748b; text-decoration: none; font-weight: 500; }
    #hvac-chat-quick-btns { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 12px; }
    .hvac-quick-btn { background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 6px 14px; font-size: 12px; color: #475569; cursor: pointer; transition: all 0.2s; }
    .hvac-quick-btn:hover { background: var(--hvac-color, #2563eb); color: white; border-color: var(--hvac-color, #2563eb); }
    @media (max-width: 480px) {
      #hvac-chat-window { bottom: 0; right: 0; width: 100%; max-width: 100%; height: 100vh; max-height: 100vh; border-radius: 0; }
      #hvac-chat-bubble { bottom: 16px; right: 16px; width: 56px; height: 56px; }
    }
  `;
  document.head.appendChild(style);
  
  // Create widget container
  const container = document.createElement('div');
  container.id = 'hvac-chat-widget';
  container.innerHTML = `
    <button id="hvac-chat-bubble" aria-label="Open chat">
      <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/><path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/></svg>
      <div id="hvac-chat-badge"></div>
    </button>
    <div id="hvac-chat-window">
      <div id="hvac-chat-header">
        <div id="hvac-chat-header-avatar">❄️</div>
        <div id="hvac-chat-header-info">
          <h3>Loading...</h3>
          <p>• Online now</p>
        </div>
        <button id="hvac-chat-close">✕</button>
      </div>
      <div id="hvac-chat-messages"></div>
      <div id="hvac-chat-quick-btns"></div>
      <div id="hvac-chat-input-area">
        <input id="hvac-chat-input" type="text" placeholder="Type your message..." autocomplete="off" />
        <button id="hvac-chat-send" disabled>
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
      <div id="hvac-chat-powered">Powered by <a href="https://hvac.thebhom.in" target="_blank">BHOM AI</a></div>
    </div>
  `;
  document.body.appendChild(container);
  
  // Elements
  const bubble = document.getElementById('hvac-chat-bubble');
  const badge = document.getElementById('hvac-chat-badge');
  const chatWindow = document.getElementById('hvac-chat-window');
  const closeBtn = document.getElementById('hvac-chat-close');
  const messages = document.getElementById('hvac-chat-messages');
  const quickBtns = document.getElementById('hvac-chat-quick-btns');
  const input = document.getElementById('hvac-chat-input');
  const sendBtn = document.getElementById('hvac-chat-send');
  const headerInfo = document.getElementById('hvac-chat-header-info');
  
  // Load config
  async function loadConfig() {
    try {
      const res = await fetch(`${API_BASE}/widget-config?business_id=${BUSINESS_ID}`);
      config = await res.json();
      if (config.error) { console.error('HVAC Chat:', config.error); return; }
      
      // Apply branding
      document.documentElement.style.setProperty('--hvac-color', config.widget_color || '#2563eb');
      bubble.style.background = config.widget_color || '#2563eb';
      headerInfo.querySelector('h3').textContent = config.name || 'HVAC Support';
      
      // Show quick action buttons for services
      if (config.services && config.services.length > 0) {
        const btns = config.services.slice(0, 4).map(s =>
          `<button class="hvac-quick-btn" data-msg="${s} ke baare mein jaankari chahiye">${s}</button>`
        ).join('');
        quickBtns.innerHTML = btns;
      }
      
      // Show notification badge after 3 seconds
      setTimeout(() => { if (!isOpen) badge.style.display = 'block'; }, 3000);
    } catch (e) {
      console.error('HVAC Chat: Failed to load config', e);
    }
  }
  
  // Toggle chat
  function toggleChat() {
    isOpen = !isOpen;
    chatWindow.style.display = isOpen ? 'flex' : 'none';
    badge.style.display = 'none';
    if (isOpen && messages.children.length === 0 && config) {
      addMessage(config.welcome_message || 'Namaste! How can we help you today?', 'bot');
    }
    if (isOpen) input.focus();
  }
  
  bubble.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);
  
  // Add message to UI
  function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `hvac-msg hvac-msg-${type}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }
  
  function showTyping() {
    const div = document.createElement('div');
    div.className = 'hvac-msg hvac-msg-bot hvac-typing';
    div.id = 'hvac-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }
  
  function hideTyping() {
    const el = document.getElementById('hvac-typing');
    if (el) el.remove();
  }
  
  // Send message
  async function sendMessage(text) {
    if (!text.trim() || isLoading) return;
    
    addMessage(text, 'user');
    input.value = '';
    sendBtn.disabled = true;
    isLoading = true;
    quickBtns.innerHTML = '';
    showTyping();
    
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: BUSINESS_ID,
          conversation_id: conversationId,
          message: text,
          visitor_id: getVisitorId(),
        }),
      });
      
      const data = await res.json();
      hideTyping();
      
      if (data.error) {
        addMessage('Sorry, kuch problem ho gayi. Please dobara try karein.', 'bot');
      } else {
        conversationId = data.conversation_id;
        addMessage(data.response, 'bot');
      }
    } catch (e) {
      hideTyping();
      addMessage('Network error. Please check your connection.', 'bot');
    }
    
    isLoading = false;
    sendBtn.disabled = !input.value.trim();
  }
  
  // Event listeners
  input.addEventListener('input', () => { sendBtn.disabled = !input.value.trim() || isLoading; });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input.value); } });
  sendBtn.addEventListener('click', () => sendMessage(input.value));
  
  // Quick button clicks
  quickBtns.addEventListener('click', (e) => {
    if (e.target.classList.contains('hvac-quick-btn')) {
      sendMessage(e.target.getAttribute('data-msg'));
    }
  });
  
  // Visitor ID (persistent)
  function getVisitorId() {
    let vid = localStorage.getItem('hvac_visitor_id');
    if (!vid) { vid = 'v_' + Math.random().toString(36).substr(2, 12); localStorage.setItem('hvac_visitor_id', vid); }
    return vid;
  }
  
  // Init
  loadConfig();
})();
