/* Theme Management
   Handles dark/light mode switching and persistence
*/

// ---------- Theme Functions ----------
function setTheme(dark) {
  const root = document.documentElement;
  console.log("🎨 setTheme called with:", dark ? "dark" : "light");
  if (dark) {
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    root.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
  console.log("✅ Theme applied. HTML classes:", root.className);
}

function initTheme() {
  const preferred = localStorage.getItem("theme");
  // Default to dark mode if no preference saved
  if (preferred === null) {
    setTheme(true); // Start with dark mode
  } else {
    setTheme(preferred === "dark");
  }
}
