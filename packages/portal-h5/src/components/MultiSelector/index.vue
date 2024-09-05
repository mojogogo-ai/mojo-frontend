<template>
  <div
    class="selector-row"
    :class="{ 'is-bordered': border }"
    :style="{ borderRadius: radius }"
    @click="onShowPicker"
  >
    <div
      v-if="!modelValue.length && placeholder"
      class="selector-row-value is-placeholder"
    >
      {{ placeholder }}
    </div>
    <div
      v-else
      class="flex-1"
    >
      <div class="selector-row-value">
        <div class="flex flex-wrap">
          <div
            v-for="(tag, i) in modelValue"
            class="selector-row-col"
          >
            <van-tag
              size="large"
              closeable
              @close="onTagClose(i)"
            >
              {{ filterValue(tag) }}
            </van-tag>
          </div>
        </div>
      </div>
    </div>
    <van-icon
      class="selector-row-arrow"
      :name="showPicker ? 'arrow-up' : 'arrow-down'"
      size="14"
    />
  </div>
  <van-popup
    v-model:show="showPicker"
    round
    class="cover-popup select-popup"
    position="bottom"
    teleport="body"
  >
    <div class="cover-popup-head">
      <van-button
        link
        @click="showPicker = false"
      >
        {{ cancelButtonText }}
      </van-button>
      <div class="flex-1 text-center">{{ placeholder }}</div>
      <van-button
        type="primary"
        link
        @click="onConfirm"
      >
        {{ confirmButtonText }}
      </van-button>
    </div>
    <div class="cover-popup-body">
      <van-checkbox-group
        v-model="pickerValue"
        shape="square"
      >
        <van-cell
          v-for="column in columns"
          class="w-1/2"
        >
          <van-checkbox
            icon-size="14"
            :name="column[columnsFieldNames.value || 'value']"
            :disabled="
              !pickerValue.includes(column[columnsFieldNames.value || 'value']) &&
                pickerValue.length >= limit &&
                limit !== 0
            "
          >
            {{ column[columnsFieldNames.text || 'text'] }}
          </van-checkbox>
        </van-cell>
      </van-checkbox-group>
    </div>
  </van-popup>
</template>
<script setup>
import { t } from '@gptx/base/i18n';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: ''
  },
  border: {
    type: Boolean,
    default: false
  },
  radius: {
    type: String,
    default: '4px'
  },
  columns: {
    type: Array,
    default: () => []
  },
  columnsFieldNames: {
    type: Object,
    default: () => ({})
  },
  confirmButtonText: {
    type: String,
    default: () => t('common.confirm')
  },
  cancelButtonText: {
    type: String,
    default: () => t('common.cancel')
  },
  limit: {
    type: Number,
    default: 0
  }
});
const emits = defineEmits(['update:modelValue', 'confirm', 'cancel', 'change', 'click-option', 'scroll-into']);

const pickerValue = ref([]);
const showPicker = ref(false);

const filterValue = (value) => {
  return props.columns.find((_) => value === _[props.columnsFieldNames.value || 'value'])[
    props.columnsFieldNames.text || 'text'
  ];
};
const onTagClose = (i) => {
  pickerValue.value.splice(i, 1);
  emits('update:modelValue', pickerValue.value);
};
const onConfirm = () => {
  showPicker.value = false;
  emits('update:modelValue', pickerValue.value);
};
const onShowPicker = () => {
  showPicker.value = true;
  pickerValue.value = props.modelValue;
};

watch(
  () => props.modelValue,
  (val) => {
    pickerValue.value = val;
  },
  {
    immediate: true
  }
);
</script>

<style lang="scss" scoped>
.selector-row {
  --selector-value-color: #3a353c;
  --selector-padding: 4px 12px;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 30px;
  border: 1px solid transparent;

  &-value {
    display: -webkit-box;
    flex: 1;
    color: var(--selector-value-color);
    overflow: hidden;

    &.is-placeholder {
      --selector-value-color: #c0c4cc;
    }
  }

  &-col {
    padding: 2px;
  }

  &-arrow {
    --selector-value-color: #c0c4cc;
    color: var(--selector-value-color);
  }

  &.is-bordered {
    border-color: var(--van-border-color);
  }
}

.selector-option {
  display: flex;
  align-items: center;

  &.is-selected {
    color: var(--van-primary-color);
  }

  &.is-limit {
    &:not(.is-selected) {
      color: var(--van-gray-6);
    }
  }
}

.select-popup {
  .cover-popup-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cover-popup-body {
    padding-left: 4px;
    padding-right: 4px;
  }

  .van-cell {
    --van-cell-background: var(--h5-fill-color-light);
    --van-white: #000;
    display: inline-block;
    width: calc(50% - 8px);
    margin: 0 4px;
    border: 1px solid var(--van-border-color);
    border-radius: 10px;
    backdrop-filter: var(--backdrop-blur);

    &::after {
      display: none;
    }
  }
}
</style>
