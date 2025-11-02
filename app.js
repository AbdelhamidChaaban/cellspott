/* Telecom Dashboard - app.js
   Plain JS + Tailwind (CDN) + Firebase (compat SDKs)
*/

// ---------- Firebase Init ----------
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkctXy17dOjUJp14qyj2dkJP0pe9nmNlY",
  authDomain: "cellspot-cb050.firebaseapp.com",
  projectId: "cellspot-cb050",
  storageBucket: "cellspot-cb050.firebasestorage.app",
  messagingSenderId: "237744317937",
  appId: "1:237744317937:web:0af5c423ceb10770385050",
  measurementId: "G-ESCLEGP1X9"
};

let app, auth, db, storage;
(function initFirebase() {
  try {
    if (!firebase.apps.length) {
      app = firebase.initializeApp(firebaseConfig);
    } else {
      app = firebase.app();
    }
    auth = firebase.auth();
    db = firebase.firestore();
    storage = firebase.storage();
  } catch (e) {
    console.warn("Firebase init error. Check your config in app.js", e);
  }
})();

// ---------- DOM Helpers ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const show = (el) => el && el.classList.remove("hidden");
const hide = (el) => el && el.classList.add("hidden");

function formatLBP(n) {
  if (n === undefined || n === null || isNaN(n)) return "0 LBP";
  return `${Number(n).toLocaleString("en-LB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} LBP`;
}

function isValidLebPhone8(num) {
  return /^\d{8}$/.test(String(num || "").trim());
}

// ---------- Theme ----------
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

// ---------- Routing ----------
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
];

let loadedPages = {};

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

function initRouting() {
  $$(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = btn.getAttribute("data-route");
      navTo(r);
    });
  });
  const hash = window.location.hash.replace("#", "");
  navTo(routes.includes(hash) ? hash : "profile");
}

// ---------- Sidebar Collapse ----------
function initSidebar() {
  const sidebar = $("#sidebar");
  const toggle = $("#sidebar-toggle");
  const brandText = $("#brand-text");
  const labels = $$(".nav-label");
  const backdrop = $("#sidebar-backdrop");
  const sidebarOpen = $("#sidebar-open");

  console.log("initSidebar called", { sidebar, toggle, brandText, labelsCount: labels.length });

  if (!sidebar || !toggle || !brandText) {
    console.error("Sidebar elements not found!");
    return;
  }

  const isMobile = () => window.innerWidth < 1024;

  function closeMobileSidebar() {
    if (isMobile()) {
      sidebar.classList.add("-translate-x-full");
      if (backdrop) backdrop.classList.add("hidden");
    }
  }

  function openMobileSidebar() {
    if (isMobile()) {
      sidebar.classList.remove("-translate-x-full");
      if (backdrop) backdrop.classList.remove("hidden");
    }
  }

  function applyCollapsed(collapsed) {
    console.log("applyCollapsed:", collapsed);
    
    // On desktop, handle collapse
    if (!isMobile()) {
      if (collapsed) {
        sidebar.style.width = "4rem"; // icons-only
        brandText.classList.add("hidden");
        labels.forEach((l) => l.classList.add("hidden"));
        toggle.innerHTML = '<i data-feather="chevron-right"></i>';
      } else {
        sidebar.style.width = "16rem"; // default w-64
        brandText.classList.remove("hidden");
        labels.forEach((l) => l.classList.remove("hidden"));
        toggle.innerHTML = '<i data-feather="chevron-left"></i>';
      }
      if (window.feather) feather.replace();
      localStorage.setItem("sidebarCollapsed", collapsed ? "1" : "0");
    } else {
      // On mobile, toggle open/close
      closeMobileSidebar();
    }
  }

  // Desktop toggle button
  toggle.addEventListener("click", (e) => {
    console.log("Sidebar toggle clicked!");
    e.preventDefault();
    e.stopPropagation();
    
    if (isMobile()) {
      closeMobileSidebar();
    } else {
      const current = localStorage.getItem("sidebarCollapsed") === "1";
      applyCollapsed(!current);
    }
  });

  // Mobile open button
  if (sidebarOpen) {
    sidebarOpen.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openMobileSidebar();
    });
  }

  // Backdrop click closes sidebar
  if (backdrop) {
    backdrop.addEventListener("click", closeMobileSidebar);
  }

  // Close sidebar when clicking nav items on mobile
  $$(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      if (isMobile()) {
        closeMobileSidebar();
      }
    });
  });

  // Apply initial state (desktop only)
  if (!isMobile()) {
    const initial = localStorage.getItem("sidebarCollapsed") === "1";
    applyCollapsed(initial);
  }
}

// ---------- Auth UI ----------
function initAuthView() {
  const tabLogin = $("#tab-login");
  const tabSignup = $("#tab-signup");
  const loginForm = $("#login-form");
  const signupForm = $("#signup-form");
  const toggleThemeAuth = $("#toggle-theme-auth");

  if (toggleThemeAuth) {
    toggleThemeAuth.addEventListener("click", () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(!isDark);
      // Update icon
      const icon = toggleThemeAuth.querySelector("i");
      if (icon) {
        icon.setAttribute("data-feather", isDark ? "sun" : "moon");
        if (window.feather) feather.replace();
      }
    });
  }

  tabLogin.addEventListener("click", () => {
    tabLogin.className = "flex-1 py-2.5 rounded-lg bg-brand text-white font-medium";
    tabSignup.className = "flex-1 py-2.5 rounded-lg bg-navy-700 border border-navy-600 font-medium";
    show(loginForm); hide(signupForm);
  });

  tabSignup.addEventListener("click", () => {
    tabSignup.className = "flex-1 py-2.5 rounded-lg bg-brand text-white font-medium";
    tabLogin.className = "flex-1 py-2.5 rounded-lg bg-navy-700 border border-navy-600 font-medium";
    hide(loginForm); show(signupForm);
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    $("#login-error").textContent = "";
    const email = $("#login-email").value.trim();
    const password = $("#login-password").value;
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      $("#login-error").textContent = err.message || "Login failed";
    }
  });

  $("#signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    $("#signup-error").textContent = "";
    const firstName = $("#signup-firstName").value.trim();
    const lastName = $("#signup-lastName").value.trim();
    const phone = $("#signup-phone").value.trim();
    const email = $("#signup-email").value.trim();
    const password = $("#signup-password").value;

    if (!isValidLebPhone8(phone)) {
      $("#signup-error").textContent = "Phone must be 8 digits (no +961 or leading 0)";
      return;
    }

    try {
      // Check if phone number already exists
      console.log("=== PHONE VALIDATION START ===");
      console.log("Checking phone number:", phone);
      console.log("Phone type:", typeof phone);
      
      const phoneCheck = await db.collection("users")
        .where("phone", "==", phone)
        .get();
      
      console.log("Phone check completed. Results:", phoneCheck.size, "users found");
      console.log("Is empty?", phoneCheck.empty);
      
      if (!phoneCheck.empty) {
        console.log("DUPLICATE PHONE DETECTED - Blocking signup");
        $("#signup-error").textContent = "This phone number is already registered. Please use a different number.";
        return;
      }
      
      console.log("Phone number is unique - proceeding with signup");
      
      // Create user account (Firebase will automatically check if email exists)
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      const uid = cred.user.uid;
      
      console.log("Creating user document with phone:", phone);
      await db.collection("users").doc(uid).set({
        firstName,
        lastName,
        phone: String(phone), // Explicitly convert to string
        email,
        balanceLBP: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      
      console.log("User created successfully");
      // Navigate to profile after signup via onAuthStateChanged
    } catch (err) {
      console.error("Signup error:", err);
      // Firebase automatically handles duplicate email errors
      if (err.code === "auth/email-already-in-use") {
        $("#signup-error").textContent = "This email is already registered";
      } else {
        $("#signup-error").textContent = err.message || "Signup failed";
      }
    }
  });
}

// ---------- App Shell UI and Data ----------
function initTopBar() {
  const themeSwitchBtn = $("#theme-switch-btn");
  const themeLabel = $("#theme-label");
  const logoutBtn = $("#logout-btn");
  
  console.log("initTopBar called", { themeSwitchBtn, logoutBtn });
  
  if (themeSwitchBtn) {
    // Update button based on current theme
    function updateThemeButton() {
      const isDark = document.documentElement.classList.contains("dark");
      const icon = themeSwitchBtn.querySelector("i");
      
      if (isDark) {
        // Currently dark, show "Light" button to switch to light
        if (themeLabel) themeLabel.textContent = "Light";
        if (icon) {
          icon.setAttribute("data-feather", "sun");
          if (window.feather) feather.replace();
        }
      } else {
        // Currently light, show "Dark" button to switch to dark
        if (themeLabel) themeLabel.textContent = "Dark";
        if (icon) {
          icon.setAttribute("data-feather", "moon");
          if (window.feather) feather.replace();
        }
      }
    }
    
    themeSwitchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isDark = document.documentElement.classList.contains("dark");
      console.log("🌓 Theme switch clicked! Current:", isDark ? "dark" : "light", "Switching to:", isDark ? "light" : "dark");
      
      // Toggle theme
      setTheme(!isDark);
      
      // Update button appearance
      updateThemeButton();
    });
    
    // Set initial button state
    updateThemeButton();
    console.log("✅ Theme switch button initialized");
  } else {
    console.error("❌ Theme switch button not found!");
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => auth.signOut());
  }
}

