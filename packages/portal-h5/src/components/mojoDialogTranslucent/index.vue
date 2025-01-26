<template>
  <van-dialog
    v-bind="$attrs"
    v-model:show="visible"
    width="600px"
    :close-on-click-overlay="false"
    :close-on-popstate="false"
    class="mojo-dialog-translucent"
    @close="handleClose"
  >
    <!-- Dialog 标题插槽 -->
    <template #title>
      <slot name="title">默认标题</slot>
    </template>

    <!-- Dialog 内容插槽 -->
    <slot>默认内容</slot>

    <!-- Dialog 操作栏插槽 -->
    <template #footer>
      <div class="flex justify-end pb-4 pr-4">
        <slot name="footer" />
      </div>
    </template>
  </van-dialog>
</template>

<script setup>
import { Dialog as VanDialog } from 'vant';

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
const handleClose = () => {
  visible.value = false;
  emit('update:visible', false);
};

// 定义确认按钮的事件
// eslint-disable-next-line no-unused-vars
const confirm = () => {
  emit('confirm');
  handleClose();
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
.mojo-dialog-translucent {
  .van-cell__value.van-field__value{
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.20);
    background: rgba(0, 0, 0, 0.50);
    backdrop-filter: blur(50px);
  }
  .van-dialog__header{
    padding-top: 24px;
    text-align: left;
    padding-left: 16px;
    color: #FFF;
    font-feature-settings: 'dlig' on;
    font-family: "TT Norms Pro";
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    .van-popup__close-icon--top-right{
      top: 16px;
    }
  }

}
</style>
