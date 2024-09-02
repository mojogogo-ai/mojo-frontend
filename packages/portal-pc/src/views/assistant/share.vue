<template>
  <div
    v-if="isLoaded"
    class="app-page"
  >
    <div class="items-center app-page-top">
      <div class="app-page-col">
        <el-popover
          width="360px"
          popper-class="bot-info-popper"
          :show-arrow="false"
        >
          <template #reference>
            <div class="flex">
              <el-image
                class="page-list-img app-page-col"
                :src="__data.appInfo.icon || defaultBotImage"
              >
                <template #error>
                  <div class="page-list-img__error">
                    <el-icon>
                      <Picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
              <div class="app-page-col">
                <div class="flex items-center text-base font-black leading-none">{{ __data.appInfo.name }}&nbsp;</div>
                <div class="text-xs flex items-center leading-none mt-1 text-[#7a7a7a]">
                  <div class="mr-2">@ {{ __data.appInfo.author_name }}</div>
                  <div class="pl-2 border-l chat-separator">
                    {{ t('bots.publishAt') }}
                    {{
                      dayjs(__data.appInfo.published_at)
                        .subtract(new Date().getTimezoneOffset(), 'minute')
                        .format('YYYY-MM-DD HH:mm:ss')
                    }}
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #default>
            <el-image
              class="bot-info-img"
              fit="cover"
              :src="__data.appInfo.icon || defaultBotImage"
            >
              <template #error>
                <div class="page-list-img__error">
                  <el-icon>
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
            <div class="flex flex-col bot-info">
              <el-scrollbar class="h-full">
                <div class="px-3">
                  <div class="w-full mb-1 text-lg font-black">{{ __data.appInfo.name }}</div>
                  <div class="mb-2 w-full text-[#7a7a7a]">
                    <n-ellipsis
                      expand-trigger="click"
                      line-clamp="10"
                      :tooltip="false"
                    >
                      <div v-html="(__data.appInfo?.description || '').replace(/\n/g, '<br/>')" />
                    </n-ellipsis>
                  </div>
                  <div class="mb-3">
                    <div class="mb-1 font-black">{{ t('bots.label.catalog') }}</div>
                    <el-button
                      v-for="{ name } in __data.appInfo?.categories"
                      type="primary"
                      size="small"
                      linear
                    >
                      {{ t(name) }}
                    </el-button>
                  </div>
                  <div class="mb-3">
                    <div class="mb-1 font-black">{{ t('bots.n') }}</div>
                    <el-button
                      type="primary"
                      size="small"
                      linear
                    >
                      {{ __data.llm?.llm }}
                    </el-button>
                  </div>
                  <!-- <div class="mb-3">
                <div class="mb-1 font-black">插件</div>
                <div class="flex flex-wrap">
                  <el-button
                    type="primary"
                    size="small"
                    linear
                  >
                    谷歌搜索
                  </el-button>
                </div>
              </div> -->
                </div>
              </el-scrollbar>
            </div>
          </template>
        </el-popover>
      </div>
      <div class="ml-[auto!important]">
        <el-button
          type="primary"
          linear
          @click="share"
        >
          {{ t('bots.a3') }}
        </el-button>
      </div>
    </div>
    <div class="app-page-content">
      <div class="relative w-full h-full mx-auto overflow-hidden">
        <GptxChat
          chat-api-url="/portal/conversation/chat-web-share"
          :bot-info="botConfig"
          :is-debug="false"
          style="max-width: 100%"
        />
      </div>
    </div>
  </div>
  <div
    v-else
    v-loading="isLoading"
    class="app-page"
    element-loading-background="transparent"
    :element-loading-text="t('common.loading')"
  />
  <el-dialog
    v-model="isShowPassword"
    width="622px"
    align-center
    destroy-on-close
    :title="t('login.password')"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    @closed="_getAppInfo"
  >
    <el-form
      ref="formRef"
      label-position="top"
      :model="form"
      :rules="rules"
      @submit.prevent
    >
      <el-form-item
        :label="t('login.needPassword')"
        prop="password"
      >
        <el-input
          v-model="form.password"
          type="password"
          show-password
          :placeholder="t('login.tips-3')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button
        type="primary"
        linear
        @click="onConfirmPassword"
      >
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { getWebShareChatDetail, webShareAnonymous, webShareVerification } from '@gptx/base/api/share';
import { NEllipsis } from 'naive-ui';
import defaultBotImage from '@/assets/logo/bot-default-logo.svg';
import dayjs from 'dayjs';
import { useClipboard } from '@vueuse/core';

const isLoaded = ref(false);
const isLoading = ref(true);
const isShowPassword = ref(false);
const {
  params: { id: sharedKey }
} = useRoute();
const __data = reactive({
  appInfo: {},
  llm: {}
});
const form = reactive({
  password: ''
});
const passwordValidator = async (rule, value, callback) => {
  if (value === '') {
    callback(new Error(t('login.tips-3')));
  } else {
    if (value.length >= 4) {
      callback();
    } else {
      callback(new Error(t('bots.publish.placeholder.passwordVali')));
    }
  }
};
const rules = reactive({
  password: [
    {
      required: true,
      trigger: 'blur',
      validator: passwordValidator
    }
  ]
});

