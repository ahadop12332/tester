document.getElementById("signupForm").onsubmit = function (e) {
  e.preventDefault();
  const Name = document.getElementById("signupname").value;
  const Username = document.getElementById("signupusername").value;
  const Password = document.getElementById("signuppass").value;
  const Rpassword = document.getElementById("signuprpass").value;

  if (Password !== Rpassword) {
    alert("Repeat password is incorrect");
  } else if (Username.length <= 5 || Name.length <= 3) {
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
  const Username = document.getElementById("loginusername").value;
  const Password = document.getElementById("loginpass").value;

  if (Username.length <= 5 || Username.length >= 14) {
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
        } else if (data.error?.startsWith("WRONG PASSWORD")) {
          alert("Incorrect password");
        } else if (data.error?.startsWith("INVALID USER")) {
          alert("Invalid user!");
        } else {
          alert("Login failed: " + (data.error || "Unknown error"));
        }
      })
      .catch((error) => alert("Error: " + error));
  }
};

function togglePasswordVisibility(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}
