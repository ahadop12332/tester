const messageBox = document.querySelector("#messageBox");
const writeText = document.querySelector("#writeText");

writeText.addEventListener("focus", () => {
  const initialHeight = window.innerHeight;

  window.addEventListener("resize", () => {
    const keyboardHeight = initialHeight - window.innerHeight;

    if (keyboardHeight > 0) {
      messageBox.style.bottom = `${keyboardHeight}px`;
    } else {
      messageBox.style.bottom = "10px";
    }
  });
});

writeText.addEventListener("blur", () => {
  messageBox.style.bottom = "10px";
});