function bindProfileForm(uid) {
  const form = $("#profile-form");
  const saveBtn = $("#profile-save");
  const first = $("#profile-firstName");
  const last = $("#profile-lastName");

  console.log("bindProfileForm called", { form, saveBtn, first, last });

  if (!form || !first || !last) {
    console.error("Profile form elements not found!");
    return () => {};
  }

  // If there's no save button (read-only profile), return early
  if (!saveBtn) {
    console.log("Profile is read-only, no save functionality needed");
    return () => {};
  }

  let initial = { firstName: "", lastName: "" };
  
  function updateInitial() {
    initial = { 
      firstName: first.value || "", 
      lastName: last.value || "" 
    };
    console.log("✅ Initial values set:", initial);
    // Force check after setting initial
    setTimeout(checkDirty, 100);
  }
  
  function checkDirty() {
    const currentFirst = first.value || "";
    const currentLast = last.value || "";
    const dirty = currentFirst !== initial.firstName || currentLast !== initial.lastName;
    
    if (dirty) {
      saveBtn.disabled = false;
      saveBtn.style.opacity = "1";
      saveBtn.style.cursor = "pointer";
      saveBtn.style.pointerEvents = "auto";
      console.log("🟢 Button ENABLED");
    } else {
      saveBtn.disabled = true;
      saveBtn.style.opacity = "0.5";
      saveBtn.style.cursor = "not-allowed";
      saveBtn.style.pointerEvents = "none";
      console.log("🔴 Button DISABLED");
    }
    
    console.log("Check dirty:", { 
      currentFirst, 
      currentLast, 
      initial, 
      dirty,
      buttonDisabled: saveBtn.disabled 
    });
  }
  
  first.addEventListener("input", () => {
    console.log("First name input event");
    checkDirty();
  });
  
  last.addEventListener("input", () => {
    console.log("Last name input event");
    checkDirty();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("🚀 Form submitted");
    saveBtn.disabled = true;
    saveBtn.style.opacity = "0.5";
    saveBtn.style.cursor = "not-allowed";
    saveBtn.style.pointerEvents = "none";
    
    try {
      await db.collection("users").doc(uid).update({
        firstName: first.value.trim(),
        lastName: last.value.trim(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      console.log("✅ Profile saved successfully");
      updateInitial();
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("❌ Save failed:", err);
      alert("Failed to save: " + (err.message || err));
      saveBtn.disabled = false;
      saveBtn.style.opacity = "1";
      saveBtn.style.cursor = "pointer";
      saveBtn.style.pointerEvents = "auto";
    }
  });
  
  // Return the updateInitial function so it can be called when data loads
  return updateInitial;
}

function subscribeUserProfile(uid, updateInitial) {
  return db.collection("users").doc(uid).onSnapshot((doc) => {
    const d = doc.data() || {};
    
    // Update top bar (always visible)
    const topUsername = $("#top-username");
    const topBalance = $("#top-balance");
    if (topUsername) topUsername.textContent = `${d.firstName || ""} ${d.lastName || ""}`.trim() || "User";
    if (topBalance) topBalance.textContent = formatLBP(d.balanceLBP || 0);

    // Update profile page elements (only if they exist)
    const profileFirstName = $("#profile-firstName");
    const profileLastName = $("#profile-lastName");
    const profilePhone = $("#profile-phone");
    const profileBalance = $("#profile-balance");
    
    if (profileFirstName) profileFirstName.value = d.firstName || "";
    if (profileLastName) profileLastName.value = d.lastName || "";
    if (profilePhone) profilePhone.value = d.phone || "";
    if (profileBalance) profileBalance.textContent = formatLBP(d.balanceLBP || 0);
    
    // Update initial values when data is loaded
    if (updateInitial) updateInitial();
  });
}

// ---------- Packages (Closed u-share Services) ----------
const PACKAGES = [
  { sizeGB: 5.5, priceLBP: 540000 },
  { sizeGB: 11, priceLBP: 700000 },
  { sizeGB: 15, priceLBP: 820000 },
  { sizeGB: 22, priceLBP: 1020000 },
  { sizeGB: 33, priceLBP: 1350000 },
  { sizeGB: 44, priceLBP: 1670000 },
  { sizeGB: 55, priceLBP: 1980000 },
  { sizeGB: 66, priceLBP: 2320000 },
];

// Alfa Gifts Packages (same as closed services)
const ALFA_PACKAGES = [
  { sizeGB: 5.5, priceLBP: 540000 },
  { sizeGB: 11, priceLBP: 700000 },
  { sizeGB: 15, priceLBP: 820000 },
  { sizeGB: 22, priceLBP: 1020000 },
  { sizeGB: 33, priceLBP: 1350000 },
  { sizeGB: 44, priceLBP: 1670000 },
  { sizeGB: 55, priceLBP: 1980000 },
  { sizeGB: 66, priceLBP: 2320000 },
];

let promoCodeApplied = false;
let promoDiscount = 0;

let alfaPromoCodeApplied = false;
let alfaPromoDiscount = 0;

let openPromoCodeApplied = false;
let openPromoDiscount = 0;

// Credits Packages (same as others)
const CREDITS_PACKAGES = [
  { sizeGB: 5.5, priceLBP: 540000 },
  { sizeGB: 11, priceLBP: 700000 },
  { sizeGB: 15, priceLBP: 820000 },
  { sizeGB: 22, priceLBP: 1020000 },
  { sizeGB: 33, priceLBP: 1350000 },
  { sizeGB: 44, priceLBP: 1670000 },
  { sizeGB: 55, priceLBP: 1980000 },
  { sizeGB: 66, priceLBP: 2320000 },
];

let creditsPromoCodeApplied = false;
let creditsPromoDiscount = 0;

async function applyPromoCode() {
  const input = $("#promo-code-input");
  const message = $("#promo-message");
  const applyBtn = $("#apply-promo-btn");
  
  if (!input || !message) return;
  
  const code = input.value.trim();
  
  if (code === "") {
    message.innerHTML = '<span class="text-red-400">Please enter a promo code</span>';
    return;
  }
  
  try {
    // Load promo code from Firebase
    const promoDoc = await db.collection("settings").doc("promoCode").get();
    
    if (promoDoc.exists) {
      const promoData = promoDoc.data();
      
      if (promoData.code === code && promoData.active) {
  promoCodeApplied = true;
  // promoData.discount is stored as amount in LBP
  promoDiscount = promoData.discount; // amount LBP
  message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promoData.discount).toLocaleString()} LBP off on all packages</span>`;
        input.disabled = true;
        if (applyBtn) applyBtn.disabled = true;
        renderPackages(); // Re-render with discount
      } else {
        message.innerHTML = '<span class="text-red-400">Invalid promo code</span>';
      }
    } else {
      message.innerHTML = '<span class="text-red-400">Invalid promo code</span>';
    }
  } catch (error) {
    console.error("Error checking promo code:", error);
    message.innerHTML = '<span class="text-red-400">Error validating promo code</span>';
  }
}

async function renderPackages() {
  const container = $("#packages-list");
  if (!container) return;
  
  container.innerHTML = '<p class="text-center text-gray-400 py-8">Loading packages...</p>';
  
  try {
    // Load packages from Firebase
    const packagesSnap = await db.collection("packages")
      .where("type", "==", "closed-service")
      .where("active", "==", true)
      .get();
    
    let packages = [];
    packagesSnap.forEach(doc => {
      packages.push({ id: doc.id, packageId: doc.id, ...doc.data() });
    });
    
    // Sort by size
    packages.sort((a, b) => (a.sizeGB || 0) - (b.sizeGB || 0));
    
    if (packages.length === 0) {
      container.innerHTML = '<p class="text-center text-gray-400 py-8">No packages available</p>';
      return;
    }
    
    container.innerHTML = "";
    packages.forEach((p, idx) => {
  const originalPrice = p.priceLBP;
  const discountedPrice = promoCodeApplied ? Math.max(0, Math.round(originalPrice - promoDiscount)) : originalPrice;
  const hasDiscount = promoCodeApplied;
      
      // Determine availability status
      const qty = p.quantity !== undefined ? p.quantity : 0;
      let availabilityBadge = '';
      let buttonDisabled = '';
      let buttonClass = 'bg-blue-600 hover:bg-blue-700 text-white';
      
      if (qty === 0) {
        availabilityBadge = '<div class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">Sold Out</div>';
        buttonDisabled = 'disabled';
        buttonClass = 'bg-gray-400 cursor-not-allowed text-gray-700';
      } else if (qty <= 2) {
        availabilityBadge = '<div class="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">Low Stock</div>';
      } else {
        availabilityBadge = '<div class="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">Available</div>';
      }
    
      const card = document.createElement("div");
      card.className = "card-bg border border-navy-600 rounded-2xl p-5 flex flex-col relative overflow-hidden";
      card.innerHTML = `
        <div class="absolute top-4 right-4 opacity-10 z-0">
          <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
          </svg>
        </div>
        ${availabilityBadge}
  ${hasDiscount ? '<div class="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">' + Number(promoDiscount).toLocaleString() + ' LBP off</div>' : ''}
        <div class="flex items-center space-x-2 mb-2 mt-6">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-7.24 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
          </svg>
          <span class="text-lg font-semibold">${p.sizeGB}GB</span>
        </div>
        <div class="text-sm text-gray-400 mb-3">Package Details</div>
        <div class="mb-4">
          ${hasDiscount ? `<div class="text-sm text-gray-500 line-through">${formatLBP(originalPrice)}</div>` : ''}
          <div class="text-2xl font-bold ${hasDiscount ? 'text-green-400' : ''}">${formatLBP(discountedPrice)}</div>
        </div>
        <button data-idx="${idx}" data-price="${discountedPrice}" data-package-id="${p.id || ''}" ${buttonDisabled} class="pkg-buy w-full py-2.5 rounded-lg ${buttonClass} font-semibold flex items-center justify-center space-x-2 transition-colors mt-auto">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <span>${qty === 0 ? 'Sold Out' : 'Purchase'}</span>
        </button>`;
      container.appendChild(card);
    });

    container.querySelectorAll(".pkg-buy").forEach((btn) => btn.addEventListener("click", () => {
      const idx = btn.getAttribute("data-idx");
      const p = packages[idx];
      const discountedPrice = parseFloat(btn.getAttribute("data-price"));
      openPurchaseModal({ ...p, priceLBP: discountedPrice });
    }));
    
    // Add promo code button handler
    const applyBtn = $("#apply-promo-btn");
    if (applyBtn) {
      applyBtn.addEventListener("click", applyPromoCode);
    }
    
    // Allow Enter key to apply promo code
    const promoInput = $("#promo-code-input");
    if (promoInput) {
      promoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          applyPromoCode();
        }
      });
    }
  } catch (error) {
    console.error("Error loading packages:", error);
    container.innerHTML = '<p class="text-center text-red-400 py-8">Error loading packages</p>';
  }
}

// ---------- Alfa Gifts Packages ----------
async function applyAlfaPromoCode() {
  const input = $("#alfa-promo-code-input");
  const message = $("#alfa-promo-message");
  const applyBtn = $("#alfa-apply-promo-btn");
  
  if (!input || !message) return;
  
  const code = input.value.trim();
  
  if (code === "") {
    message.innerHTML = '<span class="text-red-400">Please enter a promo code</span>';
    return;
  }
  
  try {
    // Load promo code from Firebase
    const promoDoc = await db.collection("settings").doc("promoCode").get();
    
    if (promoDoc.exists) {
      const promoData = promoDoc.data();
      
      if (promoData.code === code && promoData.active) {
  alfaPromoCodeApplied = true;
  alfaPromoDiscount = promoData.discount; // amount LBP
  message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promoData.discount).toLocaleString()} LBP off on all packages</span>`;
        input.disabled = true;
        if (applyBtn) applyBtn.disabled = true;
        renderAlfaPackages(); // Re-render with discount
      } else {
        message.innerHTML = '<span class="text-red-400">Invalid promo code</span>';
      }
    } else {
      message.innerHTML = '<span class="text-red-400">Invalid promo code</span>';
    }
  } catch (error) {
    console.error("Error checking promo code:", error);
    message.innerHTML = '<span class="text-red-400">Error validating promo code</span>';
  }
}

async function renderAlfaPackages() {
  const container = $("#alfa-packages-list");
  if (!container) return;
  
  container.innerHTML = '<p class="text-center text-gray-400 py-8">Loading packages...</p>';
  
  try {
    // Load packages from Firebase
    const packagesSnap = await db.collection("packages")
      .where("type", "==", "alfa-gift")
      .where("active", "==", true)
      .get();
    
    let packages = [];
    packagesSnap.forEach(doc => {
      packages.push({ id: doc.id, packageId: doc.id, ...doc.data() });
    });
    
    // Sort by size
    packages.sort((a, b) => (a.sizeGB || 0) - (b.sizeGB || 0));
    
    if (packages.length === 0) {
      container.innerHTML = '<p class="text-center text-gray-400 py-8">No packages available</p>';
      return;
    }
    
    container.innerHTML = "";
    packages.forEach((p, idx) => {
      const originalPrice = p.priceLBP;
      const discountedPrice = alfaPromoCodeApplied ? originalPrice * (1 - alfaPromoDiscount) : originalPrice;
      const hasDiscount = alfaPromoCodeApplied;
      
      // Determine availability status
      const qty = p.quantity !== undefined ? p.quantity : 0;
      let availabilityBadge = '';
      let buttonDisabled = '';
      let buttonClass = 'bg-blue-600 hover:bg-blue-700 text-white';
      
      if (qty === 0) {
        availabilityBadge = '<div class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">Sold Out</div>';
        buttonDisabled = 'disabled';
        buttonClass = 'bg-gray-400 cursor-not-allowed text-gray-700';
      } else if (qty <= 2) {
        availabilityBadge = '<div class="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">Low Stock</div>';
      } else {
        availabilityBadge = '<div class="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">Available</div>';
      }
    
      const card = document.createElement("div");
      card.className = "card-bg border border-navy-600 rounded-2xl p-5 flex flex-col relative overflow-hidden";
      card.innerHTML = `
        <div class="absolute top-4 right-4 opacity-10 z-0">
          <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4zm10 16H4V9h16v11z"/>
          </svg>
        </div>
        ${availabilityBadge}
  ${hasDiscount ? '<div class="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">' + Number(alfaPromoDiscount).toLocaleString() + ' LBP off</div>' : ''}
        <div class="flex items-center space-x-2 mb-2 mt-6">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4zm10 16H4V9h16v11z"/>
          </svg>
          <span class="text-lg font-semibold">${p.sizeGB}GB</span>
        </div>
        <div class="text-sm text-gray-400 mb-3">Gift Package</div>
        <div class="mb-4">
          ${hasDiscount ? `<div class="text-sm text-gray-500 line-through">${formatLBP(originalPrice)}</div>` : ''}
          <div class="text-2xl font-bold ${hasDiscount ? 'text-green-400' : ''}">${formatLBP(discountedPrice)}</div>
        </div>
        <button data-idx="${idx}" data-price="${discountedPrice}" data-package-id="${p.id || ''}" ${buttonDisabled} class="alfa-pkg-buy w-full py-2.5 rounded-lg ${buttonClass} font-semibold flex items-center justify-center space-x-2 transition-colors mt-auto">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <span>${qty === 0 ? 'Sold Out' : 'Recharge'}</span>
        </button>`;
      container.appendChild(card);
    });

    container.querySelectorAll(".alfa-pkg-buy").forEach((btn) => btn.addEventListener("click", () => {
      const idx = btn.getAttribute("data-idx");
      const p = packages[idx];
      const discountedPrice = parseFloat(btn.getAttribute("data-price"));
      openAlfaPurchaseModal({ ...p, priceLBP: discountedPrice });
    }));
    
    // Add promo code button handler
    const applyBtn = $("#alfa-apply-promo-btn");
    if (applyBtn) {
      applyBtn.addEventListener("click", applyAlfaPromoCode);
    }
    
    // Allow Enter key to apply promo code
    const promoInput = $("#alfa-promo-code-input");
    if (promoInput) {
      promoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          applyAlfaPromoCode();
        }
      });
    }
  } catch (error) {
    console.error("Error loading Alfa packages:", error);
    container.innerHTML = '<p class="text-center text-red-400 py-8">Error loading packages</p>';
  }
}

