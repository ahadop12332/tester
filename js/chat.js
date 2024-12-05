function getCooke(name) {
  const cookies = document.cookie.split('; ');
  for (let cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) {
      return value;
    }
  }
  return null;
}


async function check_sessin() {
  const session = getCooke('session');
  if (session == null) {
    return "Unmatched";
  } else {
    try {
      const data = { session: session };
      const url = "https://linkup-backend-production.up.railway.app/check_session/";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success && typeof result.success === "string" && result.success === "Same") {
        return "redirect";
      } else {
        return "Unmatched";
      }
    } catch (err) {
      console.log("Error: " + err.message);
      return "Unmatched";
    }
  }
}
hll = document.getElementById("hll");
hl = document.getElementById("hl");

async function get_chats() {
  const chatlist_url = "https://linkup-backend-production.up.railway.app/chatlist/";
  const userinfo_url = "https://linkup-backend-production.up.railway.app/userinfo/";
  const session = getCooke('session');
  const check_session_status = await check_sessin();
  const chatlistFetch = { session };

  if (check_session_status === "redirect") {
    try {
      const response = await fetch(chatlist_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chatlistFetch),
      });

      const data = await response.json();
      if (data.chats) {
        const chat_ids = data.chats; 
        const chatContainer = document.querySelector('.page-main');
        
        for (let chat_id of chat_ids) {
          try {
            const chatResponse = await fetch(userinfo_url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ session, chat_id }),
            });
            const chatinfo = await chatResponse.json();

            if (chatinfo.output) {
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
    } catch (error) {
      console.error("Error fetching chat list:", error);
    }
  } else {
    console.error("Session check failed. Redirecting to login...");
  }
}

/*
function show_chats() {
  get_chats()
  const chatContainer = document.querySelector('.page-main');
  chats.forEach(chat => {
    const chatItem = `
      <div class='list-chats' onclick='go_chat()'>
        <img src="${chat.img}" class='profile-img'>
        <div>
          <p class="chatname">${chat.name}</p>
          <p class="message-in">${chat.lastMsg}</p>
        </div>
      </div>
    `;
    chatContainer.innerHTML += chatItem;
  });
}
*/

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

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
