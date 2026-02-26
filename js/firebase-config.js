// ================= FIREBASE CONFIG =================
const firebaseConfig = {
  apiKey: "AIzaSyDemoKey123456789",
  authDomain: "luxewear-demo.firebaseapp.com",
  projectId: "luxewear-demo",
  storageBucket: "luxewear-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefg123456"
};

let firebaseInitialized = false;
try {
  if (typeof firebase === 'undefined') {
    console.warn('Firebase not loaded');
  } else {
    firebase.initializeApp(firebaseConfig);
    firebaseInitialized = true;
  }
} catch(e) {
  console.warn('Firebase initialization skipped:', e.message);
}

export { firebaseInitialized, firebaseConfig };
