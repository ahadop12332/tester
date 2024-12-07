let ws;
let chatState = {};

async function get_chats() {
  const chatlist_url = "wss://linkup-backend-production.up.railway.app/ws/chatlist/";
  const userinfo_url = "https://linkup-backend-production.up.railway.app/userinfo/";
  const session = getCookie('session');
  const check_session_status = await check_session();

  if (check_session_status !== "redirect") {
    console.error("Session check failed. Redirecting to login...");
    return;
  }

  if (ws && ws.readyState === WebSocket.OPEN) return;

  ws = new WebSocket(chatlist_url);

  ws.onopen = () => {
    ws.send(JSON.stringify({ session }));
  };

  ws.onmessage = async (event) => {
    const data = JSON.parse(event.data);
    if (data.chats) {
      const chatContainer = document.querySelector('.page-main');
      chatState = {}; 
      const lchats = document.querySelectorAll('.list-chats');
      if (lchats.length > 0) {
        lchats.forEach(lchat => lchat.remove());
      }
      for (let chat_id of data.chats) {
        try {
          const chatResponse = await fetch(userinfo_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session, chat_id }),
          });

          const chatinfo = await chatResponse.json();
          if (chatinfo.output) {
            chatState[chat_id] = chatinfo.output;

            const upload = {
              name: chatinfo.output.name,
              img: chatinfo.output.profile_picture,
              username: chatinfo.output.username,
              lastMsg: "You: Thanks for all who made me learn these stuffs.",
            };

            const chatItem = `
              <div class='list-chats' onclick='go_chat()'>
                <img src="${upload.img}" class='profile-img'>
                <div>
                  <p class="chatname">${upload.name}</p>
                  <p class="message-in">${upload.lastMsg}</p>
                </div>
              </div>
            `;
            chatContainer.innerHTML += chatItem;
          } else if (chatinfo.error) {
            console.error(`Chat info error: ${chatinfo.error}`);
          }
        } catch (error) {
          console.error("Error fetching chat info:", error);
        }
      }
    } else if (data.error) {
      console.error(`Error: ${data.error}`);
    }
  };

  ws.onclose = () => {
    console.log("WebSocket closed. Reconnecting...");
    setTimeout(get_chats, 600);
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
    alert("WebSocket error:", error);
    setTimeout(get_chats, 500);
  };
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    console.log("Trying to refresh ws connection....");
    initializeWebSocket();
  }
});

const chat_pm_div = document.getElementById('chat_with_someone');
const pagemain = document.getElementById("page-main");
const others = document.getElementById('others');
const chatName = document.getElementById("chatName");

async function go_chat(pm = true) {
  if (pm) {
    pagemain.style.display = 'none';
    chat_pm_div.style.display = 'inline-block';
    others.style.display = 'none';
    chatName.textContent = "Mano";
  } else {
    console.log(chat_pm_div.getAttribute('uid'));
  }
}

async function close_chat() {
  pagemain.style.display = 'block';
  chat_pm_div.style.display = 'none';
  others.style.display = '';
}

document.querySelector("#messageBox textarea").addEventListener("focus", function (e) {
  e.preventDefault();
});
