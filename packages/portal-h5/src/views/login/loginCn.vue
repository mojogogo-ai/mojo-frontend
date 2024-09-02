<template>
  <div class="login">
    <div class="login-header">
      <div
        style="width: 160px"
        class="sidebar-logo"
      >
        <a
          key="collapse"
          class="sidebar-logo__link"
          :href="WEBSITE_HOME"
        >
          <img
            :src="logoLeft"
            :alt="isCn ? $t('common.productName_Cn') : $t('common.productName')"
            class="sidebar-logo__icon"
          >
          {{ isCn ? $t('common.productName_Cn') : $t('common.productName') }}
        </a>
      </div>
      <div class="w-[120px]">
        <selector
          v-model="curLang"
          :columns="langList"
          :columns-field-names="{ text: 'lable' }"
          @update:model-value="changeLangCommand"
        />
      </div>
    </div>
    <div class="login-form">
      <!-- <img class="w-[0] sm:w-[0px] md:w-[400px] lg:w-[660px]" :src="logoLoginLeft"> -->
      <div class="login-container">
        <van-form
          ref="loginRef"
          class="cover-form"
          @submit="loginByPhone"
        >
          <h2 class="login-title">{{ $t('login.smsLogin') }}</h2>
          <div class="flex w-full">
            <van-field
              ref="phoneNumberRef"
              v-model="loginForm.phoneNumber"
              name="phoneNumber"
              type="number"
              autocomplete="off"
              background
              clearable
              :placeholder="$t('login.sj')"
              :rules="formRules.phoneNumber"
            >
              <template #left-icon>
                <svg-icon
                  class="mt-1 text-base"
                  name="mobile"
                />
              </template>
            </van-field>
          </div>
          <div class="flex w-full">
            <div class="flex-1 mr-1">
              <van-field
                v-model.trim="loginForm.verificationCode"
                name="verificationCode"
                class="verify-field"
                maxlength="4"
                autocomplete="off"
                background
                clearable
                :placeholder="$t('login.code')"
                :rules="formRules.verificationCode"
              >
                <template #button>
                  <van-button
                    :loading="smsLoading"
                    style="width: 105px; height: 40px"
                    type="primary"
                    @click="__getSmsCode"
                  >
                    {{ showloginCode ? $t('login.getVerificationCode') : loginForm.count + 's' }}
                  </van-button>
                </template>
              </van-field>
            </div>
          </div>
          <van-checkbox
            v-model="loginForm.userAgreement"
            class="cover-checkbox"
            icon-size="16"
            shape="square"
            @change="userAgreementChange"
          >
            <div class="user-greement-content">
              <div
                v-if="!isDemo"
                class="tips"
              >
                {{ $t('login.tips-4') }}
              </div>
              <div class="tips_2">
                <span
                  class="btn"
                  @click="termsServiceCnVisible = true"
                >
                  {{ $t('login.userAgreement') }}
                </span>
                <span>{{ $t('common.and') }}</span>
                <span
                  class="btn"
                  @click="privacyPolicyCnVisible = true"
                >
                  {{ $t('login.privacyPolicy') }}
                </span>
              </div>
            </div>
          </van-checkbox>
          <van-button
            type="primary"
            class="mt-4"
            linear
            block
            :loading="loginLoading"
            @click.prevent="loginByPhone"
          >
            <span> {{ loginLoading ? $t('login.logining') : $t('login.login') }}</span>
          </van-button>
        </van-form>
      </div>
    </div>

    <van-popup
      v-model:show="termsServiceCnVisible"
      class="cover-popup"
      position="bottom"
      closeable
    >
      <div class="cover-popup-head">{{ t('login.userAgreement') }}</div>
      <div class="cover-popup-body">
        <ModelServiceCn height="100%" />
      </div>
    </van-popup>
    <van-popup
      v-model:show="privacyPolicyCnVisible"
      class="cover-popup"
      position="bottom"
      closeable
    >
      <div class="cover-popup-head">{{ t('login.privacyPolicy') }}</div>
      <div class="cover-popup-body">
        <PrivacyPolicyCn height="100%" />
      </div>
    </van-popup>
  </div>
  <div
    class="copy-right"
  >
    <span>Copyright © 达朴汇联版权所有</span>
    <div>
      <a
        href="https://beian.miit.gov.cn/#/Integrated/index" 
        rel="noopener noreferrer" target="_blank"
      >皖ICP备17024979号-2</a> 
      <span> | </span>
      <a
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=34019202000668"
        rel="noopener noreferrer" target="_blank"
      >
        皖公网安备 34019202000668</a>
    </div>
  </div>
