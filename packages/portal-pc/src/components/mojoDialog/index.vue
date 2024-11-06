<template>
  <el-dialog
    v-bind="$attrs"
    v-model="visible"
    class="login-dialog"
    width="500"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <!-- Dialog 标题插槽 -->
<!--    <template #title>-->
<!--      <slot name="title">默认标题</slot>-->
<!--    </template>-->

    <!-- Dialog 内容插槽 -->
    <slot>默认内容</slot>

    <!-- Dialog 操作栏插槽 -->
    <template #footer>
      <slot name="footer">
<!--        <el-button @click="handleClose">取消</el-button>-->
<!--        <el-button type="primary" @click="confirm">确认</el-button>-->
      </slot>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { ElDialog, ElButton } from 'element-plus';

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

<style  lang="scss">
/* 定义弹窗自定义样式 */
.mojo-dialog .el-dialog__header {
  background-color: var(--dialog-header-bg-color);
  color: var(--dialog-header-text-color);
  background-color: var(--el-color-primary);

}
.mojo-dialog .el-dialog__close {
  color: #000;
  font-size: 20px;
}

.mojo-dialog .el-dialog__headerbtn:focus .el-dialog__close,
.mojo-dialog .el-dialog__headerbtn:hover .el-dialog__close {
  color: #000 !important;
  opacity: 0.75;
}

.mojo-dialog .el-dialog__body {
  background-color: var(--dialog-body-bg-color);
  color: var(--dialog-body-text-color);
}



</style>
