// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { showToast } from 'vant';
import { t } from '@gptx/base/i18n'

const firebaseConfig = window.FIREBASE_CONFIG

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

const handleFirebaseError = (error) => {
  const showError = (message) => {
    showToast(message)
  }

  switch (error.code) {
    case 'auth/email-already-in-use':
      showError(t('login.emailAlreadyInUse'))
      break
    case 'auth/invalid-email':
      showError(t('login.invalidEmailServer'))
      break
    case 'auth/wrong-password':
      showError(t('login.wrongPassword'))
      break
    case 'auth/user-not-found':
      showError(t('login.userNotFound'))
      break
    case 'auth/weak-password':
      showError(t('login.weakPassword'))
      break
    case 'auth/too-many-requests':
      showError(t('login.tooManyRequests'))
      break
    case 'auth/network-request-failed':
      showError(t('login.networkRequestFailed'))
      break
    case 'auth/operation-not-allowed':
      showError(t('login.operationNotAllowed'))
      break
    default:
      showError(t('login.loginErrorRetry'))
      console.error(error)
  }
}
function getIsLogin() {
  const user = auth.currentUser; // 获取当前用户
  console.log('getIsLogin', user)
  if (user) {
    return !user.isAnonymous; // 检查是否为匿名用户
  }
  return false; // 如果没有用户，则未登录
}

export { auth, app, handleFirebaseError, getIsLogin }
