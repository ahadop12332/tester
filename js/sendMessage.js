var sWs;
var isSendMsgWsOpen = false;

async function sendMessage() {
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
    };
  }
}
