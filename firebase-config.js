// JobPrep AI — Firebase Configuration and Initialization
/**
 * 🔒 SECURITY WARNING: Protecting your Firebase API Key
 * Client-side API keys in Firebase are identifiers, not secret keys. However, to prevent misuse:
 * 1. Go to Google Cloud Console (https://console.cloud.google.com/)
 * 2. Select your project: "jobprepai-40042"
 * 3. Navigate to "APIs & Services" > "Credentials"
 * 4. Click edit on your API Key (e.g. "Browser Key" or matching "AIzaSyCIlZs5jcNZh-nY7yJNVJMg_XIyZia1N8I")
 * 5. Under "Application restrictions", choose "HTTP referrers (web sites)" and add your trusted domains:
 *    - http://localhost/*
 *    - http://127.0.0.1/*
 *    - https://yourproductiondomain.com/*
 * 6. Under "API restrictions", select "Restrict key" and check:
 *    - Identity Toolkit API (essential for Firebase Auth)
 *    - Token Service API
 */

const firebaseConfig = {
  apiKey: "AIzaSyCIlZs5jcNZh-nY7yJNVJMg_XIyZia1N8I",
  authDomain: "jobprepai-40042.firebaseapp.com",
  projectId: "jobprepai-40042",
  storageBucket: "jobprepai-40042.firebasestorage.app",
  messagingSenderId: "808921365950",
  appId: "1:808921365950:web:3061567dc5f7d58aa78def",
  measurementId: "G-211XQVVG1Z"
};

let auth = null;
let isFirebaseAvailable = false;

try {
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    isFirebaseAvailable = true;
    console.log("JobPrep AI: Firebase initialized successfully.");
  } else {
    console.warn("JobPrep AI: Firebase SDK was not loaded. Running in local fallback/mock mode.");
  }
} catch (error) {
  console.error("JobPrep AI: Firebase initialization failed:", error);
}
