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
  hm.innerHTML = `Click <a href="signup_login.html">here</a> for signup`
} else {
  hm.textContent = session
}