const share = () => {
  const code = location.href;
  if (code) {
    const { copy, copied } = useClipboard({ code, legacy: true });
    copy(code);
    if (copied) {
      ElMessage.success(t('bots.bb'));
    } else {
      ElMessage.error(t('chat.copy2'));
    }
  }
};
// confirm verification
const onConfirmPassword = async () => {
  try {
    const { code } = await webShareVerification({ shared_key: sharedKey, access_key: form.password });
    if (code === 200) {
      isShowPassword.value = false;
    }
  } catch (e) {
    console.log(e);
  }
};
const botConfig = ref(null);
const _getAppEncryptInfo = async () => {
  try {
    let params = {
      shared_key: sharedKey,
      "captcha_ticket":  captcha_ticket.value? captcha_ticket.value : undefined,
      "captcha_random":  captcha_random.value? captcha_random.value : undefined
    }
    const { data, code } = await webShareAnonymous(params);
    if (code === 200) {
      // if password needed
      if (data?.visitor?.verification_required) {
        isShowPassword.value = true;
      } else {
        await _getAppInfo(data.app);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
const _getAppInfo = async (appData) => {
  isLoading.value = true;
  try {
    const { data, code } = await getWebShareChatDetail({ shared_key: sharedKey });
    if (code === 200) {
      data.app = {...data.app, ...appData}
      botConfig.value = data;
      botConfig.value.shared_key = sharedKey;
      __data.appInfo = data.app;
      __data.llm = data.llm;
      document.title = __data.appInfo.name;
      setTimeout(() => {
        isLoading.value = false;
        isLoaded.value = true;
      }, 300);
    }
  } catch (e) {
    console.log(e);
    setTimeout(() => {
      isLoading.value = false;
      isLoaded.value = true;
    }, 300);
  }
};

const captcha_ticket = ref('')
const captcha_random = ref('')
function callback(res) {
  // 第一个参数传入回调结果，结果如下：
  // ret         Int       验证结果，0：验证成功。2：用户主动关闭验证码。
  // ticket      String    验证成功的票据，当且仅当 ret = 0 时 ticket 有值。
  // CaptchaAppId       String    验证码应用ID。
  // bizState    Any       自定义透传参数。
  // randstr     String    本次验证的随机串，后续票据校验时需传递该参数。
  // verifyDuration     Int   验证码校验接口耗时（ms）。
  // actionDuration     Int   操作校验成功耗时（用户动作+校验完成）(ms)。
  // sid     String   链路sid。
  console.log('callback:', res);

  // res（用户主动关闭验证码）= {ret: 2, ticket: null}
  // res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}
  // res（请求验证码发生错误，验证码自动返回trerror_前缀的容灾票据） = {ret: 0, ticket: "String", randstr: "String",  errorCode: Number, errorMessage: "String"}
  // 此处代码仅为验证结果的展示示例，真实业务接入，建议基于ticket和errorCode情况做不同的业务处理
  if (res.ret === 0) {
    captcha_ticket.value = res.ticket
    captcha_random.value = res.randstr
    _getAppEncryptInfo()
  }
  if (res.ret === 2) {
    window.location.reload()
  }
}
const initCaptcha2 = ()=>{//滑块校验
  try {
      // 生成一个验证码对象
      // CaptchaAppId：登录验证码控制台，从【验证管理】页面进行查看。如果未创建过验证，请先新建验证。注意：不可使用客户端类型为小程序的CaptchaAppId，会导致数据统计错误。
      //callback：定义的回调函数
      var captcha = new TencentCaptcha('194420956', callback, {
        userLanguage: 'zh-cn',
        loading: true,
        // showFn: (ret) => {
        //   const {
        //     duration, // 验证码渲染完成的耗时(ms)
        //     sid, // 链路sid
        //   } = ret;
        // },
      });
      // 调用方法，显示验证码
      captcha.show();
  } catch (error) {
    console.log(error,'error')
    // 加载异常，调用验证码js加载错误处理函数
    var appid = '194420956';
    // 生成容灾票据或自行做其它处理
    var ticket = 'trerror_1001_' + appid + '_' + Math.floor(new Date().getTime() / 1000);
    callback({
      ret: 0,
      randstr: '@' + Math.random().toString(36).substr(2),
      ticket: ticket,
      errorCode: 1001,
      errorMessage: 'jsload_error'
    });
  }
}

onMounted(() => {
  let humanVerified = localStorage.getItem('humanVerified')
  if(humanVerified&&humanVerified==='false'){
    initCaptcha2()
  } else {
    _getAppEncryptInfo();
  }
});
</script>

<style lang="scss" scoped>
.app-page {
  padding-top: 0;
}

.page-list-img {
  width: 32px;
  height: 32px;
}

.app-page-top {
  display: flex;
  padding: 17px 26px;
  margin-bottom: 0;
  min-height: 67px;
  background: rgba(#fff, 0.41);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.16);
}

.app-page-content {
  padding: 0;
  overflow: hidden;
}

.page-list-img__error {
  background-color: #fff;
}

.chat-separator {
  position: relative;

  &::before {
    position: absolute;
    top: 2px;
    bottom: 1px;
    left: -1px;
    width: 1px;
    background-color: #ddd;
    content: '';
  }
}

.bot-info {
  height: 464px;
  padding: 39px 0 12px;
  background-color: var(--el-color-white);
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.16);
  overflow: hidden;
}

.bot-info-img {
  position: absolute;
  top: 3px;
  left: 4px;
  height: 66px;
  width: 66px;
  border-radius: 50%;
  border: 2px solid var(--el-color-white);
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.16);
}
</style>
<style lang="scss">
.bot-info-popper {
  &.el-popover.el-popper {
    background: unset;
    box-shadow: unset;
    border: unset;
    padding: 33px 0 0;
    color: #36353a;
  }
}
</style>
