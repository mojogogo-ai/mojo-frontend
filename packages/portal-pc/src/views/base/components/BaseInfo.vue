<template>
  <el-dialog
    v-model="isVisible"
    width="622px"
    :title="isEdit ? t('base.edit') : t('base.new')"
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
        :label="t('base.name')"
        prop="name"
      >
        <el-input
          v-model="form.name"
          :placeholder="t('base.place.name')"
          maxlength="50"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="t('base.description')"
        prop="description"
      >
        <el-input
          v-model="form.description"
          type="textarea"
          :placeholder="t('base.place.description')"
          :rows="6"
          maxlength="2000"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item
        :label="t('base.icon')"
        prop="icon"
      >
        <avatar-generator
          :default-avatar="form.icon || defaultRobotAvatar"
          :name="form.name"
          :description="form.description"
          :title="t('base.icon')"
          :disabled-tooltip-text="t('base.generateTooltip')"
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
import { createKnowledgeBase, updateKnowledge } from '@gptx/base/api/knowledge';
import defaultRobotAvatar from '@/assets/logo/knowledge-icon-default.svg';

const emits = defineEmits(['after-create', 'after-update']);
const isVisible = ref(false);
const isEdit = ref(false);
const form = reactive({
  icon: '',
  name: '',
  description: ''
});
const rules = reactive({
  icon: [{ required: true, message: t('base.ruleMessage.icon'), trigger: 'change' }],
  name: [{ required: true, message: t('base.ruleMessage.name') }]
});
const formRef = ref(null);
const loading = ref(false);
const isAIloading = ref(false);

const onImageChange = (url) => (form.icon = url);
const open = (option) => {
  isEdit.value = !!(option && option?.id);
  form.icon = option?.icon || '';
  form.name = option?.name || '';
  form.description = option?.description || '';
  if (option?.id) form.id = option?.id;
  isVisible.value = true;
};
const close = () => {
  form.icon = '';
  form.name = '';
  form.description = '';
  isVisible.value = false;
  formRef.value.resetFields();
};
// commit action
const submitBaseInfo = async (el) => {
  if (loading.value) return;
  await el.validate(async (valid) => {
    if (valid) {
      if (isEdit.value) {
        editKnowledgeBase();
      } else {
        createNewKnowledgeBase();
      }
    }
  });
};
// update info
const editKnowledgeBase = async () => {
  try {
    loading.value = true;
    const result = await updateKnowledge(form);
    if (result.code === 200) {
      loading.value = false;
      close();
      emits('after-update');
    }
    loading.value = false;
  } catch (e) {
    console.log(e)
    loading.value = false;
  }
};
// create new base
const createNewKnowledgeBase = async () => {
  try {
    loading.value = true;
    const result = await createKnowledgeBase(form);
    if (result.code === 200) {
      loading.value = false;
      close();
      emits('after-create', result.data);
    }
    loading.value = false;
  } catch (e) {
    console.log(e)
    loading.value = false;
  }
};
defineExpose({ open });
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
