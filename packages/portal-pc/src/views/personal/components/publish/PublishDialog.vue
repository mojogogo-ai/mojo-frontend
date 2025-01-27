<template>
  <mojoDialogTranslucent
    v-model="isVisible"
    v-bind="$attrs"
    :title="'Publish'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
  >
    <div class="pd-title">
       {{t("personal.public.titleOne")}}<span>{{t("personal.public.titleTwo")}}</span>{{t("personal.public.titleThree")}}
    </div>
    <div class="pd-content">
      <div class="pdc-title">
         {{t("personal.public.subtitle")}} <span>*</span>
      </div>
      <div class="pdc-list">
        <div v-for="item in publishOptions" class="pdc-list-item">
          <div class="configure-left">
            <!-- <el-checkbox
              v-model="item.checked" :disabled="item.id === 'telegram' && !item.telegram_token || item.id === 'discord' && !item.discord_token"
              @change="(checked) => {
                checkboxChange(item, checked)
              }"
            /> -->
            <svg-icon v-if="item.id === 'telegram'" name="telegram-icon" class="icon" />

            <svg-icon v-if="item.id === 'discord'" name="discord-icon" class="icon" />

            <span class="pdcli-name">{{ item.name }}</span>

            <svg-icon name="info" class="icon-info" />

            <div class="ml-8">
              <div
                v-if="item.id === 'telegram' && !item.telegram_token || item.id === 'discord' && !item.discord_token"
                class="not-configured"
              >
                Not configured
              </div>
              <div v-else class="configured">
                Authorized
              </div>
            </div>
          </div>

          <div class="configure-btn" @click="goConfigure(item)">
            Configure
          </div>
        </div>
      </div>
    </div>
    <div class="divider-line" />
    <template #footer>
      <el-button type="primary" :loading="loading" :disabled="loading" @click="submitForm">
        {{ 'Save' }}
      </el-button>
    </template>
    <ConfigureTelegramDialog ref="configureTelegramDialogRef" @after-update="afterUpdate" />
    <ConfigureDiscordDialog ref="configureDiscordDialogRef" @after-update="afterUpdate" />
  </mojoDialogTranslucent>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import {botInfo, botPublish} from '@gptx/base/api/application';
import { ElMessage } from 'element-plus';
import ConfigureTelegramDialog from '@/views/personal/components/publish/ConfigureTelegramDialog.vue';
import { eventBus } from '@gptx/base/utils/eventBus.js';
import ConfigureDiscordDialog from '@/views/personal/components/publish/ConfigureDiscordDialog.vue';

const emits = defineEmits(['after-upload-knowledge-sources', 'after-update']);
const isVisible = ref(false);
const botId = ref(null);


const afterUpdate = (option) => {
 if(option.token_type === 'telegram') {
   publishOptions[0].telegram_token = option.token;
   publishOptions[0].address = option.address;

 } else if(option.token_type === 'discord') {
   publishOptions[1].discord_token = option.token;
    publishOptions[1].address = option.address;
 }
}
const configureDiscordDialogRef = ref(null);
const publishOptions = reactive([
  // 1 telegram 2 discord
  {
    id: 'telegram',
    name: 'Telegram',
    telegram_token: '',
    address: '',
    checked: false
  // },
  // {
  //   id: 'discord',
  //   name: 'Discord',
  //   discord_token: '',
  //   address: '',
  //   checked: false
  }
])
const uncheckedOptions = computed(() => publishOptions.filter(item => item.checked));
console.log(uncheckedOptions.value, 'uncheckedOptions')
const configureTelegramDialogRef = ref(null);
const goConfigure = (item) => {
  if (item.id === 'telegram') {
    configureTelegramDialogRef.value.open({
      bot_id: botId.value,
      token: item.telegram_token || '',
      address: item.address || '',
      token_type: 'telegram'
    });
  } else if (item.id === 'discord') {
    configureDiscordDialogRef.value.open({
      bot_id: botId.value,
      token: item.discord_token || '',
      address: item.address || '',
      token_type: 'discord'
    });
  }
};

const loading = ref(false);


const open = async (option) => {
  isVisible.value = true;
  //TODO:等待恢复
  botId.value = option.id;
  // botId.value = 1;
  try {
    const res = await botInfo({id: botId.value})
    const {code, data} = res;
    if(code === 200) {
      publishOptions.forEach(item => {
        item.telegram_token = data.telegram_token;
        item.discord_token = data.discord_token;
        item.address = data.telegram_address || data.discord_address;
      });
    } else {
      ElMessage.error('Failed to get bot info');
    }
  } catch (e) {
    ElMessage.error('Failed to get bot info:', e);
    console.error('Failed to get bot info:', e);
  }
}

const close = () => {
  isVisible.value = false;
  botId.value = null;
  publishOptions.forEach(item => {
    item.telegram_token = '';
    item.discord_token = '';
    item.address = '';
    item.checked = false;
  });
};

const checkboxChange = (item, checked) => {
  console.log(item, checked)
  // item.checked = checked;
};


const submitForm = async () => {
  if(botId.value ===null) {
    ElMessage.error('Please select a bot first!');
    return;
  }
  loading.value = true;
  // try {
  //   //botPublish
  //   await botPublish({
  //     id: botId.value,
  //     telegram_token: publishOptions[0].telegram_token,
  //     discord_token: publishOptions[1].discord_token,
  //     address: publishOptions[0].address || publishOptions[1].address
  //   });
    // ElMessage.success('Bot publish successfully!');
    emits('after-upload-knowledge-sources');
    eventBus.emit('botPublishSuccess');
    close();
  // } catch (error) {
  //   console.error('Bot publish failed:', error);
  //   ElMessage.error('Bot publish failed!');
  // } finally {
  //   loading.value = false;
  // }
};



defineExpose({ open });
</script>

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
.icon{
  font-size: 24px;
}
.icon-info{
  font-size: 20px;
}
</style>
