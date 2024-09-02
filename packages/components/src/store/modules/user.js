import { welcomeAccess } from '@gptx/base/api/login'
import { setToken, removeToken, setTokenExpire} from '@gptx/base/utils/auth'
import { ss } from '@gptx/base/utils/storage'
import defAva from '@/assets/logo/avatar-default.svg'

const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      nickName: '',
      avatar: '',
      email: '',
      phoneNumber: '',
    }),
    actions: {
      loginOthers(authUserInfo) {
        setToken(authUserInfo.accessToken)
        setTokenExpire(authUserInfo.stsTokenManager.expirationTime)
        console.log(authUserInfo,'loginOthers')

        let aa = {
          emailVerified: authUserInfo.emailVerified,
          id: authUserInfo.id,
          isAnonymous: authUserInfo.isAnonymous,
        }
        ss.set('userInfo', aa)
        return Promise.resolve()
      },
      updateUserInfo (key, value) {
        this[key] = value
      },
      logOut () {
        return new Promise((resolve) => {
          removeToken()
          localStorage.removeItem('userInfo')
          localStorage.removeItem('user')
          localStorage.removeItem('systemChat')
          resolve()
        })
      },
      updateSysInfo () {
        const storageUserInfo = JSON.parse(localStorage.getItem('userInfo'))
        if (storageUserInfo.data.isAnonymous){ // 匿名用户
          const storageUser = JSON.parse(localStorage.getItem('user'))

          this.nickName = storageUser.nickname // 昵称
          this.avatar = storageUser.photo_url || defAva // 头像
          this.phoneNumber = storageUser.phoneNumber || ''
          this.email = storageUser.email || ''
        } else {
          welcomeAccess().then((res) => {
              console.log(res,'res999')
              if (res.data && res.data.system_chat) {
                localStorage.setItem('systemChat', JSON.stringify(res.data.system_chat));
              }
              if (res.data && res.data.user_info) {
                const user = res.data.user_info
                const avatar = (user.photo_url === '' || user.photo_url == null) ? defAva : user.photo_url
                this.nickName = user.nick_name || user.nickname// 昵称
                this.avatar = avatar // 头像
                this.phoneNumber = user.phone_number || ''
                this.email = user.email || ''
                localStorage.setItem('user', JSON.stringify(res.data.user_info));
              }
            }
          ).catch((err) => {
            console.log(err,'err')
          });
        }
      }
    }
  }
)

export default useUserStore
