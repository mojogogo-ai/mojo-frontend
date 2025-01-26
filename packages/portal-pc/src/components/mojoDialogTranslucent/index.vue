<template>
  <el-dialog
    v-bind="$attrs"
    v-model="visible"
    width="600px"
    class="mojo-dialog-translucent"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <!-- Dialog 内容插槽 -->
    <slot>默认内容</slot>

    <!-- Dialog 操作栏插槽 -->
    <template #footer>
      <slot name="footer">
        <!--        <el-button @click="handleClose">取消</el-button>-->
        <!--        <el-button type="primary" >确认</el-button>-->
      </slot>
    </template>
  </el-dialog>
</template>

<script setup>
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
.mojo-dialog-translucent{
  padding: 24px!important;
  .el-dialog__body{
    padding: 0!important;
  }
  .el-dialog__headerbtn{
    top:14px;
    right: 14px;
    font-size: 24px;
  }
  .el-dialog__footer{
    padding: 24px 0 12px!important;
    border-top: 0!important;
  }
}

</style>