// ---------- Open Services Packages ----------
async function applyOpenPromoCode() {
  const input = $("#open-promo-code-input");
  const message = $("#open-promo-message");
  const applyBtn = $("#open-apply-promo-btn");
  
  if (!input || !message) return;
  
  const code = input.value.trim();
  
  if (code === "") {
    message.innerHTML = '<span class="text-red-400">Please enter a promo code</span>';
    return;
  }
  
  try {
    // Load promo code from Firebase
    const promoDoc = await db.collection("settings").doc("promoCode").get();
    
    if (promoDoc.exists) {
      const promoData = promoDoc.data();
      
      if (promoData.code === code && promoData.active) {
  openPromoCodeApplied = true;
  openPromoDiscount = promoData.discount; // amount LBP
  message.innerHTML = `<span class="text-green-400">✓ Promo code applied! ${Number(promoData.discount).toLocaleString()} LBP off on all packages</span>`;
        input.disabled = true;
        if (applyBtn) applyBtn.disabled = true;
        renderOpenPackages(); // Re-render with discount
      } else {
        message.innerHTML = '<span class="text-red-400">Invalid promo code</span>';
      }
    } else {
      message.innerHTML = '<span class="text-red-400">Invalid promo code</span>';
    }
  } catch (error) {
    console.error("Error checking promo code:", error);
    message.innerHTML = '<span class="text-red-400">Error validating promo code</span>';
  }
}

async function renderOpenPackages() {
  const container = $("#open-packages-list");
  if (!container) return;
  
  container.innerHTML = '<p class="text-center text-gray-400 py-8">Loading packages...</p>';
  
  try {
    // Load packages from Firebase
    const packagesSnap = await db.collection("packages")
      .where("type", "==", "open-service")
      .where("active", "==", true)
      .get();
    
    let packages = [];
    packagesSnap.forEach(doc => {
      packages.push({ id: doc.id, packageId: doc.id, ...doc.data() });
    });
    
    // Sort by size
    packages.sort((a, b) => (a.sizeGB || 0) - (b.sizeGB || 0));
    
    if (packages.length === 0) {
      container.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-16">
          <svg class="w-24 h-24 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
          </svg>
          <h4 class="text-xl font-semibold mb-2">No Packages Available</h4>
          <p class="text-gray-400 text-center">Check back later for available packages</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = "";
    packages.forEach((p, idx) => {
      const originalPrice = p.priceLBP;
      const discountedPrice = openPromoCodeApplied ? originalPrice * (1 - openPromoDiscount) : originalPrice;
      const hasDiscount = openPromoCodeApplied;
      
      // Determine availability status
      const qty = p.quantity !== undefined ? p.quantity : 0;
      let availabilityBadge = '';
      let buttonDisabled = '';
      let buttonClass = 'bg-blue-600 hover:bg-blue-700 text-white';
      
      if (qty === 0) {
        availabilityBadge = '<div class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">Sold Out</div>';
        buttonDisabled = 'disabled';
        buttonClass = 'bg-gray-400 cursor-not-allowed text-gray-700';
      } else if (qty <= 2) {
        availabilityBadge = '<div class="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">Low Stock</div>';
      } else {
        availabilityBadge = '<div class="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">Available</div>';
      }
      
      const card = document.createElement("div");
      card.className = "card-bg border border-navy-600 rounded-2xl p-5 flex flex-col relative overflow-hidden";
      card.innerHTML = `
        <div class="absolute top-4 right-4 opacity-10 z-0">
          <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
          </svg>
        </div>
        ${availabilityBadge}
  ${hasDiscount ? '<div class="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">' + Number(openPromoDiscount).toLocaleString() + ' LBP off</div>' : ''}
        <div class="flex items-center space-x-2 mb-2 mt-6">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-7.24 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
          </svg>
          <span class="text-lg font-semibold">${p.sizeGB}GB</span>
        </div>
        <div class="text-sm text-gray-400 mb-3">Open Service Package</div>
        <div class="mb-4">
          ${hasDiscount ? `<div class="text-sm text-gray-500 line-through">${formatLBP(originalPrice)}</div>` : ''}
          <div class="text-2xl font-bold ${hasDiscount ? 'text-green-400' : ''}">${formatLBP(discountedPrice)}</div>
        </div>
        <button data-idx="${idx}" data-price="${discountedPrice}" data-package-id="${p.id || ''}" ${buttonDisabled} class="open-pkg-buy w-full py-2.5 rounded-lg ${buttonClass} font-semibold flex items-center justify-center space-x-2 transition-colors mt-auto">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <span>${qty === 0 ? 'Sold Out' : 'Purchase'}</span>
        </button>`;
      container.appendChild(card);
    });

    container.querySelectorAll(".open-pkg-buy").forEach((btn) => btn.addEventListener("click", () => {
      const idx = btn.getAttribute("data-idx");
      const p = packages[idx];
      const discountedPrice = parseFloat(btn.getAttribute("data-price"));
      openPurchaseModal({ ...p, priceLBP: discountedPrice });
    }));
    
    // Add promo code button handler
    const applyBtn = $("#open-apply-promo-btn");
    if (applyBtn) {
      applyBtn.addEventListener("click", applyOpenPromoCode);
    }
    
    // Allow Enter key to apply promo code
    const promoInput = $("#open-promo-code-input");
    if (promoInput) {
      promoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          applyOpenPromoCode();
        }
      });
    }
    
  } catch (error) {
    console.error("Error loading Open Services packages:", error);
    container.innerHTML = '<p class="text-center text-red-400 py-8">Error loading packages</p>';
  }
}

