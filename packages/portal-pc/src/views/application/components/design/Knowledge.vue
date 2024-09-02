<template>
  <el-scrollbar class="h-full">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :disabled="loading || disabled"
      @submit.prevent
    >
      <div class="design-form">
        <div class="design-form-item">
          <div class="design-form-title">
            {{ t('bots.label.similarity') }}
            <div class="text-sm text-[#7a7a7a] font-normal">1.{{ t('bots.label.similarityTip1') }}</div>
            <div class="text-sm text-[#7a7a7a] font-normal">2.{{ t('bots.label.similarityTip2') }}</div>
          </div>
          <div class="design-form-content">
            <el-slider
              v-model="form.k_min_score"
              :precision="2"
              :step="0.05"
              :max="1"
              :min="0.1"
              show-input
              @change="_updateConfig('k_min_score')"
            />
          </div>
        </div>
        <div class="design-form-item">
          <div class="design-form-title">
            {{ t('bots.label.searchCounts') }}
            <div class="text-sm text-[#7a7a7a] font-normal">
              {{ t('bots.label.searchCountsTip') }}
            </div>
          </div>
          <div class="design-form-content">
            <el-slider
              v-model="form.k_max_referenced"
              :max="30"
              :min="1"
              show-input
              @change="_updateConfig('k_max_referenced')"
            />
          </div>
        </div>
        <div class="design-form-item">
          <div class="design-form-title">
            {{ t('bots.label.notFound') }}
            <div class="text-sm text-[#7a7a7a] font-normal">{{ t('bots.label.notFoundTip1') }}</div>
            <div class="text-sm text-[#7a7a7a] font-normal">1.{{ t('bots.label.notFoundTip2') }}</div>
            <div class="text-sm text-[#7a7a7a] font-normal">2.{{ t('bots.label.notFoundTip3') }}</div>
          </div>
          <div class="design-form-content">
            <el-radio-group
              v-model="form.k_miss_strategy"
              @change="onStrategyChange"
            >
              <el-radio :value="1">{{ t('bots.placeholder.strategy1') }}</el-radio>
              <el-radio :value="2">{{ t('bots.placeholder.strategy2') }}</el-radio>
            </el-radio-group>
          </div>
          <div
            v-if="form.k_miss_strategy == '2'"
            class="design-form-content"
          >
            <el-form-item prop="k_miss_response">
              <el-input
                v-model="form.k_miss_response"
                type="textarea"
                maxlength="50"
                resize="none"
                show-word-limit
                :placeholder="t('bots.placeholder.autoReply')"
                :rows="4"
                @blur="_updateConfig('k_miss_response')"
              />
            </el-form-item>
          </div>
        </div>
        <div class="design-form-item">
          <div class="design-form-title">{{ t('bots.label.bindKnowledgeBase') }}</div>
          <div class="design-form-content">
            <div
              v-for="base in form.bind_list"
              class="page-list"
            >
              <el-card
                class="page-list__inner"
                shadow="hover"
              >
                <div class="relative flex items-center mb-2">
                  <el-image
                    class="page-list-img"
                    fit="cover"
                    :src="base.icon"
                  >
                    <template #error>
                      <div class="page-list-img__error">
                        <el-icon><Picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                  <div
                    class="flex-1 pl-2 pr-3 text-base line-clamp-1"
                    :title="base.name"
                  >
                    {{ base.name }}
                  </div>
                  <el-button
                    class="absolute top-0 right-[-6px]"
                    link
                    @click="updateKnowledgeBindState(base)"
                  >
                    <svg-icon
                      name="delete"
                      class="text-base text-[#7a7a7a] hover:text-[var(--el-color-danger)]"
                    />
                  </el-button>
                </div>
                <div class="text-[#7a7a7a]">
                  <div class="text-xs">
                    <span>{{ t('base.label.fileNumber') }}：</span>
                    <span>{{ base.file_count }}{{ t('base.label.fileUnit') }}</span>
                  </div>
                  <div class="text-xs">
                    <span>{{ t('base.label.fileSize') }}：</span>
                    <span>{{ base.friendly_file_size }}</span>
                  </div>
                </div>
              </el-card>
            </div>
            <div class="page-list">
              <el-card
                class="cursor-pointer page-list__inner"
                shadow="hover"
              >
                <el-button
                  class="bind-knowledge-btn"
                  link
                  @click="openKnowledgeBindDialog"
                >
                  <svg-icon
                    class="text-[26px]"
                    name="plus-square"
                  />
                  <div class="mt-1">{{ t('bots.label.bindKnowledgeBase') }}</div>
                </el-button>
              </el-card>
            </div>
          </div>
        </div>
        <design-bind-knowledge
          ref="bindKnowledgeRef"
          class="bind-knowledge"
          :bot-id="botId"
          @update="emits('update')"
        />
      </div>
    </el-form>
  </el-scrollbar>
