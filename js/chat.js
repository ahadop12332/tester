/* const chats = [
  { name: "Mano", img: "https://i.imgur.com/mwkxppE.jpeg", lastMsg: "You: Hii" },
  { name: "Random stanger", img: "https://i.imgur.com/mwkxppE.jpeg", lastMsg: "You: Hello!" },
  { name: "Kora", img: "https://i.imgur.com/mwkxppE.jpeg", lastMsg: "You: Hello!" }
  
];
*/
import { check_session } from "js/check_user_logged.js";
import { getCookie } from "js/check_user_logged.js";

chatlist_url = "https://linkup-backend-production.up.railway.app/chatlist";
session = getCookie('session');
check_session = check_session();
if (check_session == "redirect") {
  fetch(chatlist_url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.chats) {
        
      } else {
        alert(`Error: ${data.error}`)
      }
    }
  
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
  
// Get elements
chat_pm_div = document.getElementById('chat_with_someone')
pagemain = document.getElementById("page-main")
others = document.getElementById('others')
chatName = document.getElementById("chatName")
async function go_chat(pm=true) {
  if (pm == true) {
    pagemain.style.display = 'none';
    chat_pm_div.style.display = 'inline-block';
    others.style.display = 'none';
    
    chatName.textContent = "Mano"
  } else {
    console.log(chat_pm_div.getAttribute('uid'))
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
