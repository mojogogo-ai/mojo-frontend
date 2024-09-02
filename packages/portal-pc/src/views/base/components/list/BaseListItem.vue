<template>
  <div class="page-list">
    <el-card
      class="page-list__inner bg-[#fff] cursor-pointer"
      shadow="hover"
    >
      <div class="flex">
        <div class="app-page-col">
          <el-image
            class="page-list-img"
            fit="cover"
            :src="info.icon"
          >
            <template #error>
              <div class="page-list-img__error">
                <el-icon>
                  <Picture />
                </el-icon>
              </div>
            </template>
          </el-image>
        </div>
        <div class="app-page-col">
          <div
            class="text-base h-[24px] line-clamp-1"
            :title="info.name"
          >
            {{ info.name }}
          </div>
          <div
            class="text-xs line-clamp-2 my-2 h-[34px]"
            :title="info.description"
          >
            {{ info.description }}
          </div>
          <div class="text-[#7a7a7a] text-xs mb-2 inline-flex items-center">
            <el-icon>
              <Clock />
            </el-icon>
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
        <div class="app-page-col cursor-pointer hover:text-[var(--el-menu-active-color)] ml-auto">
          <svg-icon
            name="edit"
            class="text-base"
            @click.stop="emits('edit')"
          />
        </div>
        <div class="app-page-col cursor-pointer hover:text-[var(--el-color-danger)]">
          <el-popover
            v-model:visible="isShowPopConfirm"
            placement="bottom"
            trigger="click"
            :width="300"
          >
            <template #reference>
              <svg-icon
                name="delete"
                class="text-base"
                @click.stop="() => {}"
              />
            </template>
            <template #default>
              <div class="mb-[10px] font-black text-base flex items-center">
                {{ t('base.title.delete') }}
              </div>
              <div class="mb-[16px] flex">
                <div class="text-[40px]">
                  <el-icon class="text-[#f90] mr-[2px]">
                    <WarningFilled />
                  </el-icon>
                </div>
                <div class="ml-2 text-sm">
                  {{ t('base.title.deleteSub') }}
                </div>
              </div>
              <div class="text-right">
                <el-button
                  size="small"
                  @click.stop="isShowPopConfirm = false"
                >
                  {{ t('common.cancel') }}
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click.stop="onDelete"
                >
                  {{ t('common.confirm') }}
                </el-button>
              </div>
            </template>
          </el-popover>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import dayjs from 'dayjs';

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
</script>

<style lang="scss" scoped>
.page-list-img {
  border-radius: 50%;
}
</style>
