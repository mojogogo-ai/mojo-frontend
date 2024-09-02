<template>
  <div class="page-list">
    <van-cell class="page-list__inner">
      <div class="flex">
        <div class="app-page-col">
          <van-image
            class="page-list-img"
            fit="cover"
            round
            :src="info.icon"
          >
            <template #error>
              <div class="page-list-img__error">
                <van-icon name="photo" />
              </div>
            </template>
          </van-image>
        </div>
        <div class="app-page-col">
          <div
            class="line-clamp-1 h-[24px] text-base"
            :title="info.name"
          >
            {{ info.name }}
          </div>
          <div
            class="my-2 line-clamp-2 h-[34px] text-xs"
            :title="info.description"
          >
            {{ info.description }}
          </div>
          <div class="mb-2 inline-flex items-center text-xs text-[#7a7a7a]">
            <van-icon
              class="mr-1"
              name="underway-o"
            />
            {{ t('base.label.updatedAt') }}:
            {{
              dayjs(info.updated_at).subtract(new Date().getTimezoneOffset(), 'minute').format('YYYY-MM-DD HH:mm:ss')
            }}
          </div>
        </div>
      </div>
      <div class="page-list-option">
        <div class="mr-auto">
          <div
            v-if="info.file_count"
            class="text-xs"
          >
            <span>{{ t('base.label.fileNumber') }}：</span>
            <span>{{ info.file_count }}{{ t('base.label.fileUnit') }}</span>
          </div>
          <div
            v-if="info.friendly_file_size"
            class="text-xs"
          >
            <span>{{ t('base.label.fileSize') }}：</span>
            <span>{{ info.friendly_file_size }}</span>
          </div>
        </div>
        <div class="app-page-col icon-primary">
          <svg-icon
            name="edit"
            class="text-base"
            @click.stop="emits('edit')"
          />
        </div>
        <div class="app-page-col icon-danger">
          <svg-icon
            name="delete"
            class="text-base"
            @click.stop="_delBase"
          />
        </div>
      </div>
    </van-cell>
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import dayjs from 'dayjs';
import { showConfirmDialog } from 'vant';

const props = defineProps({
  info: {
    type: Object,
    default: () => {}
  }
});
const emits = defineEmits(['edit', 'delete']);
const isShowPopConfirm = ref(false);
const onDelete = () => {
  isShowPopConfirm.value = false;
  emits('delete', props.info);
};

const _delBase = async () => {
  try {
    const action = await showConfirmDialog({
      title: t('base.title.delete'),
      message: t('base.title.deleteSub'),
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      showConfirmButton: true
    });
    if (action === 'confirm') onDelete();
  }catch (e) {
    console.log(e);
  }
};
</script>

<style lang="scss" scoped>
.page-list-img {
  border-radius: 50%;
}

.icon-primary {
  &:active {
    color: var(--van-primary-color);
  }
}

.icon-danger {
  &:active {
    color: var(--van-danger-color);
  }
}
</style>
