function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var loadChatWsClosed = false;
var msgs;

async function get_msgs() {
  const ws_url = "wss://linkup-backend-production.up.railway.app/ws/msguns/";
  const api_url = "https://linkup-backend-production.up.railway.app/check_session/";
  const session = getCookie('session');

  if (session !== null) {
    try {
      const data = { session: session };
      const response = await fetch(api_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success && typeof result.success === "string" && result.success === "Same") {
        console.log('Start receiving messages!')
      } else {
        console.warn("Session unmatched. Redirecting...");
        return;
      }
    } catch (err) {
      console.error("Error during session check:", err.message);
      return;
    }
  } else {
    console.warn("No session cookie found.");
    return;
  }
  
  const ws = new WebSocket(ws_url);
  ws.onopen = () => {
    console.log('Message WebSocket connected');
    ws.send(JSON.stringify({ session }));
    while (true) {
      if (loadChatWsClosed) {
        const chatId = chat.getAttribute("chat_id");
        if (chatId !== '0') {
          ws.send({'chat_id': String(chatId)});
        }
      } else {
        break;
      }
      await sleep(300);
    }
  };

  ws.onmessage = (event) => {
    msg = JSON.parse(event.data);
    if (msg.error && msg.error === "INVALID USER OR SESSION") {
      ws.close();
      console.log('Session invalid/expired/someone logged, so closing ws signup again!');
      window.location.href = "/index.html";
    } else if (msg.error) {
      console.error(`Error: ${msg.error}`);
    } else if (msg.data) {
      msg.data.forEach((h) => {
        console.log(`New message\nFrom: ${h.from}\n${h.text}`);
      });
    } else if (msg.info) {
      console.log(`INFO: ${msg.info}`);
    }
  };

  ws.onclose = () => {
    console.warn('Message WebSocket closed, reconnecting...');
    loadChatWsClosed = true;
    setTimeout(() => get_msgs(), 600);
  };

  ws.onerror = (error) => {
    console.error('Message WebSocket error:', error);
  };
}

/* Let's cook 2025 */
