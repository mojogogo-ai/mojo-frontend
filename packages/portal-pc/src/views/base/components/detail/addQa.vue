<template>
  <el-dialog
    v-model="isVisible"
    width="480px"
    title="新增问答"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      label-position="top"
      :model="form"
      :rules="rules"
      :disabled="loading"
      @submit.prevent
    >
      <el-form-item
        label="问"
        prop="question"
      >
        <el-input
          v-model="form.question"
          type="textarea"
          :rows="3"
          maxlength="2000"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item
        label="答"
        prop="answer"
      >
        <el-input
          v-model="form.answer"
          type="textarea"
          :rows="3"
          maxlength="2000"
          show-word-limit
          clearable
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
        @click="submitAdd(formRef)"
      >
        {{ t('common.b') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import {  docAddSegmented } from '@gptx/base/api/knowledge';

const emits = defineEmits(['after-create']);
const isVisible = ref(false);
const props = defineProps({
  baseId: {
    type: [Number, String],
    default: ''
  },
  docId: {
    type: [Number, String],
    default: null
  }
});

const form = reactive({
  question: '',
  answer: '',
});
const rules = reactive({
  question: [{ required: true, message: '请填写' }],
  answer: [{ required: true, message: '请填写' }]
});
const formRef = ref(null);
const loading = ref(false);

const open = async () => {
  isVisible.value = true;
  await nextTick();
  formRef.value.resetFields();
};
const close = () => {
  isVisible.value = false;
  formRef.value.resetFields();
};
 
const submitAdd = async (el) => {
  if (loading.value) return;
  await el.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
       let params ={
          base_id: props.baseId,
          doc_id: props.docId,
          extra_type: 0,
          segment_position: 0,
          question: form.question,
          answer: form.answer
        }
        const result = await docAddSegmented(params);
        if (result.code === 200) {
          loading.value = false;
          emits('after-create');
          close();
        }
        loading.value = false;
      } catch (e) {
        console.log(e);
        loading.value = false;
      }
    }
  });
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
