<template>
  <mojoDialogTranslucent
    v-model="isVisible"
    v-bind="$attrs"
    :title="'Configure Telegram bot'"
    class="m-d-t-c"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
    append-to-body
  >
    <div class="pd-title">
      {{t("personal.telegram.title")}}<br>
      <span class="cursor-pointer" @click="goPage">{{t("personal.telegram.subtitle")}}</span>
    </div>
    <div class="pd-content">
      <div class="pdc-title">
        {{t("personal.telegram.botToken")}}<span>*</span>
      </div>
      <div class="pdc-list">
        <el-input v-model="option.token" />
      </div>
      <!--      option.address-->
      <div class="pdc-title mt-[20px]">
        {{t("personal.telegram.address")}}<span>*</span>
      </div>
      <div class="pdc-list">
        <el-input v-model="option.address" />
      </div>
    </div>
    <template #footer>
      <el-button type="primary" :loading="loading" :disabled="loading || !option.token" @click="submitForm">
        {{t("personal.telegram.button")}}
      </el-button>
    </template>
  </mojoDialogTranslucent>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { ref } from 'vue';
import {botAuthorize} from '@gptx/base/api/application';
import { ElMessage } from 'element-plus';

const emits = defineEmits(['after-upload-knowledge-sources', 'after-update']);
const isVisible = ref(false);

const goPage = () => {
  window.open('https://core.telegram.org/bots/tutorial#obtain-your-bot-token');
};
const loading = ref(false);
const option = ref({
  bot_id: null,
  token: '',
  token_type: 'telegram',
  address: ''
});

const open = async (data) => {
  isVisible.value = true;
  console.log(data);
  // debugger
  option.value = data;
}

const close = () => {
  isVisible.value = false;
  option.value = {
    bot_id: null,
    token: '',
    address: '',
    token_type: 'telegram'
  };
};



const submitForm = async () => {
  if(!option.value.token) {
    ElMessage.error('Please enter the Telegram Bot token');
    return;
  }
  try {
    loading.value = true;
    if(!option.value.bot_id) {
      ElMessage.error('Please select a bot');
      return;
    }
    if(!option.value.token) {
      ElMessage.error('Please enter the Telegram Bot token');
      return;
    }
    if(!option.value.address) {
      ElMessage.error('Please enter the Telegram Bot address');
      return;
    }
    const res = await botAuthorize({
      id: option.value.bot_id,
      token: option.value.token,
      // 1 telegram 2 discord
      token_type: option.value.token_type === 'telegram' ? 1 : 2,
      address: option.value.address
    });
    if(res.code === 200) {
      ElMessage.success('Authorization success');
      emits('after-update', {
        bot_id: option.value.bot_id,
        token: option.value.token,
        token_type: option.value.token_type,
        address: option.value.address
      });
      close();
    } else {
      ElMessage.error(res.msg);
    }
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    ElMessage.error('Authorization failed');
  } finally {
    loading.value = false;
  }
};



defineExpose({ open });
</script>

<style  lang="scss">
.m-d-t-c {
  --el-dialog-margin-top: 6vh;
  --el-dialog-bg-color: rgba(255, 255, 255, 0.15)!important;
  --el-dialog-border-radius: var(--el-border-radius-large);
  border: 1px solid rgba(255, 255, 255, 0.1);
  -webkit-backdrop-filter: var(--backdrop-blur);
  backdrop-filter: var(--backdrop-blur);
  .el-dialog__title{
    color: #ffffff;
  }
}
</style>

<style lang="scss" scoped>

.pd-title{

  color: rgba(255, 255, 255, 0.70);
  font-feature-settings: 'dlig' on;
  font-family: "TT Norms Pro";
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px; /* 138.462% */
  margin-top: 40px;
  margin-bottom: 40px;
  span{
    color: var(--Style, #E1FF01);
    font-feature-settings: 'dlig' on;
    font-family: "TT Norms Pro";
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
  }
}
.pd-content{
  .pdc-title{
    color: #FFF;
    font-feature-settings: 'dlig' on;
    font-family: "TT Norms Pro";
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 23px; /* 143.75% */
    margin-bottom: 32px;
    span{
      color: #F00;
      font-feature-settings: 'dlig' on;
      font-family: "TT Norms Pro";
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 23px;
    }
  }
}
.pdc-list{
  display: flex;
  //align-items: center;
  flex-direction: column;
  gap: 32px;
  //justify-content: space-between;
  .pdc-list-item{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .configure-left{
    display: flex;
    align-items: center;
    .pdcli-name{
      color: #FFF;
      font-feature-settings: 'dlig' on;
      font-family: "TT Norms Pro";
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 23px; /* 164.286% */
    }
    .not-configured{
      display: inline-flex;
      height: 21px;
      padding: 2px 8px;
      justify-content: center;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.20);
      color: rgba(255, 255, 255, 0.70);
      font-feature-settings: 'dlig' on;
      font-family: "TT Norms Pro";
      font-size: 11px;
      font-style: normal;
      font-weight: 500;
      line-height: 23px; /* 209.091% */
    }
    .configured{
      display: inline-flex;
      padding: 2px 8px;
      justify-content: center;
      align-items: center;
      gap: 10px;
      border-radius: 4px;
      background: var(--neon-green-20, rgba(224, 255, 49, 0.20));
      color: #FFF;
      font-feature-settings: 'dlig' on;
      font-family: "TT Norms Pro";
      font-size: 11px;
      font-style: normal;
      font-weight: 500;
      line-height: 23px; /* 209.091% */
    }
  }
  .configure-btn{
    display: flex;
    //width: 56px;
    height: 17px;
    flex-direction: column;
    justify-content: center;
    flex-shrink: 0;
    color: var(--Style, #E1FF01);
    text-align: right;
    font-feature-settings: 'dlig' on;
    font-family: "TT Norms Pro";
    font-size: 11px;
    font-style: normal;
    font-weight: 500;
    line-height: 23px; /* 209.091% */
    cursor: pointer;
    padding-right: 12px;
  }
}
</style>
