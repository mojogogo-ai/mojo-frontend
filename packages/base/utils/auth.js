import Cookies from 'js-cookie';
import firebase from 'firebase/compat/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const TokenKey = 'tokenAi';
const RefreshTokenKey = 'tokenAi_reflesh';
const TokenExpireKey = 'tokenExpireAi';

// firebase 登录获取新token
const getFirebaseRefleshToken = () => {
  return new Promise((resolve) => {
    firebase.initializeApp(window.FIREBASE_CONFIG);
    onAuthStateChanged(getAuth(), function (user) {
      // console.log('onAuthStateChanged user: ', user);
      if (user) {
        try {
          user.getIdToken().then(function (token) {
            //获取新firebase token
            console.log('onAuthStateChanged token: ', token);
            setToken(token);
            setTokenExpire(user.stsTokenManager.expirationTime);
            resolve(true);
          });
        } catch (e) {
          console.log(e);
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  });
};

// 检测token是否过期
const getNewToken = async () => {
  let expireTime = Cookies.get(TokenExpireKey);
  let newTimeStamp = new Date().getTime() + 1 * 60 * 1000; // 提前1分钟
  // debugger
  if (expireTime && newTimeStamp > expireTime) {
    await getFirebaseRefleshToken();
  }
};

export async function getToken() {
  await getNewToken();
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 1 });
}

export function removeToken() {
  Cookies.remove(TokenExpireKey);
  Cookies.remove(RefreshTokenKey);
  return Cookies.remove(TokenKey);
}

export function setTokenExpire(expireTime) {
  return Cookies.set(TokenExpireKey, expireTime, { expires: 1 });
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey);
}

export function setRefreshToken(token) {
  return Cookies.set(RefreshTokenKey, token, { expires: 1 });
}

export async function getIsLogin() {
  let curToken = await getToken();
  if (curToken) {
    const storageUserInfo = JSON.parse(localStorage.getItem('user'));
    //匿名登录，就是没登陆，后续优化
    const isAnonymous = storageUserInfo?.data?.isAnonymous;
    return !isAnonymous;
  } else {
    return false;
  }
}
