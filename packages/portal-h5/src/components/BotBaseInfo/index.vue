<template>
  <van-popup
    v-model:show="isVisible"
    class="cover-popup"
    position="bottom"
    closeable
    round
    @close="emits('close')"
  >
    <div class="cover-popup-head">
      {{ isEdit ? t('base.edit') : t('bots.new') }}
    </div>
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
          name="category_id"
          background
          required
          :label="t('bots.label.catalog')"
          :rules="rules.category_id"
        >
          <template #input>
            <multi-selector
              v-model="form.category_id"
              :columns="catalogList.map((_) => ({ ..._, label: t(_.name) }))"
              :columns-field-names="{ text: 'label', value: 'id' }"
              :limit="3"
              :placeholder="t('bots.place.catalog')"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.description"
          name="description"
          type="textarea"
          maxlength="2000"
          show-word-limit
          clearable
          background
          required
          :rows="6"
          :label="t('bots.label.description')"
          :placeholder="t('bots.place.description')"
          :rules="rules.description"
        />
        <van-field
          :label="t('bots.icon')"
          name="icon"
          required
          :rules="rules.icon"
        >
          <template #input>
            <avatar-generator
              :default-avatar="form.icon || defaultRobotAvatar"
              :name="form.name"
              :description="form.description"
              :title="t('bots.icon')"
              :disabled-tooltip-text="t('bots.generateIconTooltip')"
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
import { getAppCategory, quickCreateApp, updateAppInfo } from '@gptx/base/api/application';
import defaultRobotAvatar from '@/assets/logo/bot-default-logo.svg';
import defaultBaseAvatar from '@/assets/logo/knowledge-icon-default.svg';
import { storeAppCopy } from '@gptx/base/api/chat.js';

const emits = defineEmits(['after-create', 'after-update', 'close']);
const isVisible = ref(false);
const isEdit = ref(false);
const form = reactive({
  icon: '',
  name: '',
  description: '',
  category_id: []
});
const rules = reactive({
  icon: [
    {
      message: t('bots.ruleMessage.icon'),
      trigger: 'change',
      validator: () => !!(form.icon && form.icon !== defaultBaseAvatar)
    }
  ],
  name: [{ required: true, message: t('bots.ruleMessage.name') }],
  description: [{ required: true, message: t('bots.ruleMessage.description') }],
  category_id: [
    {
      message: t('bots.ruleMessage.catalog'),
      validator: () => !!(form.category_id && form.category_id.length > 0)
    }
  ]
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
  // await nextTick();
  // formRef.value.resetFields();
};
const close = () => {
  isVisible.value = false;
  formRef.value.resetFields();
};
const onImageChange = (url) => (form.icon = url);
// commit action
const submitBaseInfo = async (el) => {
  try {
    if (loading.value) return;
    await el.validate();
    if (isCopy.value) await copyApp();
    else if (isEdit.value) await editAppInfo();
    else await createNewBot();
  } catch (e) {
    console.log(e);
  }
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
      emits('after-create');
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
const _getAppCategory = async () => {
  try {
    const {
      code,
      data: { list }
    } = await getAppCategory({ pid: 10000 });
    if (code === 200) {
      catalogList.push(...list);
    }
  } catch (error) {
    console.log(error);
  }
};
defineExpose({ open });
onMounted(async () => {
  await _getAppCategory();
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
