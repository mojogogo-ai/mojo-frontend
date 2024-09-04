<template>
  <div class="pt-[52px]">
    <div class="p-3">
      <div class="page-list">
        <el-card
          class="page-list__inner"
          shadow="hover"
        >
          <div class="flex">
            <div class="app-page-col">
              <el-image
                class="page-list-img"
                :src="IconShop"
              />
            </div>
            <div class="flex-1 app-page-col">
              <div
                class="h-[24px] text-base font-black line-clamp-1"
                :title="t('bots.publish.label.shop')"
              >
                {{ t('bots.publish.label.shop') }}
              </div>
              <div
                class=" text-[var(--el-text-color-placeholder)] line-clamp-2 my-2 h-[42px]"
                :title="t('bots.publish.label.shopDes')"
              >
                {{ t('bots.publish.label.shopDes') }}
              </div>
              <div class="w-full">
                <div class="w-fit">
                  <el-checkbox
                    v-model="isChecked"
                    @change="_configureStoreShare"
                  >
                    {{ t('bots.publish.label.agree') }}
                  </el-checkbox>
                </div>
                <div
                  v-if="isChecked"
                  class="w-2/3"
                >
                  <el-select
                    v-model="isCopyable"
                    size="small"
                    @change="_configureStoreShare"
                  >
                    <el-option
                      :label="t('bots.publish.label.copyable')"
                      :value="true"
                    />
                    <el-option
                      :label="t('bots.publish.label.notCopyable')"
                      :value="false"
                    />
                  </el-select>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
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

const _configureStoreShare = async () => {
  try {
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
  }
);
</script>
