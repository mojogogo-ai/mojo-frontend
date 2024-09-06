<template>
  <van-popup
    v-model:show="isVisible"
    class="cover-popup"
    position="bottom"
    closeable
  >
    <div class="cover-popup-head">
      {{ __data.title }}
    </div>
    <div class="cover-popup-body">
      <div class="mb-2">
        {{ __data.content }}
      </div>
      <div class="mb-2">
        <van-button
          type="primary"
          link
          :url="__data.link"
        >
          {{ __data.howTo }}
        </van-button>
      </div>
      <van-form
        ref="formRef"
        class="cover-form"
        label-align="top"
        required="auto"
        @submit="onSaveBind"
      >
        <van-field
          v-model="form.token"
          name="token"
          background
          :placeholder="__data.inputPlaceholder"
          :label="__data.inputLabel"
          :rules="rules.token"
        />
      </van-form>
    </div>
    <div class="cover-popup-foot">
      <van-button
        size="small"
        @click="close"
      >
        {{ t('common.cancel') }}
      </van-button>
      <van-button
        type="primary"
        size="small"
        linear
        @click="onSaveBind"
      >
        {{ t('common.b') }}
      </van-button>
    </div>
  </van-popup>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { configureSocialShare } from '@gptx/base/api/application';

const props = defineProps({
  botId: {
    type: String,
    default: ''
  }
});
const emits = defineEmits(['update-option']);

const isVisible = ref(false);
const __data = reactive({
  title: '',
  content: '',
  howTo: '',
  inputLabel: '',
  inputPlaceholder: ''
});
const form = reactive({
  token: ''
});
const rules = reactive({
  token: []
});
let dataSource = {};
/* ref dom */
const formRef = ref(null);

const open = ({ title, _ }) => {
  dataSource = _;
  __data.title = `${t('bots.publish.label.option')} ${title} ${t('menu.c')}`;
  __data.content = `${t('bots.publish.label.connect')} ${title} ${t('menu.c')}, ${t(
    'bots.publish.label.with'
  )} ${title} ${t('bots.publish.label.connectTips')}`;
  __data.howTo = `${t('bots.publish.label.howTo')} ${title} ${t('bots.publish.label.token')}?`;
  __data.inputLabel = `${title} ${t('bots.publish.label.token')}`;
  __data.inputPlaceholder = `${t('common.enter')} ${title} ${t('bots.publish.label.token')}`;
  __data.link = 'https://safegen.ai';
  rules.token = [
    {
      required: true,
      message: __data.inputPlaceholder
    }
  ];
  isVisible.value = true;
};
const close = () => {
  isVisible.value = false;
};
const onSaveBind = async () => {
  try {
    await formRef.value.validate();
    const { code } = await configureSocialShare({
      app_id: props.botId,
      s_type: dataSource.s_type,
      enabled: true,
      credential: { bot_token: form.token }
    });
    if (code === 200) {
      emits('update-option');
      close();
    }
  } catch (e) {
    console.log(e);
  }
};

defineExpose({
  open
});
</script>
<style scoped>
.van-button[link] {
  padding: 0;
}
</style>
