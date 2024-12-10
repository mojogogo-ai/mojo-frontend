<template>
  <van-dialog
    v-bind="$attrs"
    v-model:show="visible"
    class="login-dialog"
    width="90%"
    :close-on-click-overlay="false"
    :before-close="handleClose"
  >
    <!-- Dialog 内容插槽 -->
    <slot>默认内容</slot>

    <!-- Dialog 操作栏插槽 -->
    <template #footer>
      <slot name="footer" />
    </template>
  </van-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

// 定义 props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  themeColor: {
    type: String,
    default: '#409EFF' // 默认主题色
  }
});

// 定义 emits
const emit = defineEmits(['update:visible', 'confirm']);

// ref 用于控制 visible
const visible = ref(props.visible);

// 监听 visible 的变化以同步父组件的状态
watch(() => props.visible, (newVal) => {
  visible.value = newVal;
});

// 监听 visible 的内部变化并传递给父组件
watch(visible, (newVal) => {
  emit('update:visible', newVal);
});

// 定义关闭弹窗的方法
const handleClose = (action) => {
  if (action === 'cancel') {
    visible.value = false;
    emit('update:visible', false);
  }
};

// 定义确认按钮的事件
const confirm = () => {
  emit('confirm');
  handleClose('cancel');
};

// 动态设置主题颜色
onMounted(() => {
  updateThemeColor(props.themeColor);
});

watch(() => props.themeColor, (newColor) => {
  updateThemeColor(newColor);
});

// 设置 CSS 变量实现动态主题颜色
function updateThemeColor(color) {
  document.documentElement.style.setProperty('--dialog-header-bg-color', color);
  document.documentElement.style.setProperty('--dialog-header-text-color', '#fff'); // 默认白色字体
  document.documentElement.style.setProperty('--dialog-body-bg-color', '#fff');      // 默认白色背景
  document.documentElement.style.setProperty('--dialog-body-text-color', color);     // 主体文字颜色
}
</script>

<style lang="scss">
/* 定义弹窗自定义样式 */
.login-dialog .van-dialog__header {
  background-color: var(--dialog-header-bg-color);
  color: var(--dialog-header-text-color);
}

.login-dialog .van-dialog__close-icon {
  color: #000;
  font-size: 20px;
}

.login-dialog .van-dialog__body {
  background-color: var(--dialog-body-bg-color);
  color: var(--dialog-body-text-color);
}
</style>