</template>

<script setup>
import logoLeft from '@/assets/logo/safe-gen-ai.svg';
import useUserStore from '@/store/modules/user';
import { t } from '@gptx/base/i18n';
import { getSmsCode, smsCaptchaLogin, visitorLogin, welcomeAccess } from '@gptx/base/api/login';
import { getCurLang, supportLang } from '@gptx/base';
import { setRefreshToken } from '@gptx/base/utils/auth';
import { validatorAgreement } from '@gptx/base/utils/validator';

const curLang = getCurLang(); // 当前语言
const loginLoading = ref(false);
const WEBSITE_HOME = window.WEBSITE_HOME;
const userStore = useUserStore();
const router = useRouter();
const { proxy } = getCurrentInstance();

const showloginCode = ref(true);
const prefix = ref("+86");

const privacyPolicyCnVisible = ref(false);
const termsServiceCnVisible = ref(false);
const isCn = computed(() => {
  return window.SITE_TYPE && window.SITE_TYPE === '2';
});
const isDemo = computed(() => {
  return window.IS_DEMO && window.IS_DEMO === true;
});

// 登录表单信息
const loginForm = ref({
  verificationCode: '',
  userAgreement: false,
  timer: null,
  count: '',
  phoneNumber: ''
});
const validatorDigit = (value, rule) => {
  const digit = /^(\d){4}$/;
  if (!value || !digit.test(value)) {
    rule.message = t('login.c');
    return false;
  }
  return true;
};
const validatorPhone = (value, rule) => {
  // const mobile = /^1(3|4|5|6|7|8|9)\d{9}$/ || /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/;
  const mobile = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
  if (!value) {
    rule.message = t('login.needPhone');
    return false;
  }
  if (!mobile.test(value)) {
    rule.message = t('login.phoneNumber');
    return false;
  }
  return true;
};
const formRules = {
  verificationCode: [{ validator: validatorDigit }],
  userAgreement: [{ required: true, validator: validatorAgreement, trigger: 'change' }],
  phoneNumber: [{ validator: validatorPhone }]
};

// 获取验证码倒计时
const handleTimeCount = () => {
  const TIME_COUNT = 60;
  if (!loginForm.value.timer) {
    showloginCode.value = false;
    loginForm.value.count = TIME_COUNT;
    loginForm.value.timer = setInterval(() => {
      if (loginForm.value.count > 0 && loginForm.value.count <= TIME_COUNT) {
        loginForm.value.count -= 1;
      } else {
        showloginCode.value = true;
        clearInterval(loginForm.value.timer);
        loginForm.value.timer = null;
      }
    }, 1000);
  }
};

const smsLoading = ref(false);
const __getSmsCode = async () => {
  try {
    if (!showloginCode.value) {
      return;
    }
    await proxy.$refs.loginRef.validate(['phoneNumber']);
    smsLoading.value = true;
    await __visitorLogin();
    if (visitorAccessToken.value && humanVerified.value) {
      let params = {
        phone: loginForm.value.phoneNumber,
        cc: prefix.value
      };
      getSmsCode(params, visitorAccessToken.value)
        .then((res) => {
          if (res.code === 200) {
            handleTimeCount();
            showSuccessToast(t('login.tips-5'));
          } else {
            showFailToast(res.msg);
          }
          smsLoading.value = false;
        })
        .catch(() => {
          smsLoading.value = false;
        });
    } else {
      initCaptcha('194420956'); //滑块校验
    }
  } catch (e) {
    console.log(e);
  }
};

