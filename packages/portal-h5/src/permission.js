import router from './router'
import { getToken } from '@gptx/base/utils/auth'
// import { getAuth, signInAnonymously, onAuthStateChanged  } from "firebase/auth";
// import { visitorAnonymous } from "@gptx/base/api/login";

// import useUserStore from '@/store/modules/user'
import useLoginStore from '@/store/modules/login'
import { useDynamicTitle } from '@gptx/base/utils/dynamicTitle'
// import {t} from '@gptx/base/i18n'

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
    if (toPatch!=='/home') {
      const useLogin = useLoginStore();
      useLogin.openLoginDialog()
      next('/home')
    } else {
      next()
    }
  }
}

router.afterEach(() => {
})