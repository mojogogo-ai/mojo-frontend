
const useUserStore = defineStore(
  'login',
  {
    state: () => ({
      loginDialog: false,
      isLogOut: false,
    }),
    actions: {
      openLoginDialog () {
        this.loginDialog =  !this.loginDialog
      },
      toLoginOut () {
        this.isLogOut =  !this.isLogOut
      }
    }
  }
)

export default useUserStore
