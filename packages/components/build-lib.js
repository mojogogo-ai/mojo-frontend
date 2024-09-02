import LanguageSelect from '@/components/LanguageSelect';
import ModelService from '@/components/ModelService';
import ModelServiceCn from '@/components/ModelServiceCn';
import PrivacyPolicy from '@/components/PrivacyPolicy';
import PrivacyPolicyCn from '@/components/PrivacyPolicyCn';
import SingleLineChart from '@/components/SingleLineChart';
import GptxChat from '@/components/GptxChat';
import ChatText from '@/components/GptxChat/components/Message/Text.vue';

import '@/styles/lib/tailwind.css'
import '@/styles/lib/highlight.scss'
import '@/styles/lib/github-markdown.scss'
import '@/assets/iconfont/iconfont.css'
export default {
  install: (app) => {
      app.component('LanguageSelect', LanguageSelect);
      app.component('ModelService', ModelService);
      app.component('ModelServiceCn', ModelServiceCn);
      app.component('PrivacyPolicy', PrivacyPolicy);
      app.component('PrivacyPolicyCn', PrivacyPolicyCn);
      app.component('SingleLineChart',SingleLineChart);
      app.component('GptxChat',GptxChat);
      app.component('ChatText',ChatText);
  }
};