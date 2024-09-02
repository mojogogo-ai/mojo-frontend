<template>
  <el-dialog
    v-model="visible"
    width="1280px"
    :title="t('bots.bindKnowledge')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
  >
    <el-scrollbar class="h-[344px]">
      <div class="p-3">
        <div
          v-for="(base, i) in __data.baseList"
          class="page-list"
        >
          <el-card
            class="page-list__inner"
            shadow="hover"
          >
            <div class="flex">
              <div class="app-page-col">
                <el-image
                  class="page-list-img"
                  fit="cover"
                  :src="base.icon"
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
              <div class="w-full app-page-col">
                <div class="flex justify-between">
                  <div
                    class="text-base h-[24px] line-clamp-1"
                    :title="base.name"
                  >
                    {{ base.name }}
                  </div>
                  <div v-if="base.is_bind">
                    <el-button
                      v-if="hoverState[i]"
                      size="small"
                      type="danger"
                      plain
                      :disabled="isLoading"
                      @mouseleave="onMouseLeave(i)"
                      @click="updateKnowledgeBindState(base)"
                    >
                      {{ t('base.option.unbind') }}
                    </el-button>
                    <el-button
                      v-else
                      size="small"
                      type="primary"
                      :disabled="isLoading"
                      @mouseenter="hoverState[i] = true"
                    >
                      {{ t('base.option.bound') }}
                    </el-button>
                  </div>
                  <div v-else>
                    <el-button
                      size="small"
                      :disabled="isLoading"
                      @click="updateKnowledgeBindState(base)"
                    >
                      {{ t('base.option.bind') }}
                    </el-button>
                  </div>
                </div>
                <div class="text-xs line-clamp-2 my-2 h-[34px]">{{ base.description }}</div>
              </div>
            </div>
            <div class="text-[#7a7a7a] text-xs mb-2 inline-flex items-center">
              {{ t('base.label.createdAt') }}:
              {{
                isCn ? base.created_at : dayjs(base.created_at)
                  .subtract(new Date().getTimezoneOffset(), 'minute')
                  .format('YYYY-MM-DD HH:mm:ss')
              }}
            </div>
            <div class="text-[#7a7a7a] text-xs mb-2 inline-flex items-center">
              <span>{{ t('base.label.fileNumber') }}：</span>
              <span>{{ base.file_count }}{{ t('base.label.fileUnit') }}/</span>
              <span>{{ t('base.label.fileSize') }}：</span>
              <span>{{ base.friendly_file_size }}</span>
            </div>
          </el-card>
        </div>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { bindKnowledge, getBindKnowledgeList } from '@gptx/base/api/application';
import dayjs from 'dayjs';

const props = defineProps({
  botId: {
    type: String,
    default: ''
  }
});
const emits = defineEmits(['update']);

const visible = ref(false);
const hoverState = reactive({});
const __data = reactive({ baseList: [] });
let isLoading = ref(false);
const isCn = computed(() => {
  return  window.SITE_TYPE && window.SITE_TYPE === '2'
});

const open = () => {
  visible.value = true;
  _getBindKnowledgeList();
};
const onMouseLeave = (i) => setTimeout(() => (hoverState[i] = false), 300);
const updateKnowledgeBindState = async ({ id, is_bind }) => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    await bindKnowledge({ app_id: props.botId, knowledge_id: id, to_bind: !is_bind });
    isLoading.value = false;
    _getBindKnowledgeList();
    emits('update');
  } catch (error) {
    console.log(error);
    isLoading.value = false;
  }
};
const _getBindKnowledgeList = async () => {
  try {
    const {
      code,
      data: { list }
    } = await getBindKnowledgeList({ id: props.botId });
    if (code === 200) {
      __data.baseList = list;
    }
  } catch (error) {
    console.log(error);
  }
};

defineExpose({
  open
});
</script>
<style lang="scss">
.bind-knowledge {
  .page-list {
    padding: 0;
    min-width: unset;
    width: 374px;

    &:not(:nth-child(3n-2)) {
      margin-left: 25px;
    }
  }

  .page-list__inner {
    .el-card__body {
      min-height: unset;
      height: 154px;
    }
  }

  .page-list-img {
    width: 66px;
    height: 66px;

    .page-list-img__error {
      font-size: 15px;
    }
  }
}
</style>
