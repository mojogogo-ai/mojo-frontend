
const useUserStore = defineStore(
  'bot',
  {
    state: () => ({
      createBotDialog: false
    }),
    actions: {
      openCreateBotDialog () {
        this.createBotDialog =  !this.createBotDialog
      }
    }
  }
)

export default useUserStore
