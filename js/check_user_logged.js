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
      if (data.success && typeof data.success === "string" && data.success == 'Same') {
        hm.innerHTML = `Seems like you are already logged, Redirecting not possible now wait for future update, (ily)`;
      } else {
        hm.innerHTML = `Click <a href="signup_login.html">here</a> for signup`;
      }
    })
    .catch((err) => {
      console.log("Error: " + err.message + " " + data.error)
      hm.innerHTML = `Click <a href="signup_login.html">here</a> for signup`;
    });
}
