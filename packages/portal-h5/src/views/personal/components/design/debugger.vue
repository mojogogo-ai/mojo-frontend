<template>
  <van-popup
    v-model:show="isShowActionSheet"
    class="cover-popup cover-popup-full"
    position="bottom"
    closeable
    title="Preview & Debug"
  >
    <div
      class="cover-popup-head"
      border="bottom"
    >
      Preview & Debug
    </div>
    <div class="cover-popup-body" style="padding: 0">
      <div class="h-full overflow-hidden">
        <gptx-chat
          :bot-info="botConfig"
          :is-debug="true"
          style="max-width: 100%"
        />
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { t } from '@gptx/base/i18n';

defineProps({
  botConfig: {
    type: Object,
    default: () => ({})
  }
});
const isShowActionSheet = ref(false);

const open = () => {
  isShowActionSheet.value = true;
};

defineExpose({ open });
</script>

<style lang="scss"></style>
