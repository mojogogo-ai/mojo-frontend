// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Firebase configuration object (replace with your own config from Firebase Console)
const firebaseConfig = window.FIREBASE_CONFIG

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Export Firebase services for reuse
const auth = getAuth(app)

export  { auth, app }
