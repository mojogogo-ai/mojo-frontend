<template>
  <mojoDialogTranslucent
    v-bind="$attrs"
    v-model:show="isVisible"
    closeable
    round
    teleport="body"
    class="m-d-t-c"
    @close="close"
  >
    <template #title>
      Configure Discord bot
    </template>
    <div class="p-4">
      <div class="pd-title">
        Connect to Discord bots and chat with this bot in Discord App.<br>
        <span>How to get Discord Bot token?</span>
      </div>
      <div class="pd-content">
        <div class="pdc-title">
          Discord Bot token <span>*</span>
        </div>
        <div class="pdc-list">
          <van-field v-model="option.token" placeholder="Enter Discord Bot token" />
        </div>
        <!-- Discord Address 输入已注释
        <div class="pdc-list">
          <van-field v-model="option.address" placeholder="Enter Discord Address" />
        </div>
        -->
      </div>
    </div>
    <template #footer>
      <van-button type="primary" :loading="loading" :disabled="loading || !option.token" @click="submitForm">
        Save
      </van-button>
    </template>
  </mojoDialogTranslucent>
</template>

<script setup>
import { ref } from 'vue';
import { botAuthorize } from '@gptx/base/api/application';
import { showToast, Toast } from 'vant';

const emits = defineEmits(['after-upload-knowledge-sources', 'after-update']);
const isVisible = ref(false);

const loading = ref(false);
const option = ref({
  bot_id: null,
  token: '',
  token_type: 'discord',
  address: ''
});

const open = async (data) => {
  isVisible.value = true;
  console.log(data);
  option.value = data;
}

const close = () => {
  isVisible.value = false;
  option.value = {
    bot_id: null,
    token: '',
    address: '',
    token_type: 'discord'
  };
};

const submitForm = async () => {
  if (!option.value.token) {
   showToast('Please enter the Discord Bot token');
    return;
  }
  try {
    loading.value = true;
    if (!option.value.bot_id) {
     showToast('Please select a bot');
      return;
    }
    const res = await botAuthorize({
      id: option.value.bot_id,
      token: option.value.token,
      token_type: option.value.token_type === 'discord' ? 2 : 1,
      address: '' // Discord 暂无地址
    });
    if (res.code === 200) {
      showToast('Authorization success');
      emits('after-update', {
        bot_id: option.value.bot_id,
        token: option.value.token,
        token_type: option.value.token_type,
        address: '' // Discord 暂无地址
      });
      close();
    } else {
     showToast(res.msg);
    }
  } catch (error) {
   showToast('Authorization failed');
  } finally {
    loading.value = false;
  }
};

defineExpose({ open });
</script>

<style lang="scss">
.m-d-t-c {
  --el-dialog-margin-top: 6vh;
  --el-dialog-bg-color: rgba(255, 255, 255, 0.15) !important;
  --el-dialog-border-radius: var(--el-border-radius-large);
  border: 1px solid rgba(255, 255, 255, 0.1);
  -webkit-backdrop-filter: var(--backdrop-blur);
  backdrop-filter: var(--backdrop-blur);
  .el-dialog__title {
    color: #ffffff;
  }
  .van-cell{
    background: transparent;
  }
}
</style>

<style lang="scss" scoped>
.pd-title {
  color: rgba(255, 255, 255, 0.7);
  font-feature-settings: 'dlig' on;
  font-family: "TT Norms Pro";
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  margin-top: 40px;
  margin-bottom: 40px;
  span {
    color: var(--Style, #E1FF01);
  }
}
.pd-content {
  .pdc-title {
    color: #fff;
    font-feature-settings: 'dlig' on;
    font-family: "TT Norms Pro";
    font-size: 16px;
    font-weight: 500;
    line-height: 23px;
    margin-bottom: 32px;
    span {
      color: #f00;
    }
  }
}

.pdc-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
  :deep(.van-cell) {
    background: transparent;
    backdrop-filter: blur(0);
    padding: 0;
    border-radius: 12px;
  }
  .van-field {
    width: 100%;
  }
  :deep(.van-cell__value.van-field__value){
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.20);
    background: rgba(0, 0, 0, 0.50);
    backdrop-filter: blur(50px);
    display: flex;
    width: 311px;
    height: 48px;
    padding: 10px 16px;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }
}
</style>
