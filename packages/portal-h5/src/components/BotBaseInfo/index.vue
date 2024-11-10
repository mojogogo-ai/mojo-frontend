<template>
  <mojoDialogTranslucent
    v-model:show="isVisible"
    v-bind="$attrs"
    closeable
    round
    teleport="body"
    @close="close"
  >
    <template #title>
      {{ isEdit ? t('base.edit') : t('bots.new') }}
    </template>
    <div class="bbi-dialog-body">
      <van-form
        ref="formRef"
        class="cover-form"
        label-align="top"
        :disabled="loading || isAIloading"
        @submit.prevent
      >
        <van-field
          v-model="form.name"
          name="name"
          maxlength="50"
          show-word-limit
          clearable
          background
          required
          :label="t('bots.label.name')"
          :placeholder="t('bots.place.name')"
          :rules="rules.name"
        />
        <van-field
          name="classification"
          background
          required
          :label="t('bots.label.classification')"
          :rules="rules.classification"
          clearable
        >
          <template #input>
            <selector
              v-model="form.classification"
              :columns="catalogList.map((_) => ({ ..._, label: t(_.name) }))"
              :columns-field-names="{ text: 'label', value: 'id' }"
              :placeholder="t('bots.place.catalog')"
            />
          </template>
        </van-field>
        <van-field
          name="gender"
          background
          required
          :label="t('bots.label.gender')"
          :rules="rules.gender"
          clearable
        >
          <template #input>
            <selector
              v-model="form.gender"
              :columns="genderList.map((_) => ({ ..._, label: t(_.name) }))"
              :columns-field-names="{ text: 'label', value: 'id' }"
              :placeholder="t('bots.place.catalog')"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.introduction"
          name="introduction"
          type="textarea"
          maxlength="2000"
          show-word-limit
          clearable
          background
          required
          :rows="3"
          :label="t('bots.label.description')"
          :placeholder="t('bots.place.description')"
          :rules="rules.introduction"
        />
        <van-field
          :label="t('bots.icon')"
          name="icon"
          required
          :rules="rules.icon"
        >
          <template #input>
            <profile-avatar-generator
              :default-avatar="form.icon || defaultRobotAvatar"
              :name="form.name"
              :introduction="form.introduction"
              :title="t('bots.icon')"
              :disabled-tooltip-text="t('bots.generateIconTooltip')"
              @before-generate="isAIloading = true"
              @after-generate="isAIloading = false"
              @change="onImageChange"
            />
          </template>
        </van-field>
      </van-form>
      <div class="bbi-dialog-foot">
        <van-button
          size="middle"
          :disabled="loading"
          @click="close"
        >
          {{ t('common.cancel') }}
        </van-button>
        <van-button
          type="primary"
          size="middle"
          linear
          :loading="loading"
          :disabled="loading"
          @click="submitBaseInfo"
        >
          {{ t('common.confirm') }}
        </van-button>
      </div>

    </div>
  </mojoDialogTranslucent>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { getBotInfo, createBot, botEdit } from '@gptx/base/api/application';
import defaultRobotAvatar from '@/assets/logo/bot-default-logo.svg';
import { storeAppCopy } from '@gptx/base/api/chat.js';
import { ElMessage } from 'element-plus';

const emits = defineEmits(['after-create', 'after-update', 'close']);
const isVisible = ref(false);
const isEdit = ref(false);
const form = reactive({
  icon: '',
  name: '',
  introduction: '',
  classification: null,
  gender: null,
  third_company: '',
  is_personalize_image_icon: false
});
const rules = reactive({
  icon: [
    {
      message: t('bots.ruleMessage.icon'),
      trigger: 'change',
      validator: () => !!(form.icon && form.icon !== defaultRobotAvatar)
    }
  ],
  name: [{ required: true, message: t('bots.ruleMessage.name') }],
  introduction: [{ required: true, message: t('bots.ruleMessage.introduction') }],
  classification: [
    {
      message: t('bots.ruleMessage.catalog'),
      validator: () => !!(form.classification && form.classification.length > 0)
    }
  ],
  gender: [{
    message: t('bots.ruleMessage.catalog'),
    validator: () => (form.gender !== null)

  }]
});
const catalogList = reactive([
  // Natural Professional Passionate Customize
  { id: 'Natural', name: 'Natural' },
  { id: 'Professional', name: 'Professional' },
  { id: 'Passionate', name: 'Passionate' },
  { id: 'Customize', name: 'Customize' }
]);
const genderList = reactive([
  { id: 0, name: 'None-binary' },
  { id: 1, name: 'Male' },
  { id: 2, name: 'Female' }
]);
const formRef = ref(null);
const loading = ref(false);
const isAIloading = ref(false);
const isCopy = ref(false);