const loginByPhone = async () => {
  try {
    await proxy.$refs.loginRef.validate();
    loginLoading.value = true;
    let params = {
      // phone: loginForm.value.phoneNumber,
      // cc: prefix.value,
      code: loginForm.value.verificationCode
    };
    smsCaptchaLogin(params, visitorAccessToken.value)
      .then((res) => {
        console.log(res, 'smsCaptchaLogin');
        if (res.code === 200) {
          handleToken(res.data);
        } else {
          //
        }
      })
      .catch(() => {
        loginLoading.value = false;
      });
  } catch (e) {
    console.log(e);
  }
};

const handleToken = (params) => {
  let { access_token, refresh_token } = params;
  let anonymousToken = localStorage.getItem('anonymousToken') || '';
  welcomeAccess(access_token, anonymousToken)
    .then((res) => {
      if (res.code === 200) {
        let userInfo = {
          accessToken: access_token,
          stsTokenManager: {
            expirationTime: new Date().getTime() + 2 * 3600 * 1000
          },
          emailVerified: false,
          id: res.data.user_info.id,
          isAnonymous: false
        };
        setRefreshToken(refresh_token);
        if (res.data && res.data.system_chat) {
          localStorage.setItem('systemChat', JSON.stringify(res.data.system_chat));
          localStorage.setItem('user', JSON.stringify(res.data.user_info));
        }
        localStorage.removeItem('anonymousToken');
        handleRoute();
        userStore.loginOthers(userInfo);
      }

      loginLoading.value = false;
    })
    .catch(() => {
      loginLoading.value = false;
    });
};

const visitorAccessToken = ref('');
const humanVerified = ref(true);
const __visitorLogin = () => {
  return new Promise((resolve, reject) => {
    let params = {
      captcha_ticket: captcha_ticket.value,
      captcha_random: captcha_random.value
    };
    visitorLogin(params)
      .then((res) => {
        if (res.code === 200) {
          visitorAccessToken.value = res.data.access_token;
          humanVerified.value = res.data.human_verified;
          resolve(true);
        } else {
          reject(false);
          smsLoading.value = false;
          showFailToast(res.msg);
        }
      })
      .catch(() => {
        reject(false);
        smsLoading.value = false;
      });
  });
};

const handleRoute = () => {
  router.push({ path: '/chat' });
};
const userAgreementChange = (value) => {
  localStorage.setItem('userAgreement', value);
};

// 定义回调函数
const captcha_ticket = ref('');
const captcha_random = ref('');

function captchaCallback(res) {
  // 第一个参数传入回调结果，结果如下：
  // ret         Int       验证结果，0：验证成功。2：用户主动关闭验证码。
  // ticket      String    验证成功的票据，当且仅当 ret = 0 时 ticket 有值。
  // CaptchaAppId       String    验证码应用ID。
  // bizState    Any       自定义透传参数。
  // randstr     String    本次验证的随机串，后续票据校验时需传递该参数。
  // verifyDuration     Int   验证码校验接口耗时（ms）。
  // actionDuration     Int   操作校验成功耗时（用户动作+校验完成）(ms)。
  // sid     String   链路sid。
  console.log('captchaCallback:', res);

  // res（用户主动关闭验证码）= {ret: 2, ticket: null}
  // res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}
  // res（请求验证码发生错误，验证码自动返回trerror_前缀的容灾票据） = {ret: 0, ticket: "String", randstr: "String",  errorCode: Number, errorMessage: "String"}
  // 此处代码仅为验证结果的展示示例，真实业务接入，建议基于ticket和errorCode情况做不同的业务处理
  if (res.ret === 0) {
    captcha_ticket.value = res.ticket;
    captcha_random.value = res.randstr;

    if (!humanVerified.value) {
      let params = {
        phone: loginForm.value.phoneNumber,
        cc: prefix.value,
        captcha_ticket: captcha_ticket.value,
        captcha_random: captcha_random.value
      };
      getSmsCode(params, visitorAccessToken.value)
        .then((res) => {
          if (res.code === 200) {
            handleTimeCount();
            showSuccessToast(t('login.tips-5'));
          } else {
            showFailToast(res.msg);
          }
          smsLoading.value = false;
        })
        .catch(() => {
          smsLoading.value = false;
        });
    }
  }
  if (res.ret === 2) {
    smsLoading.value = false;
  }
}

