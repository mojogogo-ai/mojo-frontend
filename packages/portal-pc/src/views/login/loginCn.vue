<template>
  <div class="h-full bg-cover bg-[url('@/assets/images/login-background2.png')]">
    <div class="flex items-center justify-between px-[50px] py-[30px]">
      <div style="width: 180px" class="sidebar-logo">
        <a
          key="collapse"
          class="sidebar-logo__link"
          :href="WEBSITE_HOME"
        >
          <img
            :src="logoLeft"
            :alt="isCn? $t('common.productName_Cn') :$t('common.productName') "
            class="sidebar-logo__icon"
          >
          {{ isCn? $t('common.productName_Cn') :$t('common.productName') }}
        </a>
      </div>
      <LanguageSelect lable-color="black" />
    </div>
    <div class="flex items-center justify-center mt-[80px]">
      <img class="w-[0] sm:w-[0px] md:w-[400px] lg:w-[660px]" :src="logoLoginLeft">
      <div class="ml-0 sm:ml-0 md:ml-[10px] min-h-[440px] bg-[#fff] rounded-2xl px-[40px] py-[30px]">
        <el-form
          ref="loginRef"
          :model="loginForm"
          :rules="formRules"
          label-position="top"
        >
          <h2 class="login-title">{{ $t('login.smsLogin') }}</h2>
          <el-form-item prop="phoneNumber" style="margin-bottom: 34px;">
            <el-input
              v-model.trim="loginForm.phoneNumber"
              style="width: 100%"
              type="text"
              autocomplete="off"
              class="input-with-select"
              :placeholder="$t('login.sj')"
            />
          </el-form-item>
          <el-form-item prop="verificationCode" style="margin-bottom: 12px;">
            <div class="flex">
              <el-input
                v-model.trim="loginForm.verificationCode"
                style="width: 268px;margin-right: 5px"
                maxlength="4"
                autocomplete="off"
                :placeholder="$t('login.code')"
              />
              <el-button :loading="smsLoading" style="width: 100px; height: 40px;" type="primary" @click="__getSmsCode">
                {{ showloginCode?$t("login.getVerificationCode"):loginForm.count + 's' }}
              </el-button>
            </div>
          </el-form-item>
          <el-form-item prop="userAgreement">
            <div class="operation">
              <el-checkbox 
                v-model="loginForm.userAgreement" 
                :value="true" 
                size="large" 
                @change="userAgreementChange" 
              />
              <div class="user-greement-content">
                <div v-if="!isDemo" class="tips"> {{ $t('login.tips-4') }}</div>
                <div class="tips_2">
                  <span
                    class="btn"
                    @click="termsServiceCnVisible= true"
                  >
                    {{ $t("login.userAgreement") }}
                  </span>
                  <span style="margin: 0 1px;">{{ $t("common.and") }}</span>
                  <span
                    class="btn"
                    @click="privacyPolicyCnVisible = true"
                  >
                    {{ $t("login.privacyPolicy") }}
                  </span>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item style="width: 100%; margin: 40px 0 0 0">
            <el-button
              class="w-full"
              :loading="loginLoading"
              size="large"
              linear
              type="primary"
              @click="loginByPhone"
            >
              <span> {{ loginLoading ? $t("login.logining") : $t("login.login") }}</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-dialog v-model="termsServiceCnVisible" width="620">
      <ModelServiceCn v-if="termsServiceCnVisible" />
    </el-dialog>
    <el-dialog v-model="privacyPolicyCnVisible" width="620">
      <PrivacyPolicyCn v-if="privacyPolicyCnVisible" />
    </el-dialog>
  </div>
  <div
    class="copy-right"
  >
    <span>Copyright © 达朴汇联版权所有  备案号：</span>
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
</template>

