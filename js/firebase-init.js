/* Firebase Initialization
   Initializes Firebase services for the application
*/

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkctXy17dOjUJp14qyj2dkJP0pe9nmNlY",
  authDomain: "cellspot-cb050.firebaseapp.com",
  projectId: "cellspot-cb050",
  storageBucket: "cellspot-cb050.appspot.com",
  messagingSenderId: "237744317937",
  appId: "1:237744317937:web:0af5c423ceb10770385050",
  measurementId: "G-ESCLEGP1X9"
};

var app, auth, db, storage;
(function initFirebase() {
  try {
    if (!firebase.apps.length) {
      app = firebase.initializeApp(firebaseConfig);
    } else {
      app = firebase.app();
    }

    // Expose services as globals so other non-module scripts can access them
    window.auth = firebase.auth();
    window.db = firebase.firestore();
    window.storage = firebase.storage();

    // Also mirror to local vars for internal use
    auth = window.auth;
    db = window.db;
    storage = window.storage;

    console.log("Firebase initialized successfully (auth, db, storage available on window)");
  } catch (e) {
    console.error("Firebase init error. Check your config in js/firebase-init.js", e);
  }
})();
