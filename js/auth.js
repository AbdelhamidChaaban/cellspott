/* Authentication Module
   Handles login, signup, and auth UI
*/

// ---------- Auth UI ----------
async function loadAuthForms() {
  const loginContainer = $("#login-form-container");
  const signupContainer = $("#signup-form-container");
  
  try {
    // Load login form
    const loginResponse = await fetch('./auth/login.html');
    if (loginResponse.ok) {
      const loginHTML = await loginResponse.text();
      loginContainer.innerHTML = loginHTML;
    }
    
    // Load signup form
    const signupResponse = await fetch('./auth/signup.html');
    if (signupResponse.ok) {
      const signupHTML = await signupResponse.text();
      signupContainer.innerHTML = signupHTML;
    }
  } catch (error) {
    console.error("Error loading auth forms:", error);
  }
}

function initAuthView() {
  // Load forms first
  loadAuthForms();
  
  const tabLogin = $("#tab-login");
  const tabSignup = $("#tab-signup");
  const loginFormContainer = $("#login-form-container");
  const signupFormContainer = $("#signup-form-container");
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
    tabLogin.className = "flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium";
    tabSignup.className = "flex-1 py-2.5 rounded-lg bg-navy-700 border border-navy-600 font-medium";
    show(loginFormContainer); hide(signupFormContainer);
  });

  tabSignup.addEventListener("click", () => {
    tabSignup.className = "flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium";
    tabLogin.className = "flex-1 py-2.5 rounded-lg bg-navy-700 border border-navy-600 font-medium";
    hide(loginFormContainer); show(signupFormContainer);
  });

  // Wait for forms to load then attach event listeners
  setTimeout(() => {
    const loginForm = $("#login-form");
    const signupForm = $("#signup-form");
    
    if (loginForm) {
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
    }
    
    if (signupForm) {
      signupForm.addEventListener("submit", async (e) => {
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
          const phoneCheck = await db.collection("users")
            .where("phone", "==", phone)
            .get();
          
          if (!phoneCheck.empty) {
            $("#signup-error").textContent = "This phone number is already registered. Please use a different number.";
            return;
          }
          
          // Create user account
          const cred = await auth.createUserWithEmailAndPassword(email, password);
          const uid = cred.user.uid;
          
          // Create user document
          await db.collection("users").doc(uid).set({
            firstName,
            lastName,
            phone: String(phone),
            email,
            balanceLBP: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
          
          // Navigate to profile after signup via onAuthStateChanged
        } catch (err) {
          if (err.code === "auth/email-already-in-use") {
            $("#signup-error").textContent = "This email is already registered";
          } else {
            $("#signup-error").textContent = err.message || "Signup failed";
          }
        }
      });
    }
  }, 500);
}
