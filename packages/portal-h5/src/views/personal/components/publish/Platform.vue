<template>
  <div class="p-2">
    <div class="page-list">
      <van-cell
        class="page-list__inner"
        shadow="hover"
      >
        <div class="flex">
          <div class="app-page-col">
            <van-image
              class="page-list-img"
              :src="IconShop"
            />
          </div>
          <div class="app-page-col flex-1">
            <div
              class="line-clamp-1 h-[24px] text-base font-black"
              :title="t('bots.publish.label.shop')"
            >
              {{ t('bots.publish.label.shop') }}
            </div>
            <div
              class="my-2 line-clamp-2 h-[42px] text-[#7a7a7a]"
              :title="t('bots.publish.label.shopDes')"
            >
              {{ t('bots.publish.label.shopDes') }}
            </div>
            <div class="w-full">
              <div class="w-fit">
                <van-checkbox
                  v-model="isChecked"
                  class="cover-checkbox"
                  shape="square"
                  icon-size="16"
                  @change="_configureStoreShare"
                >
                  {{ t('bots.publish.label.agree') }}
                </van-checkbox>
              </div>
              <div
                v-if="isChecked"
                class="w-2/3 mt-2"
              >
                <selector
                  v-model="isCopyable"
                  :columns="copyOptions"
                  border
                  @update:model-value="_configureStoreShare"
                />
              </div>
            </div>
          </div>
        </div>
      </van-cell>
    </div>
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import IconShop from '@/assets/images/bots/publish/shop.svg';
import { configureStoreShare } from '@gptx/base/api/application';

const props = defineProps({
  botId: {
    type: String,
    default: ''
  },
  data: {
    type: Object,
    default: () => ({})
  }
});
const emits = defineEmits(['update-option']);

const isChecked = ref(false);
const isCopyable = ref(false);
const copyOptions = [
  { text: t('bots.publish.label.copyable'), value: true },
  { text: t('bots.publish.label.notCopyable'), value: false }
];
let originData = null;

const _configureStoreShare = async () => {
  try {
    if (originData && originData.public === isChecked.value && originData.copyable === isCopyable.value) return;
    const { code } = await configureStoreShare({
      app_id: props.botId,
      public: isChecked.value,
      copyable: isCopyable.value
    });
    if (code === 200) {
      emits('update-option');
    }
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => props.data,
  (value) => {
    isChecked.value = value.public;
    isCopyable.value = value.copyable;
    originData = JSON.parse(JSON.stringify(value));
  }
);
</script>