<script setup>
import logoLeft from '@/assets/logo/bot-default-logo.svg';
import logoLoginLeft from "@/assets/images/login-left.png";
import useUserStore from "@/store/modules/user";
import { t } from '@gptx/base/i18n';
import { visitorLogin, getSmsCode, smsCaptchaLogin } from '@gptx/base/api/login';
import { ElMessage } from "element-plus";
import { welcomeAccess } from "@gptx/base/api/login";
import { setRefreshToken } from '@gptx/base/utils/auth'
import { validatorPhone, validatorDigit, validatorAgreement } from '@gptx/base/utils/validator'

const loginLoading = ref(false);
const WEBSITE_HOME = window.WEBSITE_HOME;
const userStore = useUserStore();
const router = useRouter();
const { proxy } = getCurrentInstance();

const showloginCode = ref(true); 
const prefix = ref("+86");

const privacyPolicyCnVisible = ref(false)
const termsServiceCnVisible = ref(false)
const isCn = computed(() => {
  return  window.SITE_TYPE && window.SITE_TYPE === '2'
});
const isDemo = computed(() => {
  return window.IS_DEMO && window.IS_DEMO === true
});

// 登录表单信息
const loginForm = ref({
  verificationCode: "",
  userAgreement: false,
  timer: null,
  count: "", 
  phoneNumber: "",
});

const formRules = {
  verificationCode: [{ required: true, validator: validatorDigit, trigger: "blur" }],
  userAgreement: [{ required: true, validator: validatorAgreement, trigger: "change" }],
  phoneNumber: [{ required: true, validator: validatorPhone, trigger: "blur" }],
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


const smsLoading = ref(false)
const __getSmsCode = async () => {
  if(!showloginCode.value){
    return
  }
  let validate = false;
  await proxy.$refs.loginRef.validateField("phoneNumber",(result) => (validate = result));
  if (!validate) return;

  smsLoading.value = true
  await __visitorLogin()
  if (visitorAccessToken.value && humanVerified.value) {
    let params ={ 
      phone: loginForm.value.phoneNumber,
      cc: prefix.value
    }
    getSmsCode(params, visitorAccessToken.value).then((res) => {
        if (res.code === 200) {
          handleTimeCount();
          ElMessage.success(t('login.tips-5'));

        } else {
          ElMessage.error(res.msg);
        }
        smsLoading.value = false
      }
    ).catch(() => {
      smsLoading.value = false
    });
  }else {
    initCaptcha('194420956') //滑块校验
  }
  
};


const loginByPhone = async () => {
    let validate = false;
    await proxy.$refs.loginRef.validateField(["phoneNumber", "verificationCode","userAgreement"], (res) => (validate = res));
    if (!validate) return;
    loginLoading.value = true;
    let params ={
      code: loginForm.value.verificationCode
    }
    smsCaptchaLogin(params, visitorAccessToken.value).then((res) => {
      console.log(res,'smsCaptchaLogin')
      if (res.code === 200) {
        handleToken(res.data);
      } else {
        //
      }
    }).catch(() => {
      loginLoading.value = false;
    });
};

const handleToken = (params) => {
    let { access_token, refresh_token} = params
    let anonymousToken = localStorage.getItem('anonymousToken') || '' ;
    welcomeAccess(access_token, anonymousToken).then((res) => {
      if (res.code === 200) {
        let userInfo ={
          accessToken: access_token,
          stsTokenManager: {
            expirationTime:new Date().getTime() + 2*3600*1000
          },
          emailVerified: false,
          id:res.data.user_info.id,
          isAnonymous: false
        }
        setRefreshToken(refresh_token)
        if (res.data&&res.data.system_chat) {
          localStorage.setItem('systemChat', JSON.stringify(res.data.system_chat));
          localStorage.setItem('user', JSON.stringify(res.data.user_info));
        }
        localStorage.removeItem('anonymousToken')
        handleRoute();
        userStore.loginOthers(userInfo)
      }
      
      loginLoading.value = false;

    }).catch(() => {
      loginLoading.value = false;
    });
};

const visitorAccessToken = ref('')
const humanVerified = ref(true)
const __visitorLogin = ()=>{
  return new Promise((resolve, reject) => {
    let params = {
      captcha_ticket: captcha_ticket.value,
      captcha_random: captcha_random.value
    }
    visitorLogin(params).then((res) => {
        if (res.code === 200) {
          visitorAccessToken.value =  res.data.access_token
          humanVerified.value =  res.data.human_verified
          resolve(true)
        } else {
          reject(false)
          smsLoading.value = false
          ElMessage.error(res.msg);
        }
      }
    ).catch(() => {
      reject(false)
      smsLoading.value = false
    });
  })
}

const handleRoute = () => {
  router.push({ path: "/chat" });
};
const userAgreementChange = (value) => {
  localStorage.setItem('userAgreement', value)
};



// 定义回调函数
const captcha_ticket = ref('')
const captcha_random = ref('')
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
    captcha_ticket.value = res.ticket
    captcha_random.value = res.randstr

    if (!humanVerified.value) {
      let params ={ 
        phone: loginForm.value.phoneNumber,
        cc: prefix.value,
        "captcha_ticket":  captcha_ticket.value,
        "captcha_random":  captcha_random.value
      }
      getSmsCode(params, visitorAccessToken.value).then((res) => {
          if (res.code === 200) {
            handleTimeCount();
            ElMessage.success(t('login.tips-5'));

          } else {
            ElMessage.error(res.msg);
          }
          smsLoading.value = false
        }
      ).catch(() => {
        smsLoading.value = false
      });
    }
  }
  if (res.ret === 2) {
    smsLoading.value = false
  }
}

