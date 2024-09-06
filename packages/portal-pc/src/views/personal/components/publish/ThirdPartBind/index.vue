<template>
  <el-dialog
    v-model="isVisible"
    width="622px"
    :title="__data.title"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
  >
    <div class="mb-3">
      {{ __data.content }}
    </div>
    <div class="mb-3">
      <el-link
        type="primary"
        :href="__data.link"
        target="_blank"
        :underline="false"
      >
        {{ __data.howTo }}
      </el-link>
    </div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      @submit.prevent
    >
      <el-form-item
        :label="__data.inputLabel"
        prop="token"
      >
        <el-input
          v-model="form.token"
          :placeholder="__data.inputPlaceholder"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">{{ t('common.cancel') }}</el-button>
      <el-button
        type="primary"
        linear
        @click="onSaveBind"
      >
        {{ t('common.b') }}
      </el-button>
    </template>
  </el-dialog>
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
      message: __data.inputPlaceholder,
      trigger: 'blur'
    }
  ];
  isVisible.value = true;
};
const close = () => {
  isVisible.value = false;
};
const onSaveBind = async () => {
  try {
    const isValidate = await formRef.value.validate();
    if (isValidate) {
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
    }
  } catch (e) {
    console.log(e);
  }
};

defineExpose({
  open
});
</script>