const open = async (option) => {
  if (option?.id) form.id = option?.id;
  isEdit.value = !!option?.id;
  isVisible.value = true;
  if(isEdit.value) {
    loading.value = true;
    try {
      const { code, data } = await getBotInfo({
        id: option.id
      });
      // console.log(data, 'data')
      if (code === 200) {
        form.icon = data.icon;
        form.name = data.name;
        form.introduction = data.introduction;
        form.classification = data.classification;
        form.gender = data.gender
        form.files = data.files;
      }
    } catch (error) {
      console.log(error);
      // 获取详情失败
      ElMessage.error(t('bots.error.getDetail'));
    } finally {
      loading.value = false;
    }
  } else {
    // await nextTick();
    // alert(1)
    form.id = '';
    form.icon = '';
    form.name = '';
    form.introduction = '';
    form.classification = [];
    form.gender = null;
    form.third_company = '';
    form.is_personalize_image_icon = false;
    // formRef.value.resetFields();
  }
}
const close = () => {
  isVisible.value = false;
  form.id = '';
  form.icon = '';
  form.name = '';
  form.introduction = '';
  form.classification = [];
  form.gender = null;
  form.third_company = '';
  form.is_personalize_image_icon = false;
  // formRef.value.resetFields();
};
const onImageChange = (url, is_personalize_image_icon) => {
  form.icon = url
  form.is_personalize_image_icon = is_personalize_image_icon
};
// commit action
const submitBaseInfo = async (el) => {
  if (loading.value) return;
  await formRef.value.validate();
  if (isCopy.value) await copyApp();
  else if (isEdit.value) await editAppInfo();
  else await createNewBot();
};
// update info
const editAppInfo = async () => {
  try {
    loading.value = true;
    const result = await botEdit(form);
    if (result.code === 200) {
      loading.value = false;
      emits('after-update');
      emits('after-create', {
        id: form.id,
        icon: form.icon,
        name: form.name,
        introduction: form.introduction,
        classification: form.classification,
        files: form?.files || null
      });
      // formRef.value.resetFields();
      close();
    }
    loading.value = false;
  } catch (e) {
    console.log(e);
    loading.value = false;
  }
};
// create new bot
const createNewBot = async () => {
  try {
    loading.value = true;
    const result = await createBot(form);
    if (result.code === 200) {
      loading.value = false;
      emits('after-create', result.data);
      close();
    }
    loading.value = false;
  } catch (e) {
    console.log(e);
    loading.value = false;
  }
};
// copy app
const copyApp = async () => {
  try {
    loading.value = true;
    const result = await storeAppCopy(form);
    if (result.code === 200) {
      loading.value = false;
      emits('after-create', result.data);
      close();
    }
    loading.value = false;
  } catch (e) {
    console.log(e);
    loading.value = false;
  }
};

defineExpose({ open });
</script>

<style lang="scss" scoped>
.bbi-dialog {
  &-head {
    font-size: 18px;
    font-weight: bold;
    padding: 16px;
    border-bottom: 1px solid #eee;
  }

  &-body {
    padding: 16px;
  }

  &-foot {
    padding: 0;
    display: flex;
    justify-content: space-between;
    gap: 8px;
    :deep(.van-button) {
      width: 45%;
      padding: 10px 20px;
    }
  }
}
</style>