// '194054038' : 无感知校验
// '194420956' : 滑块校验
const initCaptcha = (captchaAppId) => {
  //校验
  try {
    // 生成一个验证码对象
    // CaptchaAppId：登录验证码控制台，从【验证管理】页面进行查看。如果未创建过验证，请先新建验证。注意：不可使用客户端类型为小程序的CaptchaAppId，会导致数据统计错误。
    //callback：定义的回调函数
    let captcha = new TencentCaptcha(captchaAppId, captchaCallback, {
      userLanguage: 'zh-cn',
      loading: false
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
    // 生成容灾票据或自行做其它处理
    let ticket = 'trerror_1001_' + captchaAppId + '_' + Math.floor(new Date().getTime() / 1000);
    captchaCallback({
      ret: 0,
      randstr: '@' + Math.random().toString(36).substr(2),
      ticket: ticket,
      errorCode: 1001,
      errorMessage: 'jsload_error'
    });
  }
};

onBeforeMount(() => {
  loginForm.value.userAgreement = localStorage.getItem('userAgreement') === 'true' ? true : false;
});
onMounted(() => {
  localStorage.removeItem('humanVerified');
  initCaptcha('194054038'); //无感知校验
});

const langList = supportLang(); // 支持切换的语言

const changeLangCommand = (command) => {
  if (command === curLang) return;
  localStorage.setItem('lang', command);
  window.location.reload();
};
const phoneNumberRef = ref(null);
</script>
<style lang="scss" scoped>
.login {
  height: 100vh;
  background: url('@/assets/images/login-background2.png') no-repeat center / cover;

  .login-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px 10px 20px;

    .sidebar-logo {
      position: relative;
      width: 100%;
      background: transparent !important;
      text-align: center;
      overflow: hidden;

      &__link {
        display: flex;
        align-items: center;
        font-size: 20px;
        font-weight: 600;
        color: #066be9;
      }

      &__icon {
        height: 20px;
        margin-right: 6px;
      }

      &__title {
        font-size: 18px;
        font-weight: bold;
      }
    }
  }

  .login-title {
    font-weight: bold;
    font-size: 28px;
    color: #066be9;
    text-align: center;
    font-style: normal;
    text-transform: none;
    margin: 20px 0 30px 0;
  }

  .login-form {
    max-width: 800px;
    height: calc(100% - 150px);
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;

    .login-container {
      border-radius: 20px;
      background: rgba(#fff, 0.55);
      width: 92%;
      padding: 10px 15px;
      min-height: 380px;
    }
  }

  .sign-in {
    width: 100%;
    height: 40px;
  }

  .user-greement-content {
    display: flex;
    flex-direction: column;

    .tips {
      font-weight: 400;
      font-size: 12px;
      height: 26px;
      color: #7a7a7a;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }

    .tips_2 {
      font-weight: 400;
      font-size: 12px;
      color: #7a7a7a;
      text-align: left;
      font-style: normal;
      text-transform: none;
      height: 26px;

      .btn {
        cursor: pointer;
        text-align: left;
        color: #2a6dea;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}

.w-\[120px\] {
  width: 120px;
}

.w-\[80px\] {
  width: 80px;
}

.link-text {
  font-size: 14px;
  color: var(--van-primary-color);
}

.prefix-code-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

:deep(.index-list-popup) {
  .cover-popup-head {
    background-color: #fff;
  }

  .cover-popup-body {
    padding-left: 0;
    padding-right: 0;
  }

  .van-index-bar__sidebar {
    position: absolute;
  }

  .van-hairline--bottom {
    &::after {
      display: none;
    }
  }

  .van-cell {
    &.is-active {
      color: var(--van-primary-color);
    }
  }
}

:deep(.privacy-policy) {
  p {
    word-break: break-word;
  }
}

:deep(.verify-field) {
  &.van-field {
    &.van-cell {
      padding: 0 0 0 var(--van-popup-close-icon-margin);
    }
  }

  .van-field__body {
    padding: 0;
  }

  .van-field__button {
    .van-button {
      border-radius: 10px;
    }
  }
}
.copy-right {
  width:100%;
  text-align: center;
  font-size: 12px;
  margin-top: -70px
}
</style>
