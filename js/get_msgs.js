var isChatWsOpen = false;
var msgs;
var mWs;

async function get_msgs() {
  if (!isChatWsOpen) {
    const ws_url = "wss://linkup-backend-production.up.railway.app/ws/loadMsg/";
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
          console.log('Start receiving messages!');
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

    mWs = new WebSocket(ws_url);
    mWs.onopen = () => {
      console.log('Message WebSocket connected');
      mWs.send(JSON.stringify({ session }));
      isChatWsOpen = true;
    };

    mWs.onmessage = (event) => {
      oh = JSON.parse(event.data);
      msgs = oh.reverse();
      if (msgs.error && msgs.error === "INVALID USER OR SESSION") {
        mWs.close();
        console.log('Session invalid/expired/someone logged, so closing ws signup again!');
        window.location.href = "/index.html";
      } else if (msgs.error) {
        console.error(`Error: ${msgs.error}`);
      } else if (msgs.data) {
        msgs.data.forEach((h) => {
          console.log(`New message\nFrom: ${h.from}\n${h.text}`);
        });
      } else if (msgs.info) {
        console.log(`INFO: ${msgs.info}`);
      }
    };

    mWs.onclose = () => {
      console.warn('Message WebSocket closed, reconnecting...');
      isChatWsOpen = false;
      setTimeout(() => get_msgs(), 600);
    };

    mWs.onerror = (error) => {
      console.error('Message WebSocket error:', error);
    };
  }
}
