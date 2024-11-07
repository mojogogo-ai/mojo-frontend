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
      By publishing your agent on the following platforms, you fully understand and agree to abide by <span>Terms of service for each publishing channel</span>(including, but not limited to, any privacy policy, community guidelines, data processing agreement, etc.).
    </div>
    <div class="pd-content">
      <div class="pdc-title">
        Publish to <span>*</span>
      </div>
      <div class="pdc-list">
        <div v-for="item in publishOptions" class="pdc-list-item">
          <div class="configure-left">
            <el-checkbox
              v-model="item.checked" :disabled="item.id === 'telegram' && !item.telegram_token || item.id === 'discard' && !item.discord_token"
              @change="(checked) => {
                checkboxChange(item, checked)
              }"
            />
            <svg v-if="item.id === 'telegram'" class="ml-4 mr-2.5" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
              <g clip-path="url(#clip0_840_13917)">
                <path d="M12.9487 0.5C9.76686 0.5 6.71248 1.76506 4.46436 4.01469C2.21393 6.26522 0.949374 9.31734 0.94873 12.5C0.94873 15.6813 2.21436 18.7357 4.46436 20.9853C6.71248 23.2349 9.76686 24.5 12.9487 24.5C16.1306 24.5 19.185 23.2349 21.4331 20.9853C23.6831 18.7357 24.9487 15.6813 24.9487 12.5C24.9487 9.31869 23.6831 6.26431 21.4331 4.01469C19.185 1.76506 16.1306 0.5 12.9487 0.5Z" fill="url(#paint0_linear_840_13917)" />
                <path d="M6.38057 12.3733C9.87932 10.8493 12.2118 9.84454 13.3781 9.35904C16.7118 7.97285 17.4037 7.7321 17.8556 7.72395C17.9549 7.72235 18.1762 7.74692 18.3206 7.86364C18.4406 7.96207 18.4743 8.0952 18.4912 8.18867C18.5062 8.28204 18.5268 8.49485 18.5099 8.66098C18.3299 10.5585 17.5481 15.1631 17.1506 17.2884C16.9837 18.1877 16.6518 18.4892 16.3312 18.5186C15.6337 18.5827 15.1049 18.0581 14.4299 17.6158C13.3743 16.9234 12.7781 16.4925 11.7524 15.8169C10.5674 15.0362 11.3362 14.607 12.0112 13.9057C12.1874 13.7222 15.2587 10.9294 15.3168 10.676C15.3243 10.6444 15.3318 10.5262 15.2606 10.464C15.1912 10.4015 15.0881 10.4229 15.0131 10.4398C14.9062 10.4638 13.2206 11.579 9.95057 13.7854C9.47245 14.1142 9.03932 14.2745 8.64932 14.2661C8.22182 14.2569 7.39682 14.0239 6.7837 13.8247C6.0337 13.5804 5.43557 13.4512 5.48807 13.0363C5.51432 12.8203 5.81245 12.5992 6.38057 12.3733Z" fill="white" />
              </g>
              <defs>
                <linearGradient id="paint0_linear_840_13917" x1="1200.95" y1="0.5" x2="1200.95" y2="2400.5" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#2AABEE" />
                  <stop offset="1" stop-color="#229ED9" />
                </linearGradient>
                <clipPath id="clip0_840_13917">
                  <rect width="24" height="24" fill="white" transform="translate(0.94873 0.5)" />
                </clipPath>
              </defs>
            </svg>
            <svg v-if="item.id === 'discard'" class="ml-4 mr-2.5" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
              <rect x="0.94873" y="0.5" width="24" height="24" rx="12" fill="white" />
              <path d="M19.1964 6.70799C18.016 6.15567 16.7671 5.76322 15.4829 5.54102C15.323 5.83021 15.1361 6.21918 15.0072 6.52862C13.6226 6.32041 12.2507 6.32041 10.8916 6.52862C10.7628 6.21925 10.5717 5.83021 10.4102 5.54102C9.12477 5.76331 7.87487 6.15676 6.69387 6.71087C4.34374 10.2623 3.70664 13.7254 4.02516 17.1395C5.58391 18.3035 7.09451 19.0106 8.57965 19.4734C8.94877 18.9658 9.27504 18.4284 9.55509 17.8668C9.02186 17.6638 8.5078 17.4136 8.01904 17.1192C8.14766 17.0239 8.27325 16.9245 8.39564 16.8213C11.3573 18.2066 14.5754 18.2066 17.5018 16.8213C17.6247 16.9239 17.7503 17.0232 17.8783 17.1192C17.3888 17.4144 16.8738 17.6651 16.3395 17.8683C16.6211 18.4322 16.9468 18.9701 17.3149 19.4748C18.8015 19.0121 20.3135 18.305 21.8722 17.1395C22.246 13.1817 21.2338 9.75041 19.1964 6.70799ZM9.95861 15.0399C9.06951 15.0399 8.34037 14.2098 8.34037 13.1991C8.34037 12.1884 9.05397 11.3569 9.95861 11.3569C10.8633 11.3569 11.5924 12.1869 11.5769 13.1991C11.5783 14.2098 10.8633 15.0399 9.95861 15.0399ZM15.9388 15.0399C15.0497 15.0399 14.3206 14.2098 14.3206 13.1991C14.3206 12.1884 15.0341 11.3569 15.9388 11.3569C16.8435 11.3569 17.5725 12.1869 17.557 13.1991C17.557 14.2098 16.8435 15.0399 15.9388 15.0399Z" fill="#5865F2" />
            </svg>

            <span class="pdcli-name">{{ item.name }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
              <g clip-path="url(#clip0_840_13911)">
                <path d="M10.9488 3.54004C7.38285 3.54004 4.48877 6.43412 4.48877 10C4.48877 13.566 7.38285 16.46 10.9488 16.46C14.5147 16.46 17.4088 13.566 17.4088 10C17.4088 6.43412 14.5147 3.54004 10.9488 3.54004ZM11.5948 13.23H10.3028V9.35404H11.5948V13.23ZM11.5948 8.06204H10.3028V6.77004H11.5948V8.06204Z" fill="white" fill-opacity="0.5" />
              </g>
              <defs>
                <clipPath id="clip0_840_13911">
                  <rect width="20" height="20" fill="white" transform="translate(0.94873)" />
                </clipPath>
              </defs>
            </svg>

            <div class="ml-8">
              <div
                v-if="item.id === 'telegram' && !item.telegram_token || item.id === 'discard' && !item.discord_token"
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
      <el-button type="primary" :loading="loading" :disabled="loading || uncheckedOptions.length === 0" @click="submitForm">
        {{ 'Publish' }}
      </el-button>
    </template>
    <ConfigureTelegramDialog ref="configureTelegramDialogRef" @after-update="afterUpdate" />
    <ConfigureDiscordDialog ref="configureDiscordDialogRef" @after-update="afterUpdate" />
  </mojoDialogTranslucent>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue';
import { t } from '@gptx/base/i18n';
import { getOssPresignedUrlV2 } from '@gptx/base/api/user';
import {botInfo, botPublish} from '@gptx/base/api/application';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { ElMessage } from 'element-plus';
import ConfigureTelegramDialog from '@/views/personal/components/publish/ConfigureTelegramDialog.vue';
import { eventBus } from '@gptx/base/utils/eventBus.js';
import ConfigureDiscordDialog from '@/views/personal/components/publish/ConfigureDiscordDialog.vue';

const emits = defineEmits(['after-upload-knowledge-sources', 'after-update']);
const isVisible = ref(false);
const isEdit = ref(false);
const botId = ref(null);
const form = reactive({
  name: '',
  file_url: '',
  fileList: []
});


const afterUpdate = (option) => {
 if(option.token_type === 'telegram') {
   publishOptions[0].telegram_token = option.token;
   publishOptions[0].address = option.address;

 } else if(option.token_type === 'discard') {
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
  },
  {
    id: 'discard',
    name: 'Discord',
    discord_token: '',
    address: '',
    checked: false
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
  } else if (item.id === 'discard') {
    configureDiscordDialogRef.value.open({
      bot_id: botId.value,
      token: item.discord_token || '',
      address: item.address || '',
      token_type: 'discard'
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
        item.address = data.address;
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
  try {
    //botPublish
    await botPublish({
      id: botId.value,
      telegram_token: publishOptions[0].telegram_token,
      discord_token: publishOptions[1].discord_token,
      address: publishOptions[0].address || publishOptions[1].address
    });
    ElMessage.success('Bot publish successfully!');
    emits('after-upload-knowledge-sources');
    eventBus.emit('botPublishSuccess');
    close();
  } catch (error) {
    console.error('Bot publish failed:', error);
    ElMessage.error('Bot publish failed!');
  } finally {
    loading.value = false;
  }
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
</style>
