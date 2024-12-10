const useLoginStore = defineStore('login', {
  state: () => ({
    loginDialogVisible: false,
    isLogOut: false,
    // login or sign up
    isLoginOrSignUp: 'login',
  }),
  actions: {
    setLoginDialogVisible(visible, isLoginOrSignUp) {
      this.loginDialogVisible = visible;
      this.isLoginOrSignUp = isLoginOrSignUp;
    },
    toLoginOut() {
      this.isLogOut = !this.isLogOut;
    }
  }
});

export default useLoginStore;
