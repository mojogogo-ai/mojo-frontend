const useLoginStore = defineStore('login', {
  state: () => ({
    loginDialogVisible: false,
    isLogOut: false
  }),
  actions: {
    setLoginDialogVisible(visible) {
      this.loginDialogVisible = visible;
    },
    toLoginOut() {
      this.isLogOut = !this.isLogOut;
    }
  }
});

export default useLoginStore;
