import router from './router'
import { getToken, setRefreshToken } from '@gptx/base/utils/auth'
import { isMobi } from '@gptx/base'
import { getAuth, signInAnonymously, onAuthStateChanged  } from "firebase/auth";
import { visitorLogin, visitorAnonymous } from "@gptx/base/api/login";

import useUserStore from '@/store/modules/user'
import { useDynamicTitle } from '@gptx/base/utils/dynamicTitle'
import {t} from '@gptx/base/i18n'

const whiteList = ['/login', '/bind', '/register']
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
      if (!toPatch.startsWith('/chat') && !toPatch.startsWith('/bot-shared')) {
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
      if (window.IS_DEMO) { // DEMO
        next({ path: '/login' })
        return
      }
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
                        next('/chat')
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

       } else { // SMS

        initCaptcha()

        function callback(capRes) {
          // 第一个参数传入回调结果，结果如下：
          // ret         Int       验证结果，0：验证成功。2：用户主动关闭验证码。
          // ticket      String    验证成功的票据，当且仅当 ret = 0 时 ticket 有值。
          // CaptchaAppId       String    验证码应用ID。
          // bizState    Any       自定义透传参数。
          // randstr     String    本次验证的随机串，后续票据校验时需传递该参数。
          // verifyDuration     Int   验证码校验接口耗时（ms）。
          // actionDuration     Int   操作校验成功耗时（用户动作+校验完成）(ms)。
          // sid     String   链路sid。
          console.log('callback:', capRes);
        
          // res（用户主动关闭验证码）= {ret: 2, ticket: null}
          // res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}
          // res（请求验证码发生错误，验证码自动返回trerror_前缀的容灾票据） = {ret: 0, ticket: "String", randstr: "String",  errorCode: Number, errorMessage: "String"}
          // 此处代码仅为验证结果的展示示例，真实业务接入，建议基于ticket和errorCode情况做不同的业务处理
          if (capRes.ret === 0) {
            let params = {
              captcha_ticket: capRes.ticket,
              captcha_random: capRes.randstr
            }
            visitorLogin(params).then((res) => {
              console.log(res,'__visitorLogin')
                if (res.code === 200) {
                  let { access_token, refresh_token, human_verified } = res.data
                  visitorAnonymous(access_token).then((res) => { // 后台登录接口，获取相关信息（相当于welcome接口）
                    console.log(res,'visitorAnonymous')
                    if (res.code === 200) {
                      let userInfo ={
                        accessToken: access_token,
                        stsTokenManager: {
                          expirationTime:new Date().getTime() + 2*3600*1000
                        },
                        emailVerified: false,
                        id: '',
                        isAnonymous: true
                      }
                      setRefreshToken(refresh_token)
                      localStorage.setItem('systemChat', JSON.stringify({...res.data.visitor_chat, system:true}));
                      localStorage.setItem('user', JSON.stringify(res.data.visitor_info));
                      localStorage.setItem('humanVerified', human_verified);
                      localStorage.setItem('anonymousToken', access_token);
                      userStore.loginOthers(userInfo).then(() => { // 调用action的登录方法
                        if(toPatch.startsWith('/bot-shared')){
                          next()
                        }else{
                          next('/chat')
                        }
                      })
                    }
                  }).catch((err) => {
                    return err;
                  });
                } else {
                  //
                }
              }
            ).catch(() => {
            });
          }
        }
        function initCaptcha() { // 无感知校验
          try {
              // 生成一个验证码对象
              // CaptchaAppId：登录验证码控制台，从【验证管理】页面进行查看。如果未创建过验证，请先新建验证。注意：不可使用客户端类型为小程序的CaptchaAppId，会导致数据统计错误。
              //callback：定义的回调函数
              var captcha = new TencentCaptcha('194054038', callback, {
                userLanguage: 'zh-cn',
                loading: false,
                // showFn: (ret) => {
                //   const {
                //     duration, // 验证码渲染完成的耗时(ms)
                //     sid, // 链路sid
                //   } = ret;
                // },
              });
              // 调用方法，显示验证码
              captcha.show();
            } catch (error) {
              console.log(error,'error')
              // 加载异常，调用验证码js加载错误处理函数
              var appid = '194054038';
              // 生成容灾票据或自行做其它处理
              var ticket = 'trerror_1001_' + appid + '_' + Math.floor(new Date().getTime() / 1000);
              callback({
                ret: 0,
                randstr: '@' + Math.random().toString(36).substr(2),
                ticket: ticket,
                errorCode: 1001,
                errorMessage: 'jsload_error'
              });
            }
        
        }
        
       }

    }
  }
}


router.afterEach(() => {
})