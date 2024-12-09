let ws;
var session;
let chatState = {};
var myId = Number(getCookie('session').split('@')[0]);

async function get_chats() {
  const chatlist_url = "wss://linkup-backend-production.up.railway.app/ws/chatlist/";
  const userinfo_url = "https://linkup-backend-production.up.railway.app/userinfo/";
  session = getCookie('session');
  const check_session_status = await check_session();

  if (check_session_status !== "redirect") {
    console.error("Session check failed. Redirecting to login...");
    return;
  }

  if (ws && ws.readyState === WebSocket.OPEN) return;

  ws = new WebSocket(chatlist_url);

  ws.onopen = () => {
    ws.send(JSON.stringify({ session }));
    console.log('Chatlist websocket connected!');
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
      let chatItems = '';
      document.querySelector('.loader').style.display = 'inline-block';
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

            chatItems += `
              <div class='list-chats' onclick='go_chat(${chat_id}) getChatMsg()'>
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
      chatContainer.innerHTML += chatItems;
      document.querySelector('.loader').style.display = 'none';
    } else if (data.error) {
      console.error(`Error: ${data.error}`);
    }
  };

  ws.onclose = () => {
    console.log("Chatlist WebSocket closed. Reconnecting...");
    setTimeout(get_chats, 600);
  };

  ws.onerror = (error) => {
    console.error("Chatlist WebSocket error:", error);
    setTimeout(get_chats, 500);
  };
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    console.log("Trying to refresh ws connection....");
    get_chats();
    get_msgs();
  }
});


const chat = document.getElementById('chat_with_someone');
const messages = document.getElementById('messages');
const messageFrom = document.getElementById('messageFrom');
const messageTo = document.getElementById('messageTo');
const pagemain = document.getElementById("page-main");
const others = document.getElementById('others');
const chatName = document.getElementById("chatName");
const chatPfp = document.querySelector(".profile-img-in");
const msgVal = document.getElementById('writeText');

async function close_chat() {
  pagemain.style.display = 'block';
  chat.style.display = 'none';
  others.style.display = 'block';
  document.title = "LinkUp";
  chat.setAttribute('chat_id', '0');
}

hmmm = {
  "from": 143,
  "message_id": "56194f6e-e7eb-4555-8c12-d2f6efba1fc2",
  "text": "Hello from javascript",
  "timestamp": "2024-12-08T14:04:52.309209+05:30",
  "seen": false
}

async function go_chat(chat_id) {
  if (chat_id) {
    if (chatState[chat_id]) {
      try {
        // DISPLAY -----------
        pagemain.style.display = 'none';
        others.style.display = 'none';
        chat.style.display = 'inline-block';
        
        // TOP STUFFS -----------
        document.title = `${chatState[chat_id]['name']} • Chat`;
        chatName.textContent = chatState[chat_id]['name'];
        chatPfp.src = chatState[chat_id]['profile_picture'];
        // MAIN -------
        chat.setAttribute('chat_id', chat_id);
        // MESSAGES ------------
        if (hmmm.from !== myId) {
          messages.innerHTML += `<div id='messageFrom'>${hmmm.text}</div>`;
        } else {
          messages.innerHTML += `<div id='messageTo'>${hmmm.text}</div>`;
        }
        // ------------------------------
      } catch (error) {
        console.error(`Error while loading chat ${chat_id}: ${error}`);
      }
    } else {
      console.warn(`You are trying to open a invalid id: ${chat_id}`);
      await close_chat()
    }
  } else {
    console.log(chat.getAttribute('uid'));
  }
}

async function sendMessage() {
  const chatId = chat.getAttribute("chat_id");
  if (msgVal.value.length >= 1) {
    const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    messages.innerHTML += `<div id='messageTo'>${msgVal.value} <div id="msgTime">${time}</div> </div>`;
    msgVal.value = '';
    console.log('Testing msg sent on: ', chatId);
  } else {
    alert('Text too short');
  }
}


document.querySelector("#messageBox textarea").addEventListener("focus", function (e) {
  e.preventDefault();
});
