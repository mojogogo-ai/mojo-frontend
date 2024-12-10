<template>
  <div
    class="selector-row"
    :class="{ 'is-bordered': border, 'is-background': background }"
    :style="{ borderRadius: radius }"
    @click="showPicker = true"
  >
    <slot
      v-if="slots.default"
      name="default"
    />
    <template v-else>
      <div
        class="selector-row-value"
        :class="{ 'is-placeholder': (modelValue === '' || modelValue === null || modelValue === undefined) && placeholder }"
      >
        {{ modelValuePlaceholder || placeholder }}
      </div>
      <van-icon
        class="selector-row-arrow"
        :name="showPicker ? 'arrow-up' : 'arrow-down'"
        size="14"
      />
    </template>
  </div>
  <van-popup
    v-model:show="showPicker"
    round
    position="bottom"
    teleport="body"
  >
    <van-picker
      v-model="pickerValue"
      :columns="columns"
      :columns-field-names="columnsFieldNames"
      :cancel-button-text="cancelButtonText"
      :confirm-button-text="confirmButtonText"
      :title="title"
      :show-toolbar="showToolbar"
      :allow-html="allowHtml"
      :option-height="optionHeight"
      :visible-option-num="visibleOptionNum"
      :toolbar-position="toolbarPosition"
      :loading="loading"
      :read-only="readOnly"
      @cancel="(showPicker = false), emits('cancel', $event)"
      @confirm="onConfirm"
      @change="emits('change', $event)"
    />
  </van-popup>
</template>
<script setup>
import { t } from '@gptx/base/i18n';

const slots = useSlots();
const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  border: {
    type: Boolean,
    default: false
  },
  background: {
    type: Boolean,
    default: false
  },
  radius: {
    type: String,
    default: '10px'
  },
  columns: {
    type: Array,
    default: () => []
  },
  columnsFieldNames: {
    type: Object,
    default: () => ({})
  },
  title: {
    type: String,
    default: ''
  },
  confirmButtonText: {
    type: String,
    default: () => t('common.confirm')
  },
  cancelButtonText: {
    type: String,
    default: () => t('common.cancel')
  },
  toolbarPosition: {
    type: String,
    default: 'top'
  },
  loading: {
    type: Boolean,
    default: false
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  showToolbar: {
    type: Boolean,
    default: true
  },
  allowHtml: {
    type: Boolean,
    default: false
  },
  optionHeight: {
    type: [String, Number],
    default: 44
  },
  visibleOptionNum: {
    type: [String, Number],
    default: 6
  },
  swipeDuration: {
    type: [String, Number],
    default: 1000
  }
});
const emits = defineEmits(['update:modelValue', 'confirm', 'cancel', 'change', 'click-option', 'scroll-into']);

const pickerValue = ref([]);
const showPicker = ref(false);
const modelValuePlaceholder = computed(() => {
  const result = props.columns.find((_) => _[props.columnsFieldNames.value || 'value'] === props.modelValue);
  if (result) return result[props.columnsFieldNames.text || 'text'];
  return '';
});

const onConfirm = () => {
  showPicker.value = false;
  emits('update:modelValue', pickerValue.value[0]);
};

watch(
  () => props.modelValue,
  (val) => {
    pickerValue.value = [val];
  },
  {
    immediate: true
  }
);
</script>

<style lang="scss" scoped>
.selector-row {
  --selector-value-color: rgba(255, 255, 255,1);
  --selector-padding: 4px 4px;
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--selector-padding);
  border: 1px solid transparent;

  &-value {
    display: -webkit-box;
    flex: 1;
    line-height: 24px;
    color: var(--selector-value-color);
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;

    &.is-placeholder {
      --selector-value-color: rgba(255, 255, 255,0.7);
    }
  }

  &-arrow {
    --selector-value-color: #c0c4cc;
    color: var(--selector-value-color);
  }

  &.is-bordered {
    border-color: var(--van-border-color);
  }

  &.is-background {
    background-color: #fff;
  }
}
</style>
