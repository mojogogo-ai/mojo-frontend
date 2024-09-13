
// 根据域名自动分配相关配置

(function (window) {
  // fireBase配置，目前一共3个
  const firebaseConfig = {
    dev: { // 开发
      apiKey: "AIzaSyBwRz_z_8XxjHEpUImBE1Tt-OZZeLpSUC8",
      authDomain: "mojogogoai-dev.firebaseapp.com",
      projectId: "mojogogoai-dev",
      storageBucket: "mojogogoai-dev.appspot.com",
      messagingSenderId: "1065366463732",
      appId: "1:1065366463732:web:210adcaf208d7fe8406aa1",
      measurementId: "G-1NJ0ELV9D8"
    },
    test: { // 测试
      apiKey: "AIzaSyCwhF5UU5iO0khow3SZWTdwrdcErMTFMZs",
      authDomain: "mojogogo-test.firebaseapp.com",
      projectId: "mojogogo-test",
      storageBucket: "mojogogo-test.appspot.com",
      messagingSenderId: "933096028546",
      appId: "1:933096028546:web:cd5a89c830e500ab44f79b",
      measurementId: "G-85PYGRHFH9"
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
      BASE_API: "",
    },
    // ...others
    // local end


    // online start
    "dev.mojogogo.ai":{ // dev
      FIREBASE_CONFIG: firebaseConfig.dev,
      BASE_API: "https://api-dev.mojogogo.ai/portal/",
    },
    "test.mojogogo.ai":{ // test
      FIREBASE_CONFIG: firebaseConfig.test,
      BASE_API: "https://api-test.mojogogo.ai/portal/",
    },
    "dhj2jrp434pn8.cloudfront.net":{ // test
      FIREBASE_CONFIG: firebaseConfig.test,
      BASE_API: "http://mojogogo-test-2063971065.us-west-1.elb.amazonaws.com/portal/",
    },
    "mojogogo.ai":{ // prod
      FIREBASE_CONFIG: firebaseConfig.prod,
      BASE_API: "https://api.mojogogo.ai/portal/",
    }
     // online end
  }

  // 匹配配置
  function setConfig() {
    // 当前域名(去除www.)
    const curHostname = new URL(window.location).hostname.replace(/www./,'');
    for (const key in hostList) {
      if (key === curHostname) {
        window.FIREBASE_CONFIG = hostList[key].FIREBASE_CONFIG;
        window.BASE_API = hostList[key].BASE_API;
      }
    }

    if (!window.FIREBASE_CONFIG) { // 没有匹配到配置，默认使用生产环境
      let host = "mojogogo.ai"
      window.FIREBASE_CONFIG = hostList[host].FIREBASE_CONFIG;
      window.BASE_API = hostList[host].BASE_API;
    }
  }
  setConfig()

})(window)
