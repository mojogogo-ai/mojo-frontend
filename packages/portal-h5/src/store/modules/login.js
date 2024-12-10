export const useLoginStore = defineStore('login', {
  state: () => ({
    loginDialogVisible: false,
    isLogOut: false,
    isLoginOrSignUp: 'login'
  }),
  actions: {
    setLoginDialogVisible(visible, isLoginOrSignUp='false') {
      this.loginDialogVisible = visible;
      this.isLoginOrSignUp = isLoginOrSignUp;
    },
    toLoginOut() {
      this.isLogOut = !this.isLogOut;
    }
  }
});

export default useLoginStore;
