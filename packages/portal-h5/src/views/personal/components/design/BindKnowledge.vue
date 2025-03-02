<template>
  <van-popup
    v-model:show="visible"
    class="cover-popup"
    position="bottom"
    closeable
  >
    <div class="cover-popup-head">Bind base</div>
    <div class="cover-popup-body">
      <div class="design-scroll">
        <div class="p-3">
          <div
            v-for="base in __data.baseList"
            class="page-list"
          >
            <van-cell
              class="page-list__inner"
              shadow="hover"
            >
              <div class="flex">
                <div class="app-page-col">
                  <van-image
                    class="page-list-img"
                    fit="cover"
                    :src="base.icon"
                  >
                    <template #error>
                      <div class="page-list-img__error">
                        <van-icon name="photo" />
                      </div>
                    </template>
                  </van-image>
                </div>
                <div class="w-full app-page-col">
                  <div class="flex justify-between">
                    <div
                      class="line-clamp-1 h-[24px] text-base"
                      :title="base.name"
                    >
                      {{ base.name }}
                    </div>
                    <van-button
                      v-if="base.is_bind"
                      size="mini"
                      type="danger"
                      :disabled="isLoading"
                      @click="updateKnowledgeBindState(base)"
                    >
                      Unbound
                    </van-button>
                    <van-button
                      v-else
                      size="mini"
                      :disabled="isLoading"
                      @click="updateKnowledgeBindState(base)"
                    >
                      Bound
                    </van-button>
                  </div>
                  <div class="my-2 line-clamp-2 h-[34px] text-xs">{{ base.description }}</div>
                </div>
              </div>
              <div class="mb-2 items-center text-xs text-[#7a7a7a]">
                Create time:
                {{
                  isCn ? base.created_at : dayjs(base.created_at)
                    .subtract(new Date().getTimezoneOffset(), 'minute')
                    .format('YYYY-MM-DD HH:mm:ss')
                }}
              </div>
              <div class="mb-2 items-center text-xs text-[#7a7a7a]">
                <span>Number of files：</span>
                <span>{{ base.file_count }}files/</span>
                <span>File size：</span>
                <span>{{ base.friendly_file_size }}</span>
              </div>
            </van-cell>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { bindKnowledge, getBindKnowledgeList } from '@gptx/base/api/application';
import { t } from '@gptx/base/i18n';
import dayjs from 'dayjs';

const props = defineProps({
  botId: {
    type: String,
    default: ''
  }
});
const emits = defineEmits(['update']);

const visible = ref(false);
const __data = reactive({ baseList: [] });
let isLoading = ref(false);
const isCn = computed(() => {
  return  window.SITE_TYPE && window.SITE_TYPE === '2'
});

const open = () => {
  visible.value = true;
  _getBindKnowledgeList();
};
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
<style scoped lang="scss">
.cover-popup-body {
  padding: 10px 0;
}
</style>
<style lang="scss">
.bind-knowledge {
  .page-list {
    padding: 0;
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
