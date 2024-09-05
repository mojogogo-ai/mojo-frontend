import router from './router'
import { getToken } from '@gptx/base/utils/auth'
import { isMobi } from '@gptx/base'
import { getAuth, signInAnonymously, onAuthStateChanged  } from "firebase/auth";
import { visitorAnonymous } from "@gptx/base/api/login";

import useUserStore from '@/store/modules/user'
import { useDynamicTitle } from '@gptx/base/utils/dynamicTitle'
import {t} from '@gptx/base/i18n'

const whiteList = ['/login']
router.beforeEach((to, from, next) => {
  // to h5
  if (isMobi()) {
      window.location.href = new URL(window.location).origin + '/portal-h5';
      next(false)
  }
  handleRoute(to, from, next)
})
async function handleRoute(to, from, next) {
  const userStore = useUserStore();
  const toPatch = to.path
  let curToken = await getToken()

  if (curToken) { // 已经登录了,有token
    to.meta.title && useDynamicTitle(to.meta.title)
    const storageUserInfo = JSON.parse(localStorage.getItem('userInfo'))
    const isAnonymous = storageUserInfo&&storageUserInfo.data.isAnonymous

    if (isAnonymous) { // 匿名用户
      if (toPatch.startsWith('/login')) {
        next()
        return
      }
      if (!toPatch.startsWith('/home') && !toPatch.startsWith('/bot-shared')) {
        ElMessageBox.confirm(
          t('chat.tip1'),
          t('common.e'),
          {
            confirmButtonText: t('login.d'),
            cancelButtonText: t('common.cancel'),
            customClass: 'customize-message-box'
          }
        ).then(() => {
          userStore.logOut().then(() => {
            next({ path: '/login' })
          });
        }).catch(() => {
          next(false)
        })
      } else { 
        next()
      }

      return 
    } else {
      if (toPatch === '/login') {
        next({ path: '/' })
      } else {
        next()
      }
    }

  } else { // 没有登录，没有token

    if (whiteList.indexOf(toPatch) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      const toPatch = to.path
       // 匿名登录
       if (window.SITE_TYPE === '1') { // firebase

          const auth = getAuth();
          // https://firebase.google.com/docs/auth/web/anonymous-auth
          signInAnonymously(auth).then((res) => {
            console.log(res,'signInAnonymously')
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {// firebase 匿名登录成功，获取user，token
              if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
                visitorAnonymous(user.accessToken).then((res) => { // 后台登录接口，获取相关信息（相当于welcome接口）
                  console.log(res,'visitorAnonymous')
                  if (res.code === 200) {
                    const userInfo = {
                      ...user,
                      accessToken: user.accessToken,
                      id: user.uid,
                      nickName: res.data.visitor_info.nickname,
                    };
    
                    localStorage.setItem('systemChat', JSON.stringify({...res.data.visitor_chat, system:true}));
                    localStorage.setItem('user', JSON.stringify(res.data.visitor_info));
                    localStorage.setItem('anonymousToken', user.accessToken);
                    userStore.loginOthers(userInfo).then(() => { // 调用action的登录方法
                      if(toPatch.startsWith('/bot-shared')){
                        next()
                      }else{
                        next('/home')
                      }
                    })
                  }
                }).catch((err) => {
                  return err;
                });
              } 
            });
          }).catch(() => {
            // ...
          });

       }  
    }
  }
}

router.afterEach(() => {
})