<template>
  <el-dialog
    v-model="isVisible"
    width="622px"
    :title="isEdit ? 'Edit basic information' : t('bots.new')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      label-position="top"
      :model="form"
      :rules="rules"
      :disabled="loading || isAIloading"
      @submit.prevent
    >
      <el-form-item
        :label="t('bots.label.name')"
        prop="name"
      >
        <el-input
          v-model="form.name"
          :placeholder="t('bots.place.name')"
          maxlength="50"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item
        label="Gender"
        prop="category_id"
      >
        <el-select
          v-model="form.category_id"
          multiple
          :multiple-limit="3"
          :placeholder="t('bots.place.catalog')"
        >
          <el-option
            v-for="{ name, id } in catalogList"
            :label="t(name)"
            :value="id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="Conversation Style"
        prop="category_id"
      >
        <el-select
          v-model="form.category_id"
          multiple
          :multiple-limit="3"
          :placeholder="t('bots.place.catalog')"
        >
          <el-option
            v-for="{ name, id } in catalogList"
            :label="t(name)"
            :value="id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="t('bots.icon')"
        prop="icon"
      >
        <avatar-generator
          :default-avatar="form.icon || defaultRobotAvatar"
          :name="form.name"
          :description="form.description"
          :title="t('bots.icon')"
          @before-generate="isAIloading = true"
          @after-generate="isAIloading = false"
          @change="onImageChange"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button
        :disabled="loading"
        @click="close"
      >
        {{ t('common.cancel') }}
      </el-button>
      <el-button
        type="primary"
        :loading="loading"
        :disabled="loading"
        linear
        @click="submitBaseInfo(formRef)"
      >
        {{ t('common.b') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { quickCreateApp, updateAppInfo } from '@gptx/base/api/application';
import defaultRobotAvatar from '@/assets/logo/bot-default-logo.svg';
import { storeAppCopy } from '@gptx/base/api/chat.js';

const emits = defineEmits(['after-create', 'after-update']);
const isVisible = ref(false);
const isEdit = ref(false);
const form = reactive({
  icon: '',
  name: '',
  description: '',
  category_id: []
});
const rules = reactive({
  name: [{ required: true, message: t('bots.ruleMessage.name') }],
});
const catalogList = reactive([]);
const formRef = ref(null);
const loading = ref(false);
const isAIloading = ref(false);
const isCopy = ref(false);

const open = async (option) => {
  isCopy.value = !!(option && option.from_id);
  isEdit.value = !!(option && option?.id);
  if (isCopy.value) form.from_id = option.from_id;
  form.icon = option?.icon || '';
  form.name = option?.name || '';
  form.description = option?.description || '';
  form.category_id = option?.category_id || [];
  if (option?.id) form.id = option?.id;
  isVisible.value = true;
  await nextTick();
  formRef.value.resetFields();
};
const close = () => {
  isVisible.value = false;
  formRef.value.resetFields();
};
const onImageChange = (url) => (form.icon = url);
// commit action
const submitBaseInfo = async (el) => {
  if (loading.value) return;
  await el.validate(async (valid) => {
    if (valid) {
      if (isCopy.value) await copyApp();
      else if (isEdit.value) await editAppInfo();
      else await createNewBot();
    }
  });
};
// update info
const editAppInfo = async () => {
  try {
    loading.value = true;
    const result = await updateAppInfo(form);
    if (result.code === 200) {
      loading.value = false;
      emits('after-update');
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
    const result = await quickCreateApp(form);
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
// const _getAppCategory = async () => {
//   try {
//     const {
//       code,
//       data: { list }
//     } = await getAppCategory({ pid: 10000 });
//     if (code === 200) {
//       catalogList.push(...list);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };
defineExpose({ open });
onMounted(async () => {
  // await _getAppCategory();
});
</script>

<style lang="scss" scoped>
.base-info-img {
  position: relative;
  width: 88px;
  height: 88px;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;

  &::after {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #eee;
    font-size: 24px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: rgba(#000, 0.4);
    content: '+';
    opacity: 0;
  }

  &:hover {
    &::after {
      opacity: 1;
    }
  }
}

.base-info-avatar {
  width: 100%;
  height: 100%;
}

.base-list-row {
  display: flex;
}

.base-list-col {
  & + & {
    margin-left: 16px;
  }
}

.base-list-img {
  width: 56px;
  height: 56px;
  border-radius: 8px;

  &__error {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 20px;
  }
}

.base-list-option {
  padding-top: 4px;
  color: #999;
  font-size: 20px;
  line-height: 32px;
  border-top: 1px solid #eee;

  .base-list-col {
    display: flex;
    align-items: center;

    & + .base-list-col {
      margin-left: 8px;
    }
  }
}

.el-card__body {
  padding: 12px 16px !important;
}
</style>
