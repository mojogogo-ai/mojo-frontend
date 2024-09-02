<template>
  <div
    v-if="isLoaded"
    class="app-page"
  >
    <page-header
      :title="botConfig?.app?.name"
      :right-icon="botConfig?.app?.icon || DefaultBotImg"
      @right-icon-click="onRightIconClick"
    />
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
  <template v-else>
    <div class="flex items-center justify-center app-page">
      <van-loading
        class="cover-loading"
        size="36px"
        vertical
      >
        {{ t('common.loading') }}
      </van-loading>
    </div>
  </template>
  <van-popup
    v-model:show="isShowPassword"
    class="cover-popup"
    position="bottom"
    :close-on-click-overlay="false"
    @closed="_getAppInfo"
  >
    <div class="cover-popup-head">
      {{ t('login.password') }}
    </div>
    <div class="cover-popup-body">
      <van-form
        ref="formRef"
        class="cover-form"
        label-align="top"
        @submit="onConfirmPassword"
      >
        <van-field
          v-model="form.password"
          name="password"
          type="password"
          bordered
          background
          :label="t('login.needPassword')"
          :placeholder="t('login.tips-3')"
          :rules="rules.password"
        />
      </van-form>
    </div>
    <div class="cover-popup-foot">
      <van-button
        size="small"
        type="primary"
        linear
        @click="onConfirmPassword"
      >
        {{ t('common.confirm') }}
      </van-button>
    </div>
  </van-popup>
  <assistant-info
    ref="botInfoRef"
    :bot-info="botConfig"
  />
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { getWebShareChatDetail, webShareAnonymous, webShareVerification } from '@gptx/base/api/share';
import { useBotChatStore } from '@/store/modules/storeChat';
import DefaultBotImg from '@/assets/logo/bot-default-logo.svg';

const storeChat = useBotChatStore();
const isLoaded = ref(false);
const isLoading = ref(true);
const isShowPassword = ref(false);
const {
  params: { id: sharedKey }
} = useRoute();
const form = reactive({
  password: ''
});
const passwordValidator = async (value) => {
  return value.length >= 4;
};
const rules = reactive({
  password: [
    {
      required: true,
      message: t('login.tips-3')
    },
    {
      message: t('bots.publish.placeholder.passwordVali'),
      validator: passwordValidator
    }
  ]
});
/* ref dom */
const botInfoRef = ref(null);
const formRef = ref(null);

const onConfirmPassword = async () => {
  try {
    await formRef.value.validate();
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
      captcha_ticket: captcha_ticket.value ? captcha_ticket.value : undefined,
      captcha_random: captcha_random.value ? captcha_random.value : undefined
    };
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
      data.app = { ...data.app, ...appData };
      botConfig.value = data;
      botConfig.value.shared_key = sharedKey;
      storeChat.setBotInfo(data);
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
const onRightIconClick = () => {
  botInfoRef.value.open();
};

const captcha_ticket = ref('');
const captcha_random = ref('');

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
    captcha_ticket.value = res.ticket;
    captcha_random.value = res.randstr;
    _getAppEncryptInfo();
  }
  if (res.ret === 2) {
    window.location.reload();
  }
}

const initCaptcha2 = () => {
  //滑块校验
  try {
    // 生成一个验证码对象
    // CaptchaAppId：登录验证码控制台，从【验证管理】页面进行查看。如果未创建过验证，请先新建验证。注意：不可使用客户端类型为小程序的CaptchaAppId，会导致数据统计错误。
    //callback：定义的回调函数
    var captcha = new TencentCaptcha('194420956', callback, {
      userLanguage: 'zh-cn',
      loading: true
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
    console.log(error, 'error');
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
};

onMounted(() => {
  let humanVerified = localStorage.getItem('humanVerified');
  if (humanVerified && humanVerified === 'false') {
    initCaptcha2();
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

</style>
<style lang="scss">
.van-cell{
  overflow: visible;
}
.van-field__error-message{
  top: 32px;
  bottom: unset;
}
</style>
