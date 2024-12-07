export async function check_session() {
  const session = getCookie('session');
  if (session == null) {
    return "Unmatched";
  } else {
    try {
      const data = { session: session };
      const url = "https://linkup-backend-production.up.railway.app/check_session/";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success && typeof result.success === "string" && result.success === "Same") {
        return "redirect";
      } else {
        return "Unmatched";
      }
    } catch (err) {
      console.log("Error: " + err.message);
      return "Unmatched";
    }
  }
}

window.check_session = check_session;