// '194054038' : 无感知校验
// '194420956' : 滑块校验
const initCaptcha = (captchaAppId)=>{//校验
  try {
      // 生成一个验证码对象
      // CaptchaAppId：登录验证码控制台，从【验证管理】页面进行查看。如果未创建过验证，请先新建验证。注意：不可使用客户端类型为小程序的CaptchaAppId，会导致数据统计错误。
      //callback：定义的回调函数
      let captcha = new TencentCaptcha(captchaAppId, captchaCallback, {
        userLanguage: 'zh-cn',
        loading: false,
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

}

onBeforeMount(() => {
  loginForm.value.userAgreement = localStorage.getItem('userAgreement') ==='true'? true: false
});
onMounted(() => {
  localStorage.removeItem('humanVerified')
  initCaptcha('194054038')//无感知校验
});
</script>
<style lang="scss" scoped>
:deep(.el-input__inner),
:deep(.el-input--large) {
  font-size: var(--font-size-16);
}
:deep(.el-button--large) {
  font-size: var(--font-size-18);
}
:deep(.el-input--default) {
  height: 40px;
}

:deep(.el-select__wrapper) {
  height: 40px;
  background: #fff;
}
:deep(.el-input__wrapper) {
  background: #fff;
  
  &:hover {
    border-color: var(--el-color-primary);
  }
}
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
    height: 30px;
    margin-right: 6px;
  }

  &__title {
    font-size: 18px;
    font-weight: bold;
  }
}
.login-title {
  font-size: 28px;
  color: #066BE9;
  text-align: center;
  margin: 20px 0 40px 0
}
.operation {
  .user-greement-content{
    display: flex;
    flex-direction: column;
    margin-top: -36px;
    margin-left: 22px;
    .tips{
      font-weight: 400;
      font-size: 14px;
      height: 26px;
      color: #7A7A7A;
    }
    .tips_2 {
      font-weight: 400;
      font-size: 14px;
      color: #7A7A7A;
      height: 26px;
      .btn {
        cursor: pointer;
        color: #2A6DEA;
        &:hover{
          opacity: 0.8;
        }
      }

    }
  }
}

.copy-right {
  width:100%;
  text-align: center;
  font-size: 14px;
  margin-top: -30px
}
</style>
