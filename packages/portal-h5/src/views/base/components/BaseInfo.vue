<template>
  <van-popup
    v-model:show="isVisible"
    class="cover-popup"
    position="bottom"
    closeable
    round
  >
    <div class="cover-popup-head">{{ isEdit ? t('base.edit') : t('base.new') }}</div>
    <div class="cover-popup-body">
      <van-form
        ref="formRef"
        class="cover-form"
        label-align="top"
        :disabled="loading || isAIloading"
        @submit="submitBaseInfo"
      >
        <van-field
          v-model="form.name"
          type="textarea"
          name="name"
          maxlength="50"
          show-word-limit
          clearable
          background
          required
          :label="t('base.name')"
          :placeholder="t('base.place.name')"
          :rules="rules.name"
        />
        <van-field
          v-model="form.description"
          name="description"
          type="textarea"
          maxlength="2000"
          show-word-limit
          clearable
          background
          :label="t('base.description')"
          :placeholder="t('base.place.description')"
          :rows="6"
        />
        <van-field
          name="icon"
          required
          :label="t('base.icon')"
          :rules="rules.icon"
        >
          <template #input>
            <avatar-generator
              :default-avatar="form.icon || defaultBaseAvatar"
              :name="form.name"
              :description="form.description"
              :title="t('base.icon')"
              :disabled-tooltip-text="t('base.generateTooltip')"
              @before-generate="isAIloading = true"
              @after-generate="isAIloading = false"
              @change="onImageChange"
            />
          </template>
        </van-field>
      </van-form>
    </div>
    <div class="cover-popup-foot">
      <van-button
        size="small"
        :disabled="loading"
        @click="close"
      >
        {{ t('common.cancel') }}
      </van-button>
      <van-button
        type="primary"
        size="small"
        linear
        :loading="loading"
        :disabled="loading"
        @click="submitBaseInfo(formRef)"
      >
        {{ t('common.b') }}
      </van-button>
    </div>
  </van-popup>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { createKnowledgeBase, updateKnowledge } from '@gptx/base/api/knowledge';
import defaultBaseAvatar from '@/assets/logo/knowledge-icon-default.svg';

const emits = defineEmits(['after-create', 'after-update']);
const isVisible = ref(false);
const isEdit = ref(false);
const form = reactive({
  icon: '',
  name: '',
  description: ''
});
const rules = reactive({
  icon: [
    {
      message: t('base.ruleMessage.icon'),
      validator: () => {
        return !!(form.icon && form.icon !== defaultBaseAvatar);
      }
    }
  ],
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
};
// commit action
const submitBaseInfo = async (el) => {
  try {
    if (loading.value) return;
    await el.validate();
    if (isEdit.value) {
      await editKnowledgeBase();
    } else {
      await createNewKnowledgeBase();
    }
  } catch (e) {
    console.log(e);
  }
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
    console.log(e);
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
    console.log(e);
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
</style>
