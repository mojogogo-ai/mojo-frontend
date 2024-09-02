import { defineStore } from 'pinia';

export const useBotChatStore = defineStore('bot-chat', {
  state: () => ({
    botInfo: {}
  }),
  actions: {
    setBotInfo(botInfo) {
      this.botInfo = botInfo;
    }
  }
});
