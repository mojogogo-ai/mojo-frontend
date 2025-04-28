<template>
  <van-form
    ref="formRef"
    class="create-form mx-auto"
    label-align="top"
    :disabled="loading || isAILoading"
  >
    <div class="form-row">
      <van-field
        v-model="form.name"
        label="Bot name"
        name="name"
        placeholder="Bot name"
        :rules="rules.name"
        clearable
        background
        required
      />

      <van-field
        label="Bot Gender"
        name="gender"
        placeholder="Bot Gender"
        :rules="rules.gender"
        required
        background
        clearable
      >
        <template #input>
          <selector
            v-model="form.gender"
            :columns="genderList.map((_) => ({ ..._, label: t(_.name) }))"
            :columns-field-names="{ text: 'label', value: 'id' }"
            placeholder="Bot classification"
          />
        </template>
      </van-field>
    </div>

    <div class="form-row">
      <van-field
        label="Conversation Style"
        name="classification"
        placeholder="Conversation Style"
        required
        :rules="rules.classification"
      >
        <template #input>
          <selector
            v-model="form.classification"
            :columns="catalogList.map((_) => ({ ..._, label: t(_.name) }))"
            :columns-field-names="{ text: 'label', value: 'id' }"
            placeholder="Bot classification"
          />
        </template>
      </van-field>
      <van-field
        v-model="form.symbol"
        label="Coin Symbol"
        name="symbol"
        placeholder="Meme coin symbol"
        :rules="rules.symbol"
        required
        background
        clearable
      />

    </div>
    <van-field
      v-model="form.introduction"
      label="Description"
      name="introduction"
      placeholder="Describe your bot's functions and usage"
      :rules="rules.introduction"
      maxlength="2000"
      type="textarea"
      clearable
      background
      required
      :rows="3"
    />

    <van-field
      label="Bot Icon"
      name="icon"
      required
      :rules="rules.icon"
      class="bot-icon"
    >
      <template #input>
        <bot-avatar-generator
          :default-avatar="form.icon"
          :name="form.name"
          :gender="form.gender"
          :introduction="form.introduction"
          title="Bot Icon"
          disabled-tooltip-text="Click AI Generate Button after enter your bot's name and description to auto generate an icon for you assisatant, you can generate icons up to 3 time."
          @before-generate="isAILoading = true"
          @after-generate="isAILoading = false"
          @change="onImageChange"
        />
      </template>
    </van-field>

    <van-field
      v-model="form.twitter"
      label="Twitter"
      name="twitter"
      placeholder="Enter your Twitter link"
      class="form-row"
    />
    <van-field
      v-model="form.telegram"
      label="Telegram"
      name="telegram"
      placeholder="Enter your Telegram Address"
      class="form-row"
    />
    <van-field
      v-model="form.website"
      label="Website"
      name="website"
      placeholder="Enter your Website link"
      class="form-row"
    />
    <div class="form-row button-row">
      <van-button round block type="primary"
                  :disabled="loading"
                  @click="submitBaseInfo"
      >
        Create
      </van-button>
      <van-button round block native-type="submit" class="cancel-button"
                  :loading="loading"
                  :disabled="loading"
                  @click="close"
      >
        Cancel
      </van-button>
    </div>
  </van-form>
</template>
<script setup>
import { reactive } from 'vue';
import { t } from '@gptx/base/i18n/index.js';
import defaultRobotAvatar from '@/assets/logo/bot-default-logo.svg';
import { botEdit, createBot } from '@gptx/base/api/application.js';
import router from '@/router/index.js';
import { showToast } from 'vant';

const props = defineProps({
  editForm: Object,
  status: String,
});


