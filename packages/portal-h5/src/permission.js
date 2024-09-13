import router from './router'
import { getToken } from '@gptx/base/utils/auth'
// import { getAuth, signInAnonymously, onAuthStateChanged  } from "firebase/auth";

// import useUserStore from '@/store/modules/user'
import useLoginStore from '@/store/modules/login'
import { useDynamicTitle } from '@gptx/base/utils/dynamicTitle'
// import {t} from '@gptx/base/i18n'

const whiteList = ['/home', '/assistant']
router.beforeEach((to, from, next) => {
  handleRoute(to, from, next)
})
async function handleRoute(to, from, next) {
  const toPatch = to.path
  to.meta.title && useDynamicTitle(to.meta.title)
  let curToken = await getToken()

  if (curToken || toPatch === '/home') { // 已经登录了
    next()
  } else { // 没有登录，没有token
    if (whiteList.indexOf(toPatch) ===-1) {
      const useLogin = useLoginStore();
      useLogin.setLoginDialogVisible(true)
      next('/home')
    } else {
      next()
    }
  }
}

router.afterEach(() => {
})
