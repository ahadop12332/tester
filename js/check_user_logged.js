const hm = document.getElementById('change_txt');

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
  hm.innerHTML = `Click <a href="signup_login.html">here</a> for signup`;
} else {
  const data = { session: session };
  const url = "https://linkup-backend-production.up.railway.app/check_session/";
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.success.startsWith('Same')) {
        hm.innerHTML = `Welcome back! Your session is: ${session}`;
      } else {
        hm.innerHTML = `Click <a href="signup_login.html">here</a> for signup`;
      }
    })
    .catch((err) => {
      hm.innerHTML = `An error occurred: ${err.message}`;
    });
}
