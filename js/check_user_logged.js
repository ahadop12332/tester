hm = document.getElementById('change_txt')

function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (let cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) {
      return value;
    }
  }
  return null;
}

const session = getCookie('session');
if (session == null) {
  hm.textContent = "Can't find any sessions"
} else {
  hm.textContent = session
}

