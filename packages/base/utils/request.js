import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, removeToken } from '@gptx/base/utils/auth'
import { isMobi } from '@gptx/base/utils/index'
import { getAuth, signOut } from "firebase/auth";
import { getCurLang } from '@gptx/base'
import { t } from '@gptx/base/i18n'

// create axios 
const service = axios.create({
  baseURL: window.BASE_API,
  timeout: 600000
})

// interceptors
service.interceptors.request.use(
 async (config) => {
    if (config.url!== '/portal/user/refresh-token') {
      let firebaseToken = await getToken()
      if (firebaseToken) {
        config.headers.Authorization = 'Bearer ' + firebaseToken
      }
    }

    const lang = getCurLang()
    config.headers['X-Client-Locale'] = lang === 'zh' ? 'zh-CN' : lang
    config.headers['X-Client-Timezone-Offset'] = new Date().getTimezoneOffset() // timezone offset
    config.headers['X-Client-Type'] = isMobi() ? 'H5' : 'WEB'// X-Client-Type
    config.headers['X-Client-Site'] = window.SITE_TYPE // X-Client-Site
    
    return config
  },
  (error) => {
    console.log(error)
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  (res) => {
    const code = res.data.code || 200
    // error msg
    const msg = res.data.msg || t('menu.i')
    // blob
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data
    }
    if (code === 200) {
      return Promise.resolve(res.data)
    } else if (code === 401) {
      removeToken()
      ElMessage.warning(t('login.re-login'))
      window.location.href = window.location.origin +  window.location.pathname + '#login'

      if (window.SITE_TYPE === '1') { // firebase
        const auth = getAuth();
        signOut(auth).then(() => {
          // Sign-out successful.
        }).catch(() => {
          // An error happened.
        });
      }
      return Promise.reject('error 401')
    } else {
      ElMessage({ message: msg,  type: 'error' })
      return Promise.reject(new Error(msg))
    }
  },
  (error) => {
    console.log('err' + error)
    let {message} = error
    if (message === 'Network Error') {
      message = t('menu.g')
    } else if (message.includes('timeout')) {
      message = t('menu.h')
    } else if (message.includes('Request failed with status code')) {
      message = t('menu.i')
    }
    ElMessage({
      message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)


export default service
