const signupModal = document.getElementById("signupModal");
const loginModal = document.getElementById("loginModal");

document.getElementById("openSignup").onclick = () => signupModal.style.display = "flex";
document.getElementById("openLogin").onclick = () => loginModal.style.display = "flex";

window.onclick = (event) => {
  if (event.target === signupModal) signupModal.style.display = "none";
  if (event.target === loginModal) loginModal.style.display = "none";
};

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

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
  } else if (Password.length <= 8) {
    alert("Password too short");
  } else if (Password.length >= 12) {
    alert("Password too big");
  } else if (Username.length >= 11 || Name.length >= 16) {
    alert("Name or Username too big");
  } else {
    const url = "https://linkup-backend-production.up.railway.app/signup/";
    const data = {
      name: Name,
      username: Username,
      password: Password,
    };
    const headers = { "Content-Type": "application/json" };

    fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message && data.message.startsWith("success")) {
          const session = data.message.split("success: ")[1];
          document.cookie = `session=${session}`;
          alert("Signup successful!");
          closeModal("signupModal");
        } else if (data.error && data.error.startsWith("User exists")) {
          alert("This username already taken");
        } else {
          console.log("ERROR: " + (data || "Unknown error"));
          alert("Signup failed: " + (data.error || "Unknown error"));
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while signing up. Please try again later." + error);
      });
  }
};

document.getElementById("loginForm").onsubmit = function (e) {
  e.preventDefault();
  const Userame = document.getElementById("loginusername").value;
  const Password = document.getElementById("loginpass").value;
  if (Username.length <= 5) {
    alert("Username too short");
  } else if (Password.length <= 8) {
    alert("Password too short");
  } else if (Password.length >= 12) {
    alert("Password too big");
  } else if (Username.length >= 11) {
    alert("Username too big");
  } else {
    try {
      alert("Login not possible at the moment");
      closeModal("loginModal");
    } catch (error) {
      alert("Error: " + error);
    }
  }
};
