<template>
  <el-scrollbar class="h-full">
    <el-form
      :disabled="loading || disabled"
      @submit.prevent
    >
      <div class="design-form">
        <div class="design-form-item">
          <div class="design-form-title">{{ t('bots.label.model') }}</div>
          <div class="design-form-content">
            <el-select
              v-model="form.llm"
              size="large"
              :placeholder="t('bots.placeholder.model')"
              @change="_updateConfig('llm')"
            >
              <el-option
                v-for="{ llm, label } in llmList"
                :value="llm"
                :label="label"
              />
            </el-select>
          </div>
        </div>
        <div class="design-form-item">
          <div class="design-form-title">
            {{ t('bots.label.temperature') }}
            <div class="text-sm font-normal text-[#7a7a7a]">{{ t('bots.label.temperatureTip') }}</div>
          </div>
          <div class="design-form-content">
            <el-slider
              v-model="form.temperature"
              :precision="2"
              :step="0.05"
              :max="1"
              :min="0.1"
              show-input
              @change="_updateConfig('temperature')"
            />
          </div>
        </div>
        <div class="design-form-item">
          <div class="design-form-title">
            {{ t('bots.label.turns') }}
            <div class="text-sm font-normal text-[#7a7a7a]">
              {{ t('bots.label.turnsTip') }}
            </div>
          </div>
          <div class="design-form-content">
            <el-slider
              v-model="form.max_context_length"
              :precision="2"
              :step="1"
              :max="30"
              :min="1"
              show-input
              @change="_updateConfig('max_context_length')"
            />
          </div>
        </div>
      </div>
    </el-form>
  </el-scrollbar>
</template>
<script setup>
import { t } from '@gptx/base/i18n';
import { getSupportLLM, updateConfig } from '@gptx/base/api/application';

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

const llmList = reactive([]);
let form = reactive({
  llm: '',
  temperature: 0.5,
  max_context_length: 3
});
let formOrigin = {};
const loading = ref(false);

const _updateConfig = async (key) => {
  try {
    if (JSON.stringify(form[key]) === JSON.stringify(formOrigin[key])) return console.log('nothing changed');
    loading.value = true;
    const params = {
      id: props.botId
    };
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
const _getSupportLLM = async () => {
  try {
    const {
      data: { list },
      code
    } = await getSupportLLM();
    if (code === 200) {
      llmList.push(...list);
    }
  } catch (e) {
    console.log(e);
  }
};

watch(
  () => props.data,
  (val) => {
    form.llm = val.llm;
    form.temperature = val.temperature;
    form.max_context_length = val.max_context_length;
    formOrigin = JSON.parse(JSON.stringify(val));
  }
);
onMounted(() => {
  _getSupportLLM();
});
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
</style>
