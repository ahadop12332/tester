var chats = [];

import { check_session } from "js/check_user_logged.js";
import { getCookie } from "js/check_user_logged.js";

const chatlist_url = "https://linkup-backend-production.up.railway.app/chatlist/";
const userinfo_url = "https://linkup-backend-production.up.railway.app/userinfo/";
const session = getCookie('session');
const check_session_status = check_session();
const chatlistFetch = {
  "session": session
};

if (check_session_status == "redirect") {
  fetch(chatlist_url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(chatlistFetch),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.chats) {
        const chat_ids = data.chats; 
        chat_ids.forEach(chat_id => {
          fetch(userinfo_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "session": session, "chat_id": chat_id }),
          })
            .then((response) => response.json())
            .then((chatinfo) => {
              const upload = {
                "name": chatinfo.output.name,
                "img": chatinfo.output.profile_picture,
                "username": chatinfo.output.username,
                "lastMsg": "You: I love her",
              };
              chats.push(upload);
            })
            .catch(error => {
              console.error("Error fetching chat info:", error);
            });
        });
      } else {
        alert(`Error: ${data.error}`);
      }
    })
    .catch(error => {
      console.error("Error fetching chat list:", error);
    });
}

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
