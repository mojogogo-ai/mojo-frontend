<template>
  <van-form
    class="cover-form"
    :disabled="loading || disabled"
  >
    <div class="design-form">
      <div class="design-form-item">
        <div class="design-form-title">{{ t('bots.label.model') }}</div>
        <div class="design-form-content">
          <selector
            v-model="form.llm"
            border
            :columns="llmList"
            :columns-field-names="{ text: 'label', value: 'llm' }"
            :placeholder="t('bots.placeholder.model')"
            @update:model-value="_updateConfig('llm')"
          />
        </div>
      </div>
      <div class="design-form-item">
        <div class="design-form-title">
          {{ t('bots.label.temperature') }}
          <svg-icon
            class="info-icon"
            name="info-o"
            @click="emits('show-tip', { title: t('bots.label.temperature'), message: t('bots.label.temperatureTip') })"
          />
        </div>
        <div class="design-form-content">
          <div class="py-4">
            <van-slider
              v-model="form.temperature"
              bar-height="6"
              :step="0.05"
              :max="1"
              :min="0.1"
              @change="_updateConfig('temperature')"
            >
              <template #button>
                <van-button
                  class="custom-slider-button"
                  round
                >
                  {{ form.temperature }}
                </van-button>
              </template>
            </van-slider>
          </div>
          <div class="flex justify-between">
            <div class="text-gray-400">0.1</div>
            <div class="text-gray-400">1</div>
          </div>
        </div>
      </div>
      <div class="mb-0 design-form-item">
        <div class="design-form-title">
          {{ t('bots.label.turns') }}
          <svg-icon
            class="info-icon"
            name="info-o"
            @click="emits('show-tip', { title: t('bots.label.turns'), message: t('bots.label.turnsTip') })"
          />
        </div>
        <div class="design-form-content">
          <div class="py-4">
            <van-slider
              v-model="form.max_context_length"
              bar-height="6"
              :step="1"
              :max="30"
              :min="1"
              @change="_updateConfig('max_context_length')"
            >
              <template #button>
                <van-button
                  class="custom-slider-button"
                  round
                >
                  {{ form.max_context_length }}
                </van-button>
              </template>
            </van-slider>
          </div>
          <div class="flex justify-between">
            <div class="text-gray-400">1</div>
            <div class="text-gray-400">30</div>
          </div>
        </div>
      </div>
    </div>
  </van-form>
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
const emits = defineEmits(['update', 'show-tip']);

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
</style>
