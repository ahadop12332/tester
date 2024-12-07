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
        console.log("Session valid. Proceeding...");
      } else {
        console.warn("Session unmatched. Redirecting...");
        return "Unmatched";
      }
    } catch (err) {
      console.error("Error during session check:", err.message);
      return "Unmatched";
    }
  } else {
    console.warn("No session cookie found.");
    return "Unmatched";
  }

  const ws = new WebSocket(ws_url);

  ws.onopen = () => {
    console.log('Message WebSocket connected');
    ws.send(JSON.stringify({ session }));
  };

  ws.onmessage = (event) => {
    alert(`New message: ${event.data}`);
  };

  ws.onclose = () => {
    console.warn('Message WebSocket closed, reconnecting...');
    setTimeout(() => get_msgs(), 200);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
}

/* Let's cook 2025 *\