// ---------- Purchase Modal ----------
let currentPurchase = null;
function openPurchaseModal(pkg) {
  currentPurchase = pkg;
  $("#purchase-summary").textContent = `You are about to purchase ${pkg.sizeGB}GB for ${formatLBP(pkg.priceLBP)}`;
  $("#purchase-phone").value = "";
  $("#purchase-error").textContent = "";
  
  // Reset payment confirmation state
  const confirmPaymentBtn = $("#confirm-payment-btn");
  const secondaryPhoneSection = $("#secondary-phone-section");
  const purchasePhoneInput = $("#purchase-phone");
  
  if (confirmPaymentBtn) {
    confirmPaymentBtn.classList.remove("bg-gray-600", "cursor-not-allowed");
    confirmPaymentBtn.classList.add("bg-green-600", "hover:bg-green-700");
    confirmPaymentBtn.disabled = false;
    confirmPaymentBtn.innerHTML = '<i data-feather="check-circle" class="w-5 h-5"></i><span>I have transferred the money</span>';
  }
  
  if (secondaryPhoneSection) {
    secondaryPhoneSection.classList.add("opacity-50", "pointer-events-none");
    // Re-add warning text if it doesn't exist
    if (!secondaryPhoneSection.querySelector(".text-xs")) {
      const warning = document.createElement("p");
      warning.className = "text-xs text-gray-500 mt-1";
      warning.textContent = "⚠️ Please confirm payment first";
      secondaryPhoneSection.appendChild(warning);
    }
  }
  
  if (purchasePhoneInput) {
    purchasePhoneInput.disabled = true;
  }
  
  const modal = $("#purchase-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  
  // Re-initialize feather icons
  if (window.feather) feather.replace();
}

function closePurchaseModal() {
  const modal = $("#purchase-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function initPurchaseModal(uid) {
  // Copy number button
  const copyBtn = $("#copy-number-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const number = "03475704";
      try {
        await navigator.clipboard.writeText(number);
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i data-feather="check" class="w-5 h-5"></i>';
        if (window.feather) feather.replace();
        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
          if (window.feather) feather.replace();
        }, 2000);
      } catch (err) {
        alert("Number copied: " + number);
      }
    });
  }
  
  // Payment confirmation button
  const confirmPaymentBtn = $("#confirm-payment-btn");
  const secondaryPhoneSection = $("#secondary-phone-section");
  const purchasePhoneInput = $("#purchase-phone");
  
  if (confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener("click", () => {
      // Enable the secondary phone section
      if (secondaryPhoneSection) {
        secondaryPhoneSection.classList.remove("opacity-50", "pointer-events-none");
      }
      if (purchasePhoneInput) {
        purchasePhoneInput.disabled = false;
        purchasePhoneInput.focus();
      }
      
      // Change button to confirmed state
      confirmPaymentBtn.classList.remove("bg-green-600", "hover:bg-green-700");
      confirmPaymentBtn.classList.add("bg-gray-600", "cursor-not-allowed");
      confirmPaymentBtn.disabled = true;
      confirmPaymentBtn.innerHTML = '<i data-feather="check" class="w-5 h-5"></i><span>Payment Confirmed ✓</span>';
      if (window.feather) feather.replace();
      
      // Remove warning text
      const warningText = secondaryPhoneSection?.querySelector(".text-xs");
      if (warningText) warningText.remove();
    });
  }
  
  $("#purchase-cancel").addEventListener("click", closePurchaseModal);
  
  $("#purchase-confirm").addEventListener("click", async () => {
    // CRITICAL: Check iOS FIRST
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isIOS) {
      // iOS: Open immediately
      const phone = $("#purchase-phone")?.value?.trim() || "";
      const packageSize = currentPurchase?.sizeGB || "N/A";
      const packagePrice = currentPurchase?.priceLBP || 0;
      const message = `New Purchase Request\n\nPackage: ${packageSize}GB\nPrice: ${formatLBP(packagePrice)}\nPhone: ${phone}\n\nI'll send you the proof image.`;
      const whatsappUrl = `https://wa.me/96103475704?text=${encodeURIComponent(message)}`;
      
      // Background save
      const phoneValue = phone;
      const purchaseData = currentPurchase;
      const userId = uid;
      (async () => {
        try {
          await db.collection("orders").add({
            uid: userId,
            packageSizeGB: purchaseData?.sizeGB,
            priceLBP: purchaseData?.priceLBP,
            packageId: purchaseData?.packageId || null,
            secondaryPhone: phoneValue,
            type: purchaseData?.type || "closed-service",
            status: "pending",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        } catch (err) {
          console.error("Order save error:", err);
        }
      })();
      
      window.location = whatsappUrl;
      return;
    }
    
    // Non-iOS flow
    const phone = $("#purchase-phone").value.trim();
    if (!isValidLebPhone8(phone)) {
      $("#purchase-error").textContent = "Phone must be 8 digits (no +961 or leading 0)";
      return;
    }
    if (!currentPurchase) return;

    try {
      const userDoc = await db.collection("users").doc(uid).get();
      const userData = userDoc.data() || {};
      const userName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "User";
      
      const ref = await db.collection("orders").add({
        uid,
        packageSizeGB: currentPurchase.sizeGB,
        priceLBP: currentPurchase.priceLBP,
        packageId: currentPurchase.packageId || null,
        secondaryPhone: phone,
        status: "pending",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      
      if (currentPurchase.packageId) {
        try {
          const packageRef = db.collection("packages").doc(currentPurchase.packageId);
          await packageRef.update({
            quantity: firebase.firestore.FieldValue.increment(-1)
          });
        } catch (error) {
          console.error("Error decreasing package quantity:", error);
        }
      }
      
      const message = `New Purchase Request

 Name: ${userName}
 Package: ${currentPurchase.sizeGB}GB
 Price: ${formatLBP(currentPurchase.priceLBP)}
 Secondary Phone: ${phone}

I'll send you the proof image.`;

      const whatsappUrl = `https://wa.me/96103475704?text=${encodeURIComponent(message)}`;
      openWhatsApp(whatsappUrl);
      closePurchaseModal();
      
      requestAnimationFrame(() => {
        setTimeout(() => {
          alert("✅ Order saved! WhatsApp opened - please send your transfer proof image.");
        }, 1000);
      });
    } catch (e) {
      $("#purchase-error").textContent = e.message || "Failed to submit order";
    }
  });
}

// ---------- Alfa Gifts Purchase Modal ----------
let currentAlfaPurchase = null;
function openAlfaPurchaseModal(pkg) {
  currentAlfaPurchase = pkg;
  $("#alfa-purchase-summary").textContent = `You are about to purchase ${pkg.sizeGB}GB for ${formatLBP(pkg.priceLBP)}`;
  $("#alfa-purchase-phone").value = "";
  $("#alfa-purchase-error").textContent = "";
  
  // Reset payment confirmation state
  const confirmPaymentBtn = $("#alfa-confirm-payment-btn");
  const phoneSection = $("#alfa-phone-section");
  const purchasePhoneInput = $("#alfa-purchase-phone");
  
  if (confirmPaymentBtn) {
    confirmPaymentBtn.classList.remove("bg-gray-600", "cursor-not-allowed");
    confirmPaymentBtn.classList.add("bg-green-600", "hover:bg-green-700");
    confirmPaymentBtn.disabled = false;
    confirmPaymentBtn.innerHTML = '<i data-feather="check-circle" class="w-5 h-5"></i><span>I have transferred the money</span>';
  }
  
  if (phoneSection) {
    phoneSection.classList.add("opacity-50", "pointer-events-none");
    // Re-add warning text if it doesn't exist
    const warnings = phoneSection.querySelectorAll(".text-xs");
    if (warnings.length < 2) {
      phoneSection.innerHTML = `
        <label class="block text-sm mb-2 text-gray-300">Phone Number</label>
        <input id="alfa-purchase-phone" inputmode="numeric" pattern="^\\d{8}$" placeholder="70xxxxxx" class="w-full px-4 py-3 rounded-lg input-dark" disabled>
        <p class="text-xs text-gray-500 mt-1">⚠️ Please confirm payment first</p>
        <p class="text-xs text-gray-400 mt-1">Please enter a valid phone number</p>
      `;
    }
  }
  
  if (purchasePhoneInput) {
    purchasePhoneInput.disabled = true;
  }
  
  const modal = $("#alfa-purchase-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  
  // Re-initialize feather icons
  if (window.feather) feather.replace();
}

function closeAlfaPurchaseModal() {
  const modal = $("#alfa-purchase-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function initAlfaPurchaseModal(uid) {
  // Copy number button
  const copyBtn = $("#alfa-copy-number-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const number = "03475704";
      try {
        await navigator.clipboard.writeText(number);
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i data-feather="check" class="w-5 h-5"></i>';
        if (window.feather) feather.replace();
        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
          if (window.feather) feather.replace();
        }, 2000);
      } catch (err) {
        alert("Number copied: " + number);
      }
    });
  }
  
  // Payment confirmation button
  const confirmPaymentBtn = $("#alfa-confirm-payment-btn");
  const phoneSection = $("#alfa-phone-section");
  const purchasePhoneInput = $("#alfa-purchase-phone");
  
  if (confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener("click", () => {
      // Enable the phone section
      if (phoneSection) {
        phoneSection.classList.remove("opacity-50", "pointer-events-none");
      }
      if (purchasePhoneInput) {
        purchasePhoneInput.disabled = false;
        purchasePhoneInput.focus();
      }
      
      // Change button to confirmed state
      confirmPaymentBtn.classList.remove("bg-green-600", "hover:bg-green-700");
      confirmPaymentBtn.classList.add("bg-gray-600", "cursor-not-allowed");
      confirmPaymentBtn.disabled = true;
      confirmPaymentBtn.innerHTML = '<i data-feather="check" class="w-5 h-5"></i><span>Payment Confirmed ✓</span>';
      if (window.feather) feather.replace();
      
      // Remove first warning text only
      const warnings = phoneSection?.querySelectorAll(".text-xs");
      if (warnings && warnings.length > 0) {
        warnings[0].remove();
      }
    });
  }
  
  $("#alfa-purchase-cancel").addEventListener("click", closeAlfaPurchaseModal);
  
  $("#alfa-purchase-confirm").addEventListener("click", async () => {
    // CRITICAL: Check iOS FIRST
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isIOS) {
      // iOS: Open immediately
      const phone = $("#alfa-purchase-phone")?.value?.trim() || "";
      const packageSize = currentAlfaPurchase?.sizeGB || "N/A";
      const packagePrice = currentAlfaPurchase?.priceLBP || 0;
      const message = `New Alfa Gift Purchase Request\n\nPackage: ${packageSize}GB\nPrice: ${formatLBP(packagePrice)}\nPhone: ${phone}\n\nI'll send you the proof image.`;
      const whatsappUrl = `https://wa.me/96103475704?text=${encodeURIComponent(message)}`;
      
      // Background save
      const phoneValue = phone;
      const purchaseData = currentAlfaPurchase;
      const userId = uid;
      (async () => {
        try {
          await db.collection("orders").add({
            uid: userId,
            packageSizeGB: purchaseData?.sizeGB,
            priceLBP: purchaseData?.priceLBP,
            packageId: purchaseData?.packageId || null,
            phone: phoneValue,
            type: "alfa-gift",
            status: "pending",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
          if (purchaseData?.packageId) {
            try {
              await db.collection("packages").doc(purchaseData.packageId).update({
                quantity: firebase.firestore.FieldValue.increment(-1)
              });
            } catch (err) {}
          }
        } catch (err) {
          console.error("Order save error:", err);
        }
      })();
      
      window.location = whatsappUrl;
      return;
    }
    
    // Non-iOS flow
    const phone = $("#alfa-purchase-phone").value.trim();
    if (!isValidLebPhone8(phone)) {
      $("#alfa-purchase-error").textContent = "Phone must be 8 digits (no +961 or leading 0)";
      return;
    }
    if (!currentAlfaPurchase) return;

    try {
      const userDoc = await db.collection("users").doc(uid).get();
      const userData = userDoc.data() || {};
      const userName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "User";
      
      const ref = await db.collection("orders").add({
        uid,
        packageSizeGB: currentAlfaPurchase.sizeGB,
        priceLBP: currentAlfaPurchase.priceLBP,
        packageId: currentAlfaPurchase.packageId || null,
        phone: phone,
        type: "alfa-gift",
        status: "pending",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      
      if (currentAlfaPurchase.packageId) {
        try {
          const packageRef = db.collection("packages").doc(currentAlfaPurchase.packageId);
          await packageRef.update({
            quantity: firebase.firestore.FieldValue.increment(-1)
          });
        } catch (error) {
          console.error("Error decreasing package quantity:", error);
        }
      }
      
      const message = `New Alfa Gift Purchase Request

 Name: ${userName}
 Package: ${currentAlfaPurchase.sizeGB}GB
 Price: ${formatLBP(currentAlfaPurchase.priceLBP)}
 Phone Number: ${phone}

I'll send you the proof image.`;

      const whatsappUrl = `https://wa.me/96103475704?text=${encodeURIComponent(message)}`;
      openWhatsApp(whatsappUrl);
      closeAlfaPurchaseModal();
      
      requestAnimationFrame(() => {
        setTimeout(() => {
          alert("✅ Order saved! WhatsApp opened - please send your transfer proof image.");
        }, 1000);
      });
    } catch (e) {
      $("#alfa-purchase-error").textContent = e.message || "Failed to submit order";
    }
  });
}

// ---------- Credits Page ----------
function initCreditsPage(uid) {
  console.log("Initializing credits page");
  
  // Credit pricing system
  const creditPrices = {
    1: 120000,
    2: 220000,
    3: 300000,
    4: 420000,
    5: 520000,
    6: 600000,
    7: 720000,
    8: 820000,
    9: 900000,
    10: 1020000
  };
  
  // Calculate price for any number of credits
  function calculateCreditsPrice(credits) {
    if (credits <= 10 && creditPrices[credits]) {
      return creditPrices[credits];
    }
    
    // For more than 10 credits, use the formula based on 2-credit packages
    // Example: 14 credits = 7 packages of 2 credits = 7 * 220,000 = 1,540,000 LBP
    // Example: 18 credits = 9 packages of 2 credits = 9 * 220,000 = 1,980,000 LBP
    const packages = Math.ceil(credits / 2);
    return packages * 220000;
  }
  
  // Copy button
  const copyBtn = $("#credits-copy-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const number = "03475704";
      try {
        await navigator.clipboard.writeText(number);
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i data-feather="check" class="w-5 h-5"></i>';
        if (window.feather) feather.replace();
        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
          if (window.feather) feather.replace();
        }, 2000);
      } catch (err) {
        alert("Number copied: " + number);
      }
    });
  }
  
  // Form elements
  const phoneInput = $("#credits-phone-input");
  const amountInput = $("#credits-amount-input");
  const priceDisplay = $("#credits-price-display");
  const totalPrice = $("#credits-total-price");
  const showPriceBtn = $("#credits-show-price-btn");
  const confirmBtn = $("#credits-confirm-btn");
  const submitBtn = $("#credits-submit-btn");
  const cancelBtn = $("#credits-cancel-btn");
  const formSection = $("#credits-form-section");
  
  // Enable/disable show price button based on credits input
  if (amountInput && showPriceBtn) {
    // Initial state - disable if no value
    if (!amountInput.value || parseInt(amountInput.value) <= 0) {
      showPriceBtn.disabled = true;
    }
    
    amountInput.addEventListener("input", () => {
      const credits = parseInt(amountInput.value);
      if (credits && credits > 0) {
        showPriceBtn.disabled = false;
        // Hide price display when input changes
        if (priceDisplay) {
          priceDisplay.classList.add("hidden");
        }
      } else {
        showPriceBtn.disabled = true;
        if (priceDisplay) {
          priceDisplay.classList.add("hidden");
        }
      }
    });
  }
  
  // Show price button click handler
  if (showPriceBtn) {
    showPriceBtn.addEventListener("click", () => {
      const credits = parseInt(amountInput.value);
      if (credits && credits > 0) {
        const price = calculateCreditsPrice(credits);
        if (totalPrice) {
          totalPrice.textContent = formatLBP(price);
        }
        if (priceDisplay) {
          priceDisplay.classList.remove("hidden");
        }
      } else {
        $("#credits-error").textContent = "Please enter a valid number of credits";
      }
    });
  }
  
  // Payment confirmation button
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      // Clear any previous errors
      $("#credits-error").textContent = "";
      
      // Enable form section
      if (formSection) {
        formSection.classList.remove("opacity-50", "pointer-events-none");
      }
      if (phoneInput) {
        phoneInput.disabled = false;
        phoneInput.focus();
      }
      if (amountInput) {
        amountInput.disabled = false;
      }
      if (showPriceBtn) {
        showPriceBtn.disabled = false;
      }
      
      // Change button state
      confirmBtn.classList.remove("bg-green-600", "hover:bg-green-700");
      confirmBtn.classList.add("bg-gray-600", "cursor-not-allowed");
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = '<i data-feather="check" class="w-5 h-5"></i><span>Payment Confirmed ✓</span>';
      if (window.feather) feather.replace();
      
      // Remove warning text
      const warning = formSection?.querySelector(".text-gray-500");
      if (warning) warning.remove();
    });
  }
  
  // Cancel button
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      // Reset form
      if (phoneInput) {
        phoneInput.value = "";
        phoneInput.disabled = true;
      }
      if (amountInput) {
        amountInput.value = "";
        amountInput.disabled = true;
      }
      if (showPriceBtn) {
        showPriceBtn.disabled = true;
      }
      $("#credits-error").textContent = "";
      if (priceDisplay) {
        priceDisplay.classList.add("hidden");
      }
      
      // Reset form section
      if (formSection) {
        formSection.classList.add("opacity-50", "pointer-events-none");
      }
      
      // Reset confirmation button
      if (confirmBtn) {
        confirmBtn.classList.remove("bg-gray-600", "cursor-not-allowed");
        confirmBtn.classList.add("bg-green-600", "hover:bg-green-700");
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<i data-feather="check-circle" class="w-5 h-5"></i><span>I have transferred the money</span>';
        if (window.feather) feather.replace();
      }
    });
  }
  
  // Submit button
  if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
      // CRITICAL: Check iOS FIRST
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      if (isIOS) {
        // iOS: Open immediately
        const phone = phoneInput?.value?.trim() || "";
        const creditsAmount = amountInput?.value?.trim() || "0";
        const credits = parseInt(creditsAmount) || 0;
        const price = credits > 0 ? calculateCreditsPrice(credits) : 0;
        const message = `New Credits Purchase Request\n\nCredits: ${credits}\nPrice: ${formatLBP(price)}\nPhone: ${phone}\n\nI'll send you the proof image.`;
        const whatsappUrl = `https://wa.me/96103475704?text=${encodeURIComponent(message)}`;
        
        // Background save
        (async () => {
          try {
            await db.collection("orders").add({
              uid,
              phone: phone,
              creditsAmount: credits,
              priceLBP: price,
              type: "credits",
              status: "pending",
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
          } catch (err) {
            console.error("Order save error:", err);
          }
        })();
        
        window.location = whatsappUrl;
        return;
      }
      
      // Non-iOS flow
      const phone = phoneInput?.value.trim();
      if (!isValidLebPhone8(phone)) {
        $("#credits-error").textContent = "Phone must be 8 digits (no +961 or leading 0)";
        return;
      }
      
      const creditsAmount = amountInput?.value.trim();
      if (!creditsAmount || parseInt(creditsAmount) < 1) {
        $("#credits-error").textContent = "Please enter a valid number of credits";
        return;
      }
      
      if (!confirmBtn.disabled) {
        $("#credits-error").textContent = "Please confirm payment first";
        return;
      }
      
      try {
        const userDoc = await db.collection("users").doc(uid).get();
        const userData = userDoc.data() || {};
        const userName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "User";
        
        const credits = parseInt(creditsAmount);
        const price = calculateCreditsPrice(credits);
        
        await db.collection("orders").add({
          uid,
          phone: phone,
          creditsAmount: credits,
          priceLBP: price,
          type: "credits",
          status: "pending",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        
        const message = `New Purchase Request

Name: ${userName}
Number of credits: ${credits}
Price: ${formatLBP(price)}
Number he entered: ${phone}

I'll send you the proof image`;

        const whatsappUrl = `https://wa.me/96103475704?text=${encodeURIComponent(message)}`;
        openWhatsApp(whatsappUrl);
        
        if (cancelBtn) cancelBtn.click();
        
        requestAnimationFrame(() => {
          setTimeout(() => {
            alert("✅ Order saved! WhatsApp opened - please send your transfer proof image.");
          }, 1000);
        });
      } catch (e) {
        $("#credits-error").textContent = e.message || "Failed to submit order";
      }
    });
  }
}

