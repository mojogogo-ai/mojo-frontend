
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
      apiKey: "AIzaSyCWYpMkBLgpcklWeNmbnogs4M_xbN2F6bw",
      authDomain: "mojogogoai.firebaseapp.com",
      projectId: "mojogogoai",
      storageBucket: "mojogogoai.appspot.com",
      messagingSenderId: "254276203503",
      appId: "1:254276203503:web:b33b7d2de699e7a3cffc1a",
      measurementId: "G-MMLB093GVF"
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
