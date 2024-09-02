// 本项目支持的语言
export function supportLang() {
  return [
    {
      value: "en",
      lable: "English",
    },
    {
      value: "zh-CN",
      lable: "简体中文",
    },
    {
      value: "zh-TW",
      lable: "繁體中文",
    },
  ];
}

// 获取浏览器默认语言
export function getBrowserLang() {
  let defaultBrowserLang = navigator.language ? navigator.language : navigator.browserLanguage;
  const lang = defaultBrowserLang.toLowerCase();
  if ( lang === "zh-cn" || lang === "zh" || lang === "cn" || lang === "zh-hans") {
    defaultBrowserLang = "zh-CN";
  }else if (lang === "zh-tw" || lang === "zh-hk") {
    defaultBrowserLang = "zh-TW";
  }
  return defaultBrowserLang;
}

// 当前选择的语言(若有本项目不支持的语言，默认回退到en)
export function getCurLang () {
  // if(window.SITE_TYPE && window.SITE_TYPE === '2'){//国内默认是中文，且不支持切换
  //   return 'zh-CN'
  // }
  const lang = localStorage.getItem('lang') || getBrowserLang()
  const curLang = supportLang().find(i => i.value === lang)
  return curLang && curLang.value ? lang : 'en'
}
