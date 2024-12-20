<template>
  <el-dialog
    v-model="isVisible"
    width="200px"
    title=""
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="true"
    destroy-on-close
    align-center
  >
    <div class="flex flex-col items-center">
      <div class="w-[100px] h-[100px] px-4 py-8 bg-black/50 rounded-3xl border-2 border-[#e1ff01] justify-between items-center inline-flex">
        <svg-icon
          class="text-[80px] text-[#e1ff01]"
          name="Unlocked"
        />
      </div>
      <div class="text-center text-white text-3xl my-6 font-medium font-['TT Norms Pro']">Upgrade to unlock feature</div>
      <div class="w-[140] text-center text-white/70 mb-8  text-xl font-medium font-['TT Norms Pro'] leading-7">Unleash the power of AI to increase your engagement rate.</div>
    </div>
    <template #footer>
      <div class="flex justify-center w-full">
        <el-button
          style="width: 100%;"
          type="primary"
          :loading="launchLoading"
          :disabled="true"
          linear
          @click="__sendTr()"
        >
          {{ 'Coming soon...' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
const isVisible = ref(false);
const launchLoading = ref(false);
const open = async () => {
  isVisible.value = true;
};
// const close = () => {
//   isVisible.value = false;
// };


// commit action
const publicKey = ref('') // publicKey就是address

const __sendTr = async () => {
 
};


defineExpose({ open });
onMounted( () => {
});
</script>

<style lang="scss">
.success-result-content{
  .el-result__title p{
    color: #fff !important;
  }
}

</style>
