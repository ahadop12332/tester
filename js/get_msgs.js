import { check_session } from './js/check_user_logged.js'

async function get_msgs() {
  const url = "wss://linkup-backend-production.up.railway.app/ws/msguns/";
  const session = getCookie('session');
  console.log(`session is ${session}`)
  const check_session = await check_session();
  console.log(`check_session is ${check_session}`)
  if (check_session !== 'redirect') {
    console.error('Session check failed. Redirecting to login...');
    return;
  }

  ws = new WebSocket(url);
  
  ws.onopen = () => {
    alert('Message Websocket connected');
    ws.send(JSON.stringify({ session }));
  };

  ws.onmessage = async (event) => {
    alert(`New message: ${event.data}`);
  }

  ws.onclose = () => {
    console.warn('Message notification Websocket closed, reconnecting...');
    setTimeout(get_msgs(), 200);
  }
}


window.get_msgs = get_msgs;
