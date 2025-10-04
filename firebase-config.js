// Firebase Configuration
// Using the same Firebase project as the customer website

const firebaseConfig = {
  apiKey: "AIzaSyCkctXy17dOjUJp14qyj2dkJP0pe9nmNlY",
  authDomain: "cellspot-cb050.firebaseapp.com",
  projectId: "cellspot-cb050",
  storageBucket: "cellspot-cb050.firebasestorage.app",
  messagingSenderId: "237744317937",
  appId: "1:237744317937:web:0af5c423ceb10770385050",
  measurementId: "G-ESCLEGP1X9"
};

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Export Firebase services for use in other files
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
