async function get_msgs() {
  const url = "wss://linkup-backend-production.up.railway.app/ws/msguns/";
  const session = getCookie('session');
  const check_session = await check_session();
  if (check_session !== 'redirect') {
    console.error('Session check failed. Redirecting to login...');
    return;
  }

  ws = new WebSocket(url);
  
  ws.onopen = () => {
    ws.send(JSON.stringify({ session }));
  };

  ws.onmessage = async (event) => {
    alert(`New message: ${event.data}`)
  }

  ws.onclose = () => {
    console.warn('Message notification Websocket closed, reconnecting...');
    setTimeout(get_msgs(), 200)
  }
}
