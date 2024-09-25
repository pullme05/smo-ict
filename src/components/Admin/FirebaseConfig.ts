import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC3v-VB38vp33Bi4diLYYlJwdUWKDhFHRQ",
  authDomain: "smo-ict.firebaseapp.com",
  projectId: "smo-ict",
  storageBucket: "smo-ict.appspot.com",
  messagingSenderId: "565923834986",
  appId: "1:565923834986:web:bf0d4194eb7d1b968fee13",
  measurementId: "G-EL6PGHXDK9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