// ---------- Validity Page ----------
function initValidityPage(uid) {
  console.log("Initializing validity page");
  
  // Copy number button
  const copyBtn = $("#validity-copy-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const number = "03475704";
      try {
        await navigator.clipboard.writeText(number);
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i data-feather="check" class="w-5 h-5"></i>';
        if (window.feather) feather.replace();
        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
          if (window.feather) feather.replace();
        }, 2000);
      } catch (err) {
        alert("Number copied: " + number);
      }
    });
  }
  
  // Payment confirmation button
  const confirmBtn = $("#validity-confirm-btn");
  const formSection = $("#validity-form-section");
  const phoneInput = $("#validity-phone-input");
  
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      // Enable form section
      if (formSection) {
        formSection.classList.remove("opacity-50", "pointer-events-none");
      }
      if (phoneInput) {
        phoneInput.disabled = false;
        phoneInput.focus();
      }
      
      // Change button state
      confirmBtn.classList.remove("bg-green-600", "hover:bg-green-700");
      confirmBtn.classList.add("bg-gray-600", "cursor-not-allowed");
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = '<i data-feather="check" class="w-5 h-5"></i><span>Payment Confirmed ✓</span>';
      if (window.feather) feather.replace();
      
      // Remove warning text
      const warning = formSection?.querySelector(".text-gray-500");
      if (warning) warning.remove();
    });
  }
  
  // Cancel button
  const cancelBtn = $("#validity-cancel-btn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      // Reset form
      if (phoneInput) phoneInput.value = "";
      $("#validity-error").textContent = "";
      
      // Reset confirmation button
      if (confirmBtn) {
        confirmBtn.classList.remove("bg-gray-600", "cursor-not-allowed");
        confirmBtn.classList.add("bg-green-600", "hover:bg-green-700");
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<i data-feather="check-circle" class="w-5 h-5"></i><span>I have transferred the money</span>';
        if (window.feather) feather.replace();
      }
      
      // Disable form section
      if (formSection) {
        formSection.classList.add("opacity-50", "pointer-events-none");
        // Re-add warning if not exists
        if (!formSection.querySelector(".text-gray-500")) {
          const warning = document.createElement("p");
          warning.className = "text-xs text-gray-500 flex items-center gap-2";
          warning.innerHTML = '<i data-feather="alert-circle" class="w-4 h-4"></i><span>Please confirm payment first</span>';
          formSection.appendChild(warning);
          if (window.feather) feather.replace();
        }
      }
      if (phoneInput) phoneInput.disabled = true;
    });
  }
  
  // Submit button
  const submitBtn = $("#validity-submit-btn");
  if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
      // CRITICAL: Check iOS FIRST
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      if (isIOS) {
        // iOS: Open immediately
        const phone = phoneInput?.value?.trim() || "";
        const message = `New Validity Purchase Request\n\nPhone: ${phone}\n\nI'll send you the proof image.`;
        const whatsappUrl = `https://wa.me/96103475704?text=${encodeURIComponent(message)}`;
        
        // Background save
        (async () => {
          try {
            await db.collection("orders").add({
              uid,
              phone: phone,
              type: "validity",
              status: "pending",
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
          } catch (err) {
            console.error("Order save error:", err);
          }
        })();
        
        window.location = whatsappUrl;
        return;
      }
      
      // Non-iOS flow
      const phone = phoneInput?.value.trim();
      if (!isValidLebPhone8(phone)) {
        $("#validity-error").textContent = "Phone must be 8 digits (no +961 or leading 0)";
        return;
      }
      
      try {
        const userDoc = await db.collection("users").doc(uid).get();
        const userData = userDoc.data() || {};
        const userName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "User";
        
        await db.collection("orders").add({
          uid,
          phone: phone,
          type: "validity",
          status: "pending",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        
        const message = `New Validity Purchase Request

 Name: ${userName}
 Phone Number: ${phone}

I'll send you the proof image.`;

        const whatsappUrl = `https://wa.me/96103475704?text=${encodeURIComponent(message)}`;
        openWhatsApp(whatsappUrl);
        
        if (cancelBtn) cancelBtn.click();
        
        requestAnimationFrame(() => {
          setTimeout(() => {
            alert("✅ Order saved! WhatsApp opened - please send your transfer proof image.");
          }, 1000);
        });
      } catch (e) {
        $("#validity-error").textContent = e.message || "Failed to submit order";
      }
    });
  }
}

