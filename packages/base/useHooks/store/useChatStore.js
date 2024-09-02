import { defineStore } from 'pinia'
export const useChatStore = defineStore('debug-chat', {
  state: () =>({
    active: '',
    history: [
      // { id: '', title: '', icon: '' }
    ],
    chat: [
      // { id: '', data: [], icon: '' }
    ]
  }),
  getters: {
    getChatHistoryByCurrentActive (state) {
      const index = state.history.findIndex(item => item.id === state.active)
      if (index !== -1) { return state.history[index] }
      return null
    },

    getChatByUuid(state) {
      return (id) => {
        if (id) { return state.chat.find(item => item.id === id)?.data ?? [] }
        return state.chat.find(item => item.id === state.active)?.data ?? []
      }
    }
  },

  actions: {
    addHistory (history, chatData = []) {
      this.history.unshift(history)
      this.chat.unshift({ id: history.id, data: chatData })
      this.active = history.id
    },

    updateHistory (id, edit) {
      const index = this.history.findIndex(item => item.id === id)
      if (index !== -1) {
        this.history[index] = { ...this.history[index], ...edit }
      }
    },

    deleteALLHistory () {
      this.history = []
      this.chat = []
      this.active = ''
    },
    getChatByUuidAndIndex (id, index) {
      const chatIndex = this.chat.findIndex(item => item.id === id)
      if (chatIndex !== -1) { return this.chat[chatIndex].data[index] }
      return null
    },

    addChatByUuid (id, chat) {
      const index = this.chat.findIndex(item => item.id === id)
      if (index !== -1) {
        this.chat[index].data.push(chat)
      }
    },
    chatRecordByUuid (id, record) {
      const index = this.chat.findIndex(item => item.id === id)
      if (index !== -1) {
        this.chat[index].data=[...this.chat[index].data, ...record]
      }
    },
    updateChatByUuid (id, index, chat) {
      const chatIndex = this.chat.findIndex(item => item.id === id)
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = chat
      }
    },

    updateChatSomeByUuid (id, index, chat) {
      const chatIndex = this.chat.findIndex(item => item.id === id)
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = { ...this.chat[chatIndex].data[index], ...chat }
      }
    },

    clearChatByUuid (id) {
      const index = this.chat.findIndex(item => item.id === id)
      if (index !== -1) {
        this.chat[index].data = []
      }
    },
  }
})
