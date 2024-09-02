import { defineStore } from 'pinia';

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    isSHowSidebar: false
  }),
  actions: {
    setSidebarVisible(visible) {
      this.isSHowSidebar = visible;
    }
  }
});