</template>
<script setup>
import { t } from '@gptx/base/i18n';
import { updateConfig, bindKnowledge } from '@gptx/base/api/application';
import { DesignBindKnowledge } from './index';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  botId: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(['update']);

let form = reactive({
  bind_list: [],
  k_min_score: 0.75,
  k_max_referenced: 3,
  k_miss_strategy: 1,
  k_miss_response: ''
});
let formOrigin = {};
const rules = reactive({
  k_miss_response: null
});
const loading = ref(false);
const bindKnowledgeRef = ref(null);
/* ref dom */
const formRef = ref(null);

const openKnowledgeBindDialog = () => bindKnowledgeRef.value.open();
const onStrategyChange = () => {
  if (form.k_miss_strategy === 1) {
    _updateConfig('k_miss_strategy');
  } else {
    rules.k_miss_response = [{ required: true, message: t('bots.placeholder.autoReply') }];
    formRef.value.resetFields();
    if (form.k_miss_response) {
      _updateConfig('k_miss_strategy');
    }
  }
};
const updateKnowledgeBindState = async ({ id }) => {
  if (loading.value) return;
  try {
    loading.value = true;
    await bindKnowledge({ app_id: props.botId, knowledge_id: id, to_bind: false });
    loading.value = false;
    emits('update');
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
};
const _updateConfig = async (key) => {
  try {
    if (JSON.stringify(form[key]) === JSON.stringify(formOrigin[key])) return console.log('nothing changed');
    const isValidate = await formRef.value.validate();
    if (!isValidate) return;
    const params = {
      id: props.botId
    };
    switch (key) {
      case 'k_miss_strategy':
        if (form.k_miss_response) {
          params.k_miss_response = form.k_miss_response;
        }
        break;
      case 'k_miss_response':
        if (form.k_miss_strategy === 2) {
          params.k_miss_strategy = form.k_miss_strategy;
        }
        break;
    }
    loading.value = true;
    params[key] = form[key];
    const { code } = await updateConfig(params);
    if (code === 200) {
      emits('update');
    }
    loading.value = false;
  } catch (e) {
    console.log(e);
    loading.value = false;
  }
};

watch(
  () => props.data,
  (val) => {
    for (const key in form) {
      if (Object.hasOwnProperty.call(form, key)) {
        form[key] = val[key];
      }
    }
    formOrigin = JSON.parse(JSON.stringify(val));
  }
);
</script>
<style lang="scss" scoped>
:deep(.design-form-title) {
  display: block;
}
:deep(.el-input-number) {
  --el-border-color: #d3d3d3;
  .el-input-number__decrease,
  .el-input-number__increase {
    background: none;
  }
  .el-input__wrapper {
    background: none;
  }
}
.page-list {
  padding: 0;
  min-width: unset;
  width: 286px;
  &:not(:nth-child(2n-1)) {
    margin-left: 16px;
  }
}
.page-list__inner {
  :deep(.el-card__body) {
    min-height: unset;
    height: 102px;
  }
}
.page-list-img {
  width: 30px;
  height: 30px;
  .page-list-img__error {
    font-size: 15px;
  }
}
</style>
<style lang="scss">
.bind-knowledge-btn {
  height: 100% !important;
  &.el-button {
    > span {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
