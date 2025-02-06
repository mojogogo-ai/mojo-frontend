<template>
  <div>
    <h1>{{ t('common.twitter.tip') }}</h1>
    <p>{{ t('common.twitter.content') }}</p>
  </div>
</template>
<script>
import { t } from '@gptx/base/i18n';

export default {
  mounted() {
    try {
      const rawResponse = document.body.innerText;
      const response = JSON.parse(rawResponse);
      this.notifyParent(response);
      setTimeout(() => {
        window.close();
      }, 1000);
    } catch (error) {
      console.error("Error parsing Twitter response:", error);
      this.notifyParent({
        code: 500,
        message: "Error parsing response from Twitter.",
      });
      setTimeout(() => {
        window.close();
      }, 1000);
    }
  },
  methods: {
    t,
    notifyParent(response) {
      window.opener.postMessage(response, "http://localhost:9004/#/twitter/success");
    },
  },
};
</script>


<style scoped>
h1 {
  color: #1da1f2;
}
</style>
