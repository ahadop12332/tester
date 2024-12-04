document.getElementById("signupForm").onsubmit = function (e) {
  e.preventDefault();
  const Name = document.getElementById("signupname").value;
  var Username = document.getElementById("signupusername").value;
  const Password = document.getElementById("signuppass").value;
  const Rpassword = document.getElementById("signuprpass").value;
  Username = Username.toLowerCase();

  if (Password !== Rpassword) {
    alert("Repeat password is incorrect");
  } else if (Username.length <= 3 || Name.length <= 3) {
    alert("Username or Name too short");
  } else if (Password.length <= 8 || Password.length >= 15) {
    alert("Password length should be between 9 and 14");
  } else if (Username.length >= 14 || Name.length >= 16) {
    alert("Name or Username too big");
  } else {
    const url = "https://linkup-backend-production.up.railway.app/signup/";
    const data = {
      name: Name,
      username: Username,
      password: Password,
    };
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message?.startsWith("success")) {
          document.cookie = `session=${data.message.split("success: ")[1]}`;
          alert("Signup successful!");
          window.location.href = "/index.html";
        } else if (data.error?.startsWith("User exists")) {
          alert("This username is already taken");
        } else {
          alert("Signup failed: " + (data.error || "Unknown error"));
        }
      })
      .catch((error) => alert("An error occurred: " + error));
  }
};

document.getElementById("loginForm").onsubmit = function (e) {
  e.preventDefault();
  var Username = document.getElementById("loginusername").value;
  const Password = document.getElementById("loginpass").value;
  Username = Username.toLowerCase();

  if (Username.length <= 3 || Username.length >= 14) {
    alert("Username length should be between 6 and 14");
  } else if (Password.length <= 8 || Password.length >= 15) {
    alert("Password length should be between 9 and 14");
  } else {
    const url = "https://linkup-backend-production.up.railway.app/login/";
    const data = { username: Username, password: Password };
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message?.startsWith("success")) {
          document.cookie = `session=${data.message.split("success: ")[1]}`;
          alert("Login successful!");
          window.location.href = "/index.html";
        } else if (data.error?.startsWith("WRONG PASSWORD")) {
          alert("Incorrect password");
        } else if (data.error?.startsWith("IN")) {
          alert("Invalid user!");
        } else {
          console.log(data.error)
          alert("Login failed: " + (String(data.error) || "Unknown error"));
        }
      })
      console.log(data.error)
      .catch((error) => alert("Error: " + String(error)));
  }
};

function togglePasswordVisibility(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}