// ---------- Credits Purchase Modal ----------
let currentCreditsPurchase = null;
function openCreditsPurchaseModal(pkg) {
  currentCreditsPurchase = pkg;
  $("#credits-purchase-summary").textContent = `You are about to purchase ${pkg.sizeGB}GB for ${formatLBP(pkg.priceLBP)}`;
  $("#credits-purchase-phone").value = "";
  $("#credits-purchase-amount").value = "";
  $("#credits-purchase-error").textContent = "";
  
  // Reset payment confirmation state
  const confirmPaymentBtn = $("#credits-confirm-payment-btn");
  const inputsSection = $("#credits-inputs-section");
  const purchasePhoneInput = $("#credits-purchase-phone");
  const purchaseAmountInput = $("#credits-purchase-amount");
  
  if (confirmPaymentBtn) {
    confirmPaymentBtn.classList.remove("bg-gray-600", "cursor-not-allowed");
    confirmPaymentBtn.classList.add("bg-green-600", "hover:bg-green-700");
    confirmPaymentBtn.disabled = false;
    confirmPaymentBtn.innerHTML = '<i data-feather="check-circle" class="w-5 h-5"></i><span>I have transferred the money</span>';
  }
  
  if (inputsSection) {
    inputsSection.classList.add("opacity-50", "pointer-events-none");
  }
  
  if (purchasePhoneInput) {
    purchasePhoneInput.disabled = true;
  }
  
  if (purchaseAmountInput) {
    purchaseAmountInput.disabled = true;
  }
  
  const modal = $("#credits-purchase-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  
  // Re-initialize feather icons
  if (window.feather) feather.replace();
}

function closeCreditsPurchaseModal() {
  const modal = $("#credits-purchase-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function initCreditsPurchaseModal(uid) {
  // Copy number button
  const copyBtn = $("#credits-copy-number-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const number = "03475704";
      try {
        await navigator.clipboard.writeText(number);
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i data-feather="check" class="w-5 h-5"></i>';
        if (window.feather) feather.replace();
        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
          if (window.feather) feather.replace();
        }, 2000);
      } catch (err) {
        alert("Number copied: " + number);
      }
    });
  }
  
  // Payment confirmation button
  const confirmPaymentBtn = $("#credits-confirm-payment-btn");
  const inputsSection = $("#credits-inputs-section");
  const purchasePhoneInput = $("#credits-purchase-phone");
  const purchaseAmountInput = $("#credits-purchase-amount");
  
  if (confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener("click", () => {
      // Enable the inputs section
      if (inputsSection) {
        inputsSection.classList.remove("opacity-50", "pointer-events-none");
      }
      if (purchasePhoneInput) {
        purchasePhoneInput.disabled = false;
        purchasePhoneInput.focus();
      }
      if (purchaseAmountInput) {
        purchaseAmountInput.disabled = false;
      }
      
      // Change button to confirmed state
      confirmPaymentBtn.classList.remove("bg-green-600", "hover:bg-green-700");
      confirmPaymentBtn.classList.add("bg-gray-600", "cursor-not-allowed");
      confirmPaymentBtn.disabled = true;
      confirmPaymentBtn.innerHTML = '<i data-feather="check" class="w-5 h-5"></i><span>Payment Confirmed ✓</span>';
      if (window.feather) feather.replace();
      
      // Remove warning text
      const warnings = inputsSection?.querySelectorAll(".text-xs.text-gray-500");
      if (warnings && warnings.length > 0) {
        warnings[0].remove();
      }
    });
  }
  
  $("#credits-purchase-cancel").addEventListener("click", closeCreditsPurchaseModal);
  
  $("#credits-purchase-confirm").addEventListener("click", async () => {
    // CRITICAL: Check iOS FIRST
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isIOS) {
      // iOS: Open immediately
      const phone = $("#credits-purchase-phone")?.value?.trim() || "";
      const creditsAmount = $("#credits-purchase-amount")?.value?.trim() || "0";
      const packageSize = currentCreditsPurchase?.sizeGB || "N/A";
      const packagePrice = currentCreditsPurchase?.priceLBP || 0;
      const message = `New Credits Purchase Request\n\nPackage: ${packageSize}GB\nCredits: ${creditsAmount}\nPrice: ${formatLBP(packagePrice)}\nPhone: ${phone}\n\nI'll send you the proof image.`;
      const whatsappUrl = `https://wa.me/96103475704?text=${encodeURIComponent(message)}`;
      
      // Background save
      const phoneValue = phone;
      const creditsValue = parseInt(creditsAmount) || 0;
      const purchaseData = currentCreditsPurchase;
      const userId = uid;
      (async () => {
        try {
          await db.collection("orders").add({
            uid: userId,
            packageSizeGB: purchaseData?.sizeGB,
            priceLBP: purchaseData?.priceLBP,
            phone: phoneValue,
            creditsAmount: creditsValue,
            type: "credits",
            status: "pending",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        } catch (err) {
          console.error("Order save error:", err);
        }
      })();
      
      window.location = whatsappUrl;
      return;
    }
    
    // Non-iOS flow
    const phone = $("#credits-purchase-phone").value.trim();
    if (!isValidLebPhone8(phone)) {
      $("#credits-purchase-error").textContent = "Phone must be 8 digits (no +961 or leading 0)";
      return;
    }
    
    const creditsAmount = $("#credits-purchase-amount").value.trim();
    if (!creditsAmount || parseInt(creditsAmount) < 1) {
      $("#credits-purchase-error").textContent = "Please enter a valid number of credits";
      return;
    }
    
    if (!currentCreditsPurchase) return;

    try {
      const userDoc = await db.collection("users").doc(uid).get();
      const userData = userDoc.data() || {};
      const userName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "User";
      
      const ref = await db.collection("orders").add({
        uid,
        packageSizeGB: currentCreditsPurchase.sizeGB,
        priceLBP: currentCreditsPurchase.priceLBP,
        phone: phone,
        creditsAmount: parseInt(creditsAmount),
        type: "credits",
        status: "pending",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      
      const message = `New Credits Purchase Request

 Name: ${userName}
 Package: ${currentCreditsPurchase.sizeGB}GB
 Price: ${formatLBP(currentCreditsPurchase.priceLBP)}
 Phone Number: ${phone}
 Number of Credits: ${creditsAmount}

I'll send you the proof image.`;

      const whatsappUrl = `https://wa.me/96103475704?text=${encodeURIComponent(message)}`;
      openWhatsApp(whatsappUrl);
      closeCreditsPurchaseModal();
      
      requestAnimationFrame(() => {
        setTimeout(() => {
          alert("✅ Order saved! WhatsApp opened - please send your transfer proof image.");
        }, 1000);
      });
    } catch (e) {
      $("#credits-purchase-error").textContent = e.message || "Failed to submit order";
    }
  });
}

// ---------- Add Credit ----------
function initAddCredit(uid) {
  // Show file name when selected
  const fileInput = $("#credit-proof");
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const label = fileInput.parentElement.querySelector("span");
    if (file && label) {
      label.textContent = file.name;
    }
  });

  $("#add-credit-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const amount = parseFloat($("#credit-amount").value);
    const file = fileInput.files[0] || null;

    if (isNaN(amount) || amount < 0 || amount > 999999.99) {
      alert("Amount must be between 0 and 999,999.99 LBP");
      return;
    }

    let proofUrl = null;
    try {
      if (file) {
        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const path = `creditProofs/${uid}/${safeName}`;
        const task = await storage.ref().child(path).put(file);
        proofUrl = await task.ref.getDownloadURL();
      }
      await db.collection("creditRequests").add({
        uid,
        amountLBP: Math.round(amount * 100) / 100,
        paymentMethod: "transfer",
        proofUrl: proofUrl || null,
        status: "pending",
        requestDate: firebase.firestore.FieldValue.serverTimestamp(),
      });
      $("#credit-amount").value = "";
      fileInput.value = "";
      const label = fileInput.parentElement.querySelector("span");
      if (label) label.textContent = "Upload Proof";
      alert("Credit request submitted");
    } catch (e) {
      alert("Failed to submit credit request: " + (e.message || e));
    }
  });
}

