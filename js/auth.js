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

async function initAuthView() {
  // Load forms first and wait until they're injected into the DOM
  await loadAuthForms();
  
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

  // Attach event listeners now that DOM contains the forms
  const loginForm = $("#login-form");
  const signupForm = $("#signup-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      $("#login-error").textContent = "";
      if (!window.auth || !window.db) {
        $("#login-error").textContent = "Firebase not initialized. Check console for details.";
        console.error('Firebase services missing on window:', { auth: window.auth, db: window.db });
        return;
      }
      const email = $("#login-email").value.trim();
      const password = $("#login-password").value;
      try {
        await auth.signInWithEmailAndPassword(email, password);
      } catch (err) {
        $("#login-error").textContent = err.message || "Login failed";
        console.error('Login error:', err);
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      $("#signup-error").textContent = "";
      console.log('signup form submit handler triggered');
      console.trace();
      if (!window.auth || !window.db) {
        $("#signup-error").textContent = "Firebase not initialized. Check console for details.";
        console.error('Firebase services missing on window:', { auth: window.auth, db: window.db });
        return;
      }
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
        // Create user account in Firebase Auth first. This avoids unauthenticated
        // Firestore reads which may be blocked by security rules when checking
        // for duplicate phone numbers.
        console.log("Attempting to create auth user for", email);
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        const uid = cred.user.uid;

        console.log("Auth user created, creating user document for UID:", uid);
        // Ensure we have a valid user from Auth before writing to Firestore
        if (!cred || !cred.user || !cred.user.uid) {
          console.error('Auth credential missing after createUserWithEmailAndPassword:', cred);
          $("#signup-error").textContent = "Signup failed (no auth user). Check console for details.";
          return;
        }

        // Create user document
        await db.collection("users").doc(uid).set({
          firstName,
          lastName,
          phone: String(phone),
          email,
          balanceLBP: 0,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          // Debug marker to indicate this document was created by the client after successful Auth creation
          createdByAuthClient: true,
        });

        console.log("User document created successfully for UID:", uid);
        // Navigate to profile after signup via onAuthStateChanged
      } catch (err) {
        if (err.code === "auth/email-already-in-use") {
          $("#signup-error").textContent = "This email is already registered";
        } else {
          $("#signup-error").textContent = err.message || "Signup failed";
        }
        console.error('Signup error:', err);
      }
    });
  }
}
