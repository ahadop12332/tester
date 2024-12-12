var sWs;
var isSendMsgWsOpen = false;

async function sendMessageWs() {
  if (!isSendMsgWsOpen) {
    const ws_url = "wss://linkup-backend-production.up.railway.app/ws/sendMessage/";
    const session = getCookie('session');
    if (!session) {
      window.location.href = "/index.html";
      return;
    }
    sWs = new WebSocket(ws_url);
    sWs.onopen = () => {
      console.log('Message WebSocket connected');
      sWs.send(JSON.stringify({ session }));
      isSendMsgWsOpen = true;
    };

    sWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error && data.error === "INVALID SESSION" || data.error && data.error === "INVALID USER") {
        window.location.href = "/index.html";
      } else if (data.error && data.error === "INVALID RECIPIENT") {
        console.warn("You trying to send message to invalid user!");
      }
    };

    sWs.onclose = () => {
      console.warn('sendMessage WebSocket closed, reconnecting...');
      isSendMsgWsOpen = false;
      setTimeout(() => sendMessageWs(), 600);
    };

    sWs.onerror = (error) => {
      console.error('sendMessage WebSocket error:', error);
    };
  }
}
