
const useUserStore = defineStore(
  'login',
  {
    state: () => ({
      loginDialog: false,
      isLogOut: false,
    }),
    actions: {
      openLoginDialog () {
        this.loginDialog =  true
      },
      closeLoginDialog () {
        this.loginDialog =  false
      },
      toLoginOut () {
        this.isLogOut =  !this.isLogOut
      }
    }
  }
)

export default useUserStore
