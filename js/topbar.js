/* Top Bar and Profile Module
   Handles top bar UI, user info display, and profile management
*/

// ---------- Top Bar UI ----------
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

// ---------- Profile Form ----------
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

// ---------- User Profile Subscription ----------
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
