<template>
  <div class="twitter-connect">
    <el-input
      v-model="twitterLink"
      placeholder="Enter your Twitter link"
      class="twitter-input"
      @change="updateTwitterLink"
    />
    <div class="toggle-container">
      <label for="twitter-switch">{{ t('bots.label.isTwitterConnected') }}</label>
      <el-switch
        v-model="isTwitterConnected"
        @change="toggleTwitterConnection"
        active-color="#1da1f2"
        inactive-color="#ccc"
      />
    </div>
  </div>
</template>

<script>
import { t } from '@gptx/base/i18n';
import { twitterAuth } from '@gptx/base/api/meme-bot';
import { ref } from 'vue';

export default {
  methods: { t },
  setup(props, { emit }) {
    const isTwitterConnected = ref(false);
    const twitterLink = ref('');

    const updateTwitterLink = () => {
      emit('update-twitter-link', twitterLink.value);
    };

    const toggleTwitterConnection = async () => {
      if (isTwitterConnected.value) {
        await connectTwitter();
      } else {
        disconnectTwitter();
      }
    };

    const connectTwitter = async () => {
      const response = await twitterAuth();
      if (response.code === 200) {
        const twitterAuthUrl = response.data.redirect_uri;
        emit('update-auth-status', 'connected');
        window.open(twitterAuthUrl, "twitterAuthPopup", "width=500,height=600");
      } else {
        console.error('Failed to obtain twitter auth url');
        twitterLink.value = '';
      }
    };

    const disconnectTwitter = () => {
      twitterLink.value = '';
    };

    return {
      isTwitterConnected,
      twitterLink,
      toggleTwitterConnection,
      updateTwitterLink,
    };
  },
};
</script>

<style scoped>
.twitter-connect {
  display: flex;
  flex-direction: column;
  width: 100%;
  //background-color: rgba(0, 0, 0, 0.7);
}

.pdc-title {
  color: #fff;
  font-feature-settings: 'dlig' on;
  font-family: "TT Norms Pro";
  font-size: 16px;
  font-weight: 500;
  line-height: 23px;
  margin-bottom: 16px;
}

.pdc-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toggle-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
}

label {
  margin-right: 10px;
  font-size: 14px;
  color: #fff;
}
</style>
