import Cookies from 'js-cookie'
import firebase from 'firebase/compat/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getSmsGefreshToken } from '@gptx/base/api/login'

const TokenKey = 'tokenAi'
const RefreshTokenKey = 'tokenAi_reflesh'
const TokenExpireKey = 'tokenExpireAi'

// firebase 登录获取新token
const getFirebaseRefleshToken = ()=>{
  return new Promise((resolve) => {
    firebase.initializeApp(window.FIREBASE_CONFIG);
    onAuthStateChanged(getAuth(), function (user) {
      console.log('onAuthStateChanged user: ', user)
      if (user) {
        try {
          user.getIdToken().then(function (token) {//获取新firebase token
            console.log('onAuthStateChanged token: ', token)
            setToken(token)
            setTokenExpire(user.stsTokenManager.expirationTime)
            resolve(true)
          })
        } catch (e) {
          console.log(e);
          resolve(false)
        }
      } else{
        resolve(false)
      }
    })
  })
} 

// sms 登录获取新token
const getSmsRefleshToken = ()=>{
  return new Promise((resolve, reject) => {
    let params = {
      refresh_token: getRefreshToken()
    }
    getSmsGefreshToken(params).then((res) => {
        if (res.code === 200) {
          setToken(res.data.access_token)
          setRefreshToken(res.data.refresh_token)
          setTokenExpire(new Date().getTime() + 2*3600*1000)
          resolve(true)
        } else{
          removeToken()
          window.location.reload()
          reject(false)
        }
      }
    ).catch((err) => {
      console.log(err,'err')
      removeToken()
      window.location.reload()
      reject(false)
    });
  })
} 

// 检测token是否过期
const getNewToken = async ()=>{
  let expireTime = Cookies.get(TokenExpireKey)
  let newTimeStamp = new Date().getTime() + 1 * 60 *1000; // 提前1分钟
  // debugger
  if (expireTime && (newTimeStamp > expireTime)) {
    if (window.SITE_TYPE === '1') { // firebase
      await getFirebaseRefleshToken()
    } else { // sms
      await getSmsRefleshToken()
    }
  }
}

export async function getToken() {
  await getNewToken()
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 1 })
}

export function removeToken() {
  Cookies.remove(TokenExpireKey)
  Cookies.remove(RefreshTokenKey)
  return Cookies.remove(TokenKey)
}

export function setTokenExpire(expireTime) {
  return Cookies.set(TokenExpireKey, expireTime, { expires: 1 })
}


export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}

export function setRefreshToken(token) {
  return Cookies.set(RefreshTokenKey, token, { expires: 1 })
}