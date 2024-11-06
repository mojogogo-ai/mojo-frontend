// 创建事件总线，通常在一个单独的文件中创建，例如 eventBus.js
import mitt from 'mitt';
export const eventBus = mitt();
