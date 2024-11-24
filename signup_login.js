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
    alert("Username too small");
  } else if (Password.length <= 8) {
    alert("Password too small");
  } else {
    alert(Name);
    closeModal("signupModal");
  }
};

document.getElementById("loginForm").onsubmit = function (e) {
  e.preventDefault();
  alert("Login Successful!");
  closeModal("loginModal");
};