const form = reactive({
  name: '',
  gender: null,
  classification: [],//  conversation
  symbol: '',
  introduction: '',
  icon: '',
  twitter: '',
  telegram: '',
  website: '',
  is_personalize_image_icon: false
});
watch(() => props.editForm, (newEditForm) => {
  if (newEditForm) {
    form.name = newEditForm.name || '';
    form.gender = newEditForm.gender || null;
    form.classification = newEditForm.classification || [];
    form.symbol = newEditForm.symbol || '';
    form.introduction = newEditForm.introduction || '';
    form.icon = newEditForm.icon || '';
    form.twitter = newEditForm.twitter || '';
    form.telegram = newEditForm.telegram || '';
    form.website = newEditForm.website || '';
    form.is_personalize_image_icon = newEditForm.is_personalize_image_icon || false;
  }
}, { immediate: true });
const rules = reactive({
  name: [{ required: true, message: "Please fill in the bot name" }],
  gender: [{ required: true, message: "Please select one category" }],
  classification: [{ required: true, message: "Please select one category" }],
  symbol: [{ required: true, message: 'Please enter symbol' }],
  introduction: [{ required: true, message: 'Please enter description' }],
  icon: [{ required: true, message: "Please upload the bot icon" }]
});
const catalogList = reactive([
  // Natural Professional Passionate Customize
  { id: 'Natural', name: 'Natural' },
  { id: 'Professional', name: 'Professional' },
  { id: 'Passionate', name: 'Passionate' },
  { id: 'Default', name: 'Default' },
  { id: 'Playful', name: 'Playful' }
]);
const genderList = reactive([
  { id: 0, name: 'None-binary' },
  { id: 1, name: 'Male' },
  { id: 2, name: 'Female' }
]);
const isAILoading = ref(false);
const loading = ref(false);
const formRef = ref(null);
const onImageChange = (url, is_personalize_image_icon) => {
  form.icon = url;
  form.is_personalize_image_icon = is_personalize_image_icon;
};
const close = () => {
  form.name = '';
  form.gender = null;
  form.classification = [];
  form.symbol = '';
  form.introduction = '';
  form.icon = '';
  form.twitter = '';
  form.telegram = '';
  form.website = '';
  form.is_personalize_image_icon = false;
  formRef.value.resetFields();
};
const submitBaseInfo = async () => {
  if (loading.value) return;
  console.log('Form data before validation:', {
    gender: form.gender,
    genderType: typeof form.gender,
    isNull: form.gender === null
  });
  
  // 手动验证所有必填字段
  const errors = [];
  if (!form.name) errors.push('Please fill in the bot name');
  if (form.gender === null || form.gender === undefined) errors.push('Please select one category');
  if (!form.classification || form.classification.length === 0) errors.push('Please select one category');
  if (!form.symbol) errors.push('Please enter symbol');
  if (!form.introduction) errors.push('Please enter description');
  if (!form.icon || form.icon === defaultRobotAvatar) errors.push('Please upload the bot icon');

  if (errors.length > 0) {
    console.error('Validation errors:', errors);
    showToast({
      message: errors[0],
      type: 'fail',
      position: 'top',
    });
    return;
  }

  try {
    if(props.status === 'create'){
      await createNewBot();
    }
    if(props.status ==='edit'){
      await botEdit(form);
    }
  } catch (error) {
    console.error('Submission error:', error);
    showToast({
      message: 'Submission failed, please try again',
      type: 'fail',
      position: 'top',
    });
  }
};
const createNewBot = async () => {
  try {
    loading.value = true;
    const result = await createBot(form);
    if (result.code === 200) {
      loading.value = false;
      // emits('after-create', result.data);
      close();
    }
    loading.value = false;
  } catch (e) {
    console.log(e);
    loading.value = false;
  }
};
</script>
<style lang="scss" scoped>
.create-form {
  min-width: 375px;
  padding: 0 13.5px;

  .form-row {
    display: flex;
    gap: 8px;

    :deep(.van-field__value) {
      height: 65px;
    }

    //margin-bottom: 16px;
  }

  .bot-icon {
    margin-top: 16px;
    margin-bottom: 16px;
  }

  .button-row {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .cancel-button {
    border: 1px solid rgba(255, 255, 255, 0.20);
    background: #000;
    color: #FFF;
  }

  :deep(.van-cell ) {
    background: #000;
    padding: 0;
  }

  :deep(input) {
    display: inline-flex;
    padding: 10px 16px;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border-radius: 12px;
    border: 1px solid #3A3A3A;
    backdrop-filter: blur(50px);
  }

  :deep(.selector-row) {
    display: inline-flex;
    padding: 10px 16px;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border-radius: 12px;
    border: 1px solid #3A3A3A;
    backdrop-filter: blur(50px);
  }

  :deep(textarea) {
    display: inline-flex;
    padding: 10px 16px;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border-radius: 12px;
    border: 1px solid #3A3A3A;
    backdrop-filter: blur(50px);
  }

  :deep(.van-field__label--required::after) {
    margin-left: 4px;
    color: var(--van-field-required-mark-color);
    content: "*";
  }

  :deep(.van-field__label--required::before) {
    margin-right: 2px;
    color: var(--van-field-required-mark-color);
    content: "";
  }

  :deep(.van-button) {
    display: flex;
    width: 168px;
    height: 48px;
    padding: 10px 20px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }
}
</style>
