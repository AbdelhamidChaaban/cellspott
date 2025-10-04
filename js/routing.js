/* Routing System
   Handles page navigation and loading
*/

// ---------- Routes ----------
const routes = [
  "profile",
  "open-services",
  "closed-services",
  "alfa-gifts",
  "streaming",
  "credits",
  "validity",
  "order-history",
  "netflix",
  "shahed",
  "osn",
  "welcome-carousel",
];

let loadedPages = {};

// ---------- Page Loading ----------
async function loadPage(route) {
  if (loadedPages[route]) {
    console.log(`📄 Using cached page: ${route}`);
    return loadedPages[route];
  }
  
  // Try embedded pages first (fallback for file:// protocol)
  if (window.PAGES && window.PAGES[route]) {
    console.log(`📦 Using embedded page: ${route}`);
    loadedPages[route] = window.PAGES[route];
    return window.PAGES[route];
  }
  
  // Try fetching from server
  console.log(`📥 Loading page from server: ${route}`);
  try {
    const response = await fetch(`./pages/${route}.html`);
    console.log(`📡 Fetch response for ${route}:`, response.status, response.statusText);
    if (!response.ok) throw new Error(`Failed to load ${route}: ${response.status}`);
    const html = await response.text();
    console.log(`✅ Page loaded successfully: ${route}, length: ${html.length}`);
    loadedPages[route] = html;
    return html;
  } catch (e) {
    console.error(`❌ Error loading page ${route}:`, e);
    return `<div class="text-center text-red-400 py-12">Error loading page: ${e.message}</div>`;
  }
}

// ---------- Navigation ----------
async function navTo(route) {
  console.log(`🧭 Navigating to: ${route}`);
  const container = $("#pages");
  if (!container) {
    console.error("❌ Pages container not found!");
    return;
  }
  
  console.log(`📦 Container found:`, container);
  
  // Load the page HTML if not already loaded
  const pageHtml = await loadPage(route);
  
  console.log(`📝 Inserting HTML into container, length: ${pageHtml.length}`);
  // Clear container and insert new page
  container.innerHTML = pageHtml;
  
  console.log(`✅ HTML inserted, container children:`, container.children.length);
  
  // Update page title
  const title = route.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const pageTitle = $("#page-title");
  if (pageTitle) {
    pageTitle.textContent = title;
  }
  
  // Replace feather icons
  if (window.feather) {
    console.log(`🎨 Replacing feather icons`);
    feather.replace();
  }
  
  // Trigger page-specific initialization
  if (window.currentPageInit) {
    console.log(`⚙️ Running page init for: ${route}`);
    window.currentPageInit(route);
  }
  
  window.location.hash = route;
  console.log(`✅ Navigation complete to: ${route}`);
}

// ---------- Routing Initialization ----------
function initRouting() {
  $$(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = btn.getAttribute("data-route");
      navTo(r);
    });
  });
  const hash = window.location.hash.replace("#", "");
  // Only navigate if hash is not already set (e.g., by welcome carousel)
  if (!hash) {
    navTo("profile");
  } else if (routes.includes(hash)) {
    navTo(hash);
  } else {
    navTo("profile");
  }
}