// ---------- Credit History ----------
async function loadCreditHistory(uid) {
  const status = $("#credit-status").value;
  const start = $("#credit-start").value ? new Date($("#credit-start").value) : null;
  const end = $("#credit-end").value ? new Date($("#credit-end").value) : null;

  try {
    // Query with orderBy (requires composite index)
    let q = db.collection("creditRequests")
      .where("uid", "==", uid)
      .orderBy("requestDate", "desc");
    
    const snap = await q.get();
    let rows = [];
    snap.forEach((doc) => {
      const d = doc.data();
      const ts = d.requestDate?.toDate?.() || null;
      
      // Client-side filtering for status and dates
      if (status && d.status !== status) return;
      if (start && ts && ts < start) return;
      if (end && ts && ts > new Date(end.getTime() + 86400000 - 1)) return;
      
      rows.push({ id: doc.id, ...d });
    });

    const tbody = $("#credit-history-body");
    const empty = $("#credit-history-empty");
    tbody.innerHTML = "";
    if (!rows.length) {
      show(empty);
      return;
    }
    hide(empty);
    rows.forEach((r) => {
      const tr = document.createElement("tr");
      tr.className = "border-b border-navy-600/50";
      tr.innerHTML = `
        <td class="px-2 md:px-4 py-3 whitespace-nowrap">${r.requestDate?.toDate?.().toLocaleDateString?.() || "-"}</td>
        <td class="px-2 md:px-4 py-3 whitespace-nowrap">${formatLBP(r.amountLBP)}</td>
        <td class="px-2 md:px-4 py-3 whitespace-nowrap">${r.paymentMethod || "-"}</td>
        <td class="px-2 md:px-4 py-3 whitespace-nowrap"><span class="px-2 py-1 rounded text-xs ${r.status === 'approved' ? 'bg-green-500/20 text-green-400' : r.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}">${r.status || "-"}</span></td>
        <td class="px-2 md:px-4 py-3 whitespace-nowrap hidden md:table-cell">${r.processedDate?.toDate?.().toLocaleDateString?.() || "-"}</td>
        <td class="px-2 md:px-4 py-3 whitespace-nowrap hidden lg:table-cell">${r.processedBy || "-"}</td>
        <td class="px-2 md:px-4 py-3 hidden lg:table-cell">${r.rejectionReason || "-"}</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading credit history:", err);
    const empty = $("#credit-history-empty");
    if (empty) {
      empty.textContent = "Error loading credit history";
      show(empty);
    }
  }
}

function initCreditHistory(uid) {
  const dateBtn = $("#credit-date-btn");
  const dateLabel = $("#credit-date-label");
  const startInput = $("#credit-start");
  const endInput = $("#credit-end");
  
  // When button is clicked, trigger the start date picker
  if (dateBtn && startInput) {
    dateBtn.addEventListener("click", (e) => {
      e.preventDefault();
      startInput.showPicker ? startInput.showPicker() : startInput.click();
    });
  }
  
  // Update label when dates are selected
  function updateDateLabel() {
    if (startInput.value && endInput.value) {
      dateLabel.textContent = `${startInput.value} to ${endInput.value}`;
    } else if (startInput.value) {
      dateLabel.textContent = `From ${startInput.value}`;
    } else {
      dateLabel.textContent = "selectDateRange";
    }
  }
  
  // Listen for date changes
  startInput.addEventListener("change", () => {
    updateDateLabel();
    // Auto-open end date picker after start date is selected
    setTimeout(() => {
      endInput.showPicker ? endInput.showPicker() : endInput.click();
    }, 100);
    loadCreditHistory(uid);
  });
  
  endInput.addEventListener("change", () => {
    updateDateLabel();
    loadCreditHistory(uid);
  });
  
  $("#credit-status").addEventListener("change", () => loadCreditHistory(uid));
}

// ---------- Order History ----------
async function loadOrderHistory(uid) {
  const qStatus = $("#order-status").value;
  const start = $("#order-start").value ? new Date($("#order-start").value) : null;
  const end = $("#order-end").value ? new Date($("#order-end").value) : null;
  const search = $("#order-search").value.trim();

  try {
    // Query with orderBy (requires composite index)
    let q = db.collection("orders")
      .where("uid", "==", uid)
      .orderBy("createdAt", "desc");
    
    const snap = await q.get();

    let rows = [];
    snap.forEach((doc) => {
      const d = doc.data();
      const ts = d.createdAt?.toDate?.() || null;
      
      // Client-side filtering for status and dates
      if (qStatus && d.status !== qStatus) return;
      if (start && ts && ts < start) return;
      if (end && ts && ts > new Date(end.getTime() + 86400000 - 1)) return;
      
      rows.push({ id: doc.id, ...d });
    });

    if (search) {
      const s = search.replace(/\D/g, "");
      rows = rows.filter((r) => String(r.secondaryPhone || "").includes(s) || String(r.mainPhone || "").includes(s));
    }

    const tbody = $("#order-history-body");
    const empty = $("#order-history-empty");
    tbody.innerHTML = "";
    if (!rows.length) { show(empty); return; }
    hide(empty);
    rows.forEach((r) => {
      // Determine service type based on order type
      let serviceType = "Closed u-share Service";
      let quantity = "-";
      
      if (r.type === "alfa-gift") {
        serviceType = "Alfa Gift";
        quantity = r.packageSizeGB ? `${r.packageSizeGB} GB` : "-";
      } else if (r.type === "credits") {
        serviceType = "Credits";
        quantity = r.creditsAmount ? `${r.creditsAmount} Credits` : "-";
      } else if (r.type === "validity") {
        serviceType = "Validity";
        quantity = "-";
      } else if (r.type === "open-service") {
        serviceType = "Open u-share Service";
        quantity = r.packageSizeGB ? `${r.packageSizeGB} GB` : "-";
      } else if (r.packageSizeGB) {
        // Default to Closed u-share Service
        serviceType = "Closed u-share Service";
        quantity = `${r.packageSizeGB} GB`;
      }
      
      // Format status with rejection reason if applicable
      let statusDisplay = r.status;
      if (r.status === "rejected" && r.rejectionReason) {
        statusDisplay = `<span class="text-red-500">rejected</span><br><span class="text-xs text-gray-400">Reason: ${r.rejectionReason}</span>`;
      } else if (r.status === "rejected") {
        statusDisplay = `<span class="text-red-500">rejected</span>`;
      } else if (r.status === "approved") {
        statusDisplay = `<span class="text-green-500">approved</span>`;
      } else if (r.status === "pending") {
        statusDisplay = `<span class="text-yellow-500">pending</span>`;
      }
      
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="px-3 py-2">${r.createdAt?.toDate?.().toLocaleString?.() || "-"}</td>
        <td class="px-3 py-2">${serviceType}</td>
        <td class="px-3 py-2">${r.priceLBP ? formatLBP(r.priceLBP) : "-"}</td>
        <td class="px-3 py-2">${statusDisplay}</td>
        <td class="px-3 py-2">${quantity}</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading order history:", err);
    const empty = $("#order-history-empty");
    if (empty) {
      empty.textContent = "Error loading order history";
      show(empty);
    }
  }
}

// ---------- Order History ----------
let showAllOrders = false;

async function exportOrdersToExcel(uid) {
  console.log("exportOrdersToExcel called with uid:", uid);
  try {
    // Get all user's orders
    console.log("Fetching orders from Firebase...");
    const ordersSnap = await db.collection("orders")
      .where("uid", "==", uid)
      .orderBy("createdAt", "desc")
      .get();
    
    console.log("Orders fetched:", ordersSnap.size);
    
    if (ordersSnap.empty) {
      alert("No orders to export");
      return;
    }
    
    // Prepare CSV data
    let csv = "Date,Service Type,Price (LBP),Status,Quantity,Phone\n";
    
    ordersSnap.forEach(doc => {
      const d = doc.data();
      const date = d.createdAt?.toDate?.().toLocaleString() || "-";
      
      let serviceType = "Closed u-share Service";
      if (d.type === "alfa-gift") serviceType = "Alfa Gift";
      else if (d.type === "credits") serviceType = "Credits";
      else if (d.type === "validity") serviceType = "Validity";
      else if (d.type === "open-service") serviceType = "Open u-share Service";
      
      const price = d.priceLBP || 0;
      const status = d.status || "pending";
      
      let quantity = "-";
      if (d.packageSizeGB) quantity = d.packageSizeGB + " GB";
      else if (d.creditsAmount) quantity = d.creditsAmount + " Credits";
      
      const phone = d.phone || d.secondaryPhone || "-";
      
      csv += `"${date}","${serviceType}",${price},"${status}","${quantity}","${phone}"\n`;
    });
    
    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert("✅ Orders exported successfully!");
  } catch (error) {
    console.error("Error exporting orders:", error);
    alert("Failed to export orders");
  }
}

function initOrderHistory(uid) {
  const startInput = $("#order-start");
  const endInput = $("#order-end");
  const dateBtn = $("#order-date-btn");
  const dateLabel = $("#order-date-label");
  const toggleBtn = $("#toggle-all-orders-btn");
  
  // Set default to today
  const today = new Date().toISOString().split('T')[0];
  startInput.value = today;
  endInput.value = today;
  
  function updateDateLabel() {
    const start = startInput.value;
    const end = endInput.value;
    if (start && end) {
      dateLabel.textContent = `${start} to ${end}`;
    } else if (start) {
      dateLabel.textContent = `From ${start}`;
    } else if (end) {
      dateLabel.textContent = `Until ${end}`;
    } else {
      dateLabel.textContent = "Select Date Range";
    }
  }
  
  updateDateLabel();
  
  dateBtn.addEventListener("click", () => {
    startInput.showPicker?.();
  });
  
  startInput.addEventListener("change", () => {
    updateDateLabel();
    loadOrderHistory(uid);
  });
  
  endInput.addEventListener("change", () => {
    updateDateLabel();
    loadOrderHistory(uid);
  });
  
  $("#order-status").addEventListener("change", () => loadOrderHistory(uid));
  $("#order-search").addEventListener("input", () => loadOrderHistory(uid));
  
  // Export to Excel button
  const exportBtn = $("#export-orders-btn");
  if (exportBtn) {
    console.log("Export button found, attaching listener");
    exportBtn.addEventListener("click", async () => {
      console.log("Export button clicked!");
      await exportOrdersToExcel(uid);
    });
  } else {
    console.log("Export button NOT found");
  }
  
  // Toggle button for showing all orders
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      showAllOrders = !showAllOrders;
      
      if (showAllOrders) {
        // Show all orders - clear date filters
        startInput.value = "";
        endInput.value = "";
        toggleBtn.innerHTML = '<i data-feather="calendar" class="w-4 h-4"></i><span>Show Today Only</span>';
        toggleBtn.classList.remove("bg-brand");
        toggleBtn.classList.add("bg-purple-600", "hover:bg-purple-700");
      } else {
        // Show today only
        const today = new Date().toISOString().split('T')[0];
        startInput.value = today;
        endInput.value = today;
        toggleBtn.innerHTML = '<i data-feather="clock" class="w-4 h-4"></i><span>Show All Orders</span>';
        toggleBtn.classList.remove("bg-purple-600", "hover:bg-purple-700");
        toggleBtn.classList.add("bg-brand");
      }
      
      updateDateLabel();
      if (window.feather) feather.replace();
      loadOrderHistory(uid);
    });
  }
}

function initServicePage() {
  console.log("Initializing service page");
  
  // Add back button handler
  const backBtn = $("#back-to-streaming");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      navTo("streaming");
    });
  }
  
  // Add streaming service navigation handlers
  const streamingBtns = $$(".streaming-enter");
  streamingBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const service = btn.getAttribute("data-service");
      if (service) {
        navTo(service);
      }
    });
  });
}

// ---------- Welcome Carousel ----------
async function checkFirstLogin(uid) {
  try {
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();
    
    console.log("Checking first login for user:", uid);
    console.log("User data:", userData);
    console.log("hasSeenWelcome:", userData?.hasSeenWelcome);
    
    // If hasSeenWelcome is undefined or false, show carousel
    if (!userData || userData.hasSeenWelcome !== true) {
      console.log("First login detected - showing carousel");
      window.location.hash = "welcome-carousel";
      return true; // Is first login
    }
    console.log("Not first login - user has seen welcome");
    return false; // Not first login
  } catch (error) {
    console.error("Error checking first login:", error);
    return false;
  }
}

function initWelcomeCarousel(uid) {
  let currentSlide = 0;
  const slides = $$(".carousel-slide");
  const dots = $$(".carousel-dot");
  const prevBtn = $("#carousel-prev");
  const nextBtn = $("#carousel-next");
  const skipBtn = $("#carousel-skip");
  
  function showSlide(index) {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add("active");
      } else {
        slide.classList.remove("active");
      }
    });
    
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add("active", "bg-blue-600");
        dot.classList.remove("bg-gray-600");
      } else {
        dot.classList.remove("active", "bg-blue-600");
        dot.classList.add("bg-gray-600");
      }
    });
    
    // Show/hide buttons
    if (index === 0) {
      prevBtn.disabled = true;
      prevBtn.classList.add("opacity-50", "cursor-not-allowed");
    } else {
      prevBtn.disabled = false;
      prevBtn.classList.remove("opacity-50", "cursor-not-allowed");
    }
    
    if (index === slides.length - 1) {
      nextBtn.classList.add("hidden");
      skipBtn.classList.remove("hidden");
    } else {
      nextBtn.classList.remove("hidden");
      skipBtn.classList.add("hidden");
    }
  }
  
  prevBtn.addEventListener("click", () => {
    if (currentSlide > 0) {
      currentSlide--;
      showSlide(currentSlide);
    }
  });
  
  nextBtn.addEventListener("click", () => {
    if (currentSlide < slides.length - 1) {
      currentSlide++;
      showSlide(currentSlide);
    }
  });
  
  skipBtn.addEventListener("click", async () => {
    // Mark as seen
    await db.collection("users").doc(uid).update({
      hasSeenWelcome: true
    });
    // Navigate to profile
    navTo("profile");
  });
  
  if (window.feather) feather.replace();
  showSlide(0);
}

// ---------- App Boot ----------
function showAuth() { show($("#auth-view")); hide($("#app-shell")); }
function showApp() { hide($("#auth-view")); show($("#app-shell")); }

function bootForUser(user) {
  const uid = user.uid;
  
  // Page-specific initialization function (must be set BEFORE initRouting)
  window.currentPageInit = (route) => {
    if (route === "profile") {
      const updateInitial = bindProfileForm(uid);
      subscribeUserProfile(uid, updateInitial);
    } else if (route === "closed-services") {
      renderPackages();
    } else if (route === "open-services") {
      renderOpenPackages();
    } else if (route === "alfa-gifts") {
      renderAlfaPackages();
    } else if (route === "credits") {
      initCreditsPage(uid);
    } else if (route === "validity") {
      initValidityPage(uid);
    } else if (route === "streaming" || route === "netflix" || route === "shahed" || route === "osn") {
      initServicePage();
    } else if (route === "order-history") {
      initOrderHistory(uid);
      loadOrderHistory(uid);
    } else if (route === "welcome-carousel") {
      initWelcomeCarousel(uid);
    }
  };
  
  initTopBar();
  initSidebar();
  initPurchaseModal(uid);
  initAlfaPurchaseModal(uid);
  const unsubProfile = subscribeUserProfile(uid, null);
  
  // Check if first login BEFORE routing
  console.log("About to check first login...");
  checkFirstLogin(uid).then((isFirstLogin) => {
    console.log("First login check complete. Is first login:", isFirstLogin);
    // Initialize routing AFTER checking first login
    initRouting();
  }).catch(err => {
    console.error("Error in checkFirstLogin:", err);
    initRouting();
  });

  // Help button visibility per page (example: show on closed-services)
  const helpBtn = $("#help-btn");
  if (helpBtn) {
    function applyHelp(route) {
      if (route === "closed-services") show(helpBtn); else hide(helpBtn);
    }
    applyHelp(window.location.hash.replace('#','') || 'profile');
    window.addEventListener("hashchange", () => applyHelp(window.location.hash.replace('#','')));
  }

  return () => {
    if (unsubProfile) unsubProfile();
  };
}

function initApp() {
  initTheme();
  initAuthView();

  // Also wire topbar theme button
  const topToggle = $("#toggle-theme");
  if (topToggle) topToggle.addEventListener("click", () => setTheme(!document.documentElement.classList.contains("dark")));

  let cleanup = null;
  auth.onAuthStateChanged((user) => {
    if (user) {
      showApp();
      if (cleanup) cleanup();
      cleanup = bootForUser(user);
    } else {
      if (cleanup) { cleanup(); cleanup = null; }
      showAuth();
    }
  });
}

window.addEventListener("DOMContentLoaded", initApp);
