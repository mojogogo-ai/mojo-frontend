// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { ElMessage } from 'element-plus';
import { t } from '@gptx/base/i18n';

// Firebase configuration object (replace with your own config from Firebase Console)
const firebaseConfig = window.FIREBASE_CONFIG

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Export Firebase services for reuse
const auth = getAuth(app)

// Handle Firebase-specific errors
const handleFirebaseError = (error) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      ElMessage.error(t('login.emailAlreadyInUse'))
      break
    case 'auth/invalid-email':
      ElMessage.error(t('login.invalidEmailServer'))
      break
    case 'auth/wrong-password':
      ElMessage.error(t('login.wrongPassword'))
      break
    case 'auth/user-not-found':
      ElMessage.error(t('login.userNotFound'))
      break
    case 'auth/weak-password':
      ElMessage.error(t('login.weakPassword'))
      break
    case 'auth/too-many-requests':
      ElMessage.error(t('login.tooManyRequests'))
      break
    case 'auth/network-request-failed':
      ElMessage.error(t('login.networkRequestFailed'))
      break
    case 'auth/operation-not-allowed':
      ElMessage.error(t('login.operationNotAllowed'))
      break
    default:
      ElMessage.error(t('login.loginErrorRetry'))
      console.error(error)
  }
}

export  { auth, app, handleFirebaseError }
