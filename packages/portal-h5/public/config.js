
// 根据域名自动分配相关配置

(function (window) {
  // fireBase配置，目前一共3个
  const firebaseConfig = {
    dev: { // 开发
      apiKey: "AIzaSyB8a05dm3VCcRN8eImD5ZybGF8RgbzcCu0",
      authDomain: "safegenai-dev.firebaseapp.com",
      projectId: "safegenai-dev",
      storageBucket: "safegenai-dev.appspot.com",
      messagingSenderId: "847517741728",
      appId: "1:847517741728:web:b89c41f5785b167b3fcfc5",
      measurementId: "G-8R17BPY4B7"
    },
    test: { // 测试
      apiKey: "AIzaSyBgHkwdzyU7fMSfO5fLAdyQvxXansM_o-k",
      authDomain: "safegenai-test.firebaseapp.com",
      projectId: "safegenai-test",
      storageBucket: "safegenai-test.appspot.com",
      messagingSenderId: "451603715668",
      appId: "1:451603715668:web:fd56410134e6663379bfc1",
      measurementId: "G-7XLS82VYCQ"
    },
    prod: { // 生产
      apiKey: "AIzaSyCO5kZ02rlCwcoapJjqEWkLV4V-n5pg00s",
      authDomain: "safegenai.firebaseapp.com",
      projectId: "safegenai",
      storageBucket: "safegenai.appspot.com",
      messagingSenderId: "798564444468",
      appId: "1:798564444468:web:933586eb28186149015d61",
      measurementId: "G-FTD43PXGLN"
    }
  }

  // 不同域名下的配置（若没有匹配到，默认使用生产环境）
  const hostList = {
    // local start
    "localhost":{
      FIREBASE_CONFIG: firebaseConfig.dev,
      WEBSITE_HOME:  "http://192.168.50.203:80",
      BASE_API: "/v2",
      SITE_TYPE: "1" // 1:firebase,2:sms
    },
    // ...others
    "192.168.50.22":{
      FIREBASE_CONFIG: firebaseConfig.dev,
      WEBSITE_HOME:  "http://192.168.50.91:8040",
      BASE_API: "/v2",
      SITE_TYPE: "1" // 1:firebase,2:sms
    },
    // local end


    // online start
    "demo.dappworks.xyz":{
      FIREBASE_CONFIG: firebaseConfig.dev,
      WEBSITE_HOME:  "https://demo.dappworks.xyz/portal",
      BASE_API: "https://demo.dappworks.xyz/v2",
      SITE_TYPE: "2",
      IS_DEMO: true,
    },
    "chat-dev.dappworks.cn":{
      FIREBASE_CONFIG: firebaseConfig.dev,
      WEBSITE_HOME:  "https://chat-dev.dappworks.cn/portal",
      BASE_API: "https://chat-dev.dappworks.cn/v2",
      SITE_TYPE: "2"
    },
    "chat.dappworks.cn":{
      FIREBASE_CONFIG: firebaseConfig.dev,
      WEBSITE_HOME:  "https://chat.dappworks.cn/portal-h5",
      BASE_API: "https://chat.dappworks.cn/v2",
      SITE_TYPE: "2"
    },
    "dev.safegen.ai":{ // dev
      FIREBASE_CONFIG: firebaseConfig.dev,
      WEBSITE_HOME:  "https://dev.safegen.ai:8001",
      BASE_API: "https://dev.safegen.ai:8001/v2",
      SITE_TYPE: "1"
    },
    "test.safegen.ai":{ // test
      FIREBASE_CONFIG: firebaseConfig.test,
      WEBSITE_HOME:  "https://test.safegen.ai:8001",
      BASE_API: "https://test.safegen.ai:8001/v2",
      SITE_TYPE: "1"
    },
    "safegen.ai":{ // prod
      FIREBASE_CONFIG: firebaseConfig.prod,
      WEBSITE_HOME: "https://www.safegen.ai",
      BASE_API: "https://api.safegen.ai/v2",
      SITE_TYPE: "1"
    }
    // ...others
    // online end
  }

  // 匹配配置
  function setConfig() {
    // 当前域名(去除www.)
    const curHostname = new URL(window.location).hostname.replace(/www./,'');
    for (const key in hostList) {
      if (key === curHostname) {
        window.FIREBASE_CONFIG = hostList[key].FIREBASE_CONFIG;
        window.WEBSITE_HOME =  hostList[key].WEBSITE_HOME;
        window.BASE_API = hostList[key].BASE_API;
        window.SITE_TYPE = hostList[key].SITE_TYPE;
        window.IS_DEMO = hostList[key].IS_DEMO;
      }
    }

    if (!window.FIREBASE_CONFIG) { // 没有匹配到配置，默认使用生产环境
      let host = "safegen.ai"
      window.FIREBASE_CONFIG = hostList[host].FIREBASE_CONFIG;
      window.WEBSITE_HOME =  hostList[host].WEBSITE_HOME;
      window.BASE_API = hostList[host].BASE_API;
      window.SITE_TYPE = hostList[host].SITE_TYPE;
      window.IS_DEMO = hostList[key].IS_DEMO;
    }
  }
  setConfig()

})(window)
