/* Firebase Initialization
   Initializes Firebase services for the application
*/

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
    console.warn("Firebase init error. Check your config in firebase-init.js", e);
  }
})();
