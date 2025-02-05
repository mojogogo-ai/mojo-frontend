import { defineStore } from 'pinia';

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    isSHowSidebar: false,
    isShowLanguage: false,
  }),
  actions: {
    setSidebarVisible(visible) {
      this.isSHowSidebar = visible;
    },
    setLanguageVisible(visible) {
        this.isShowLanguage = visible;
    },
  }
});
