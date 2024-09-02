<template>
  <div class="app-page">
    <page-header
      :title="t('menu.c')"
      :placeholder="t('bots.a9')"
      input-area
      @search="onSearch"
    />
    <div
      v-if="isLoading"
      class="flex items-center justify-center app-page-content"
    >
      <van-loading
        class="cover-loading"
        size="36px"
        color="var(--van-loading-color)"
        vertical
      >
        {{ t('common.loading') }}
      </van-loading>
    </div>
    <div
      v-else
      class="app-page-content"
    >
      <div class="flex flex-col h-full">
        <van-floating-bubble
          v-if="showFilter"
          axis="xy"
          magnetic="x"
          icon="plus"
          @click="createNewBot"
        />
        <div
          v-if="botList.length"
          class="flex-1 overflow-hidden"
        >
          <div class="app-list-scroll">
            <div class="pt-3">
              <list-item
                v-for="bot in botList"
                class="app-page-item"
                :bot="bot"
                @chat="onChat($event, bot)"
                @delete="_getAppList"
                @refresh-list="_getAppList"
              />
              <div class="h-[48px]" />
            </div>
          </div>
        </div>
        <template v-if="!botList.length">
          <van-empty
            v-if="form.search"
            :image="emptyRobotImageUrl"
          >
            <template #description>
              <div class="text-[16px] font-black">{{ t('bots.not_found') }}</div>
            </template>
          </van-empty>
          <van-empty
            v-else
            :image="emptyRobotImageUrl"
          >
            <template #description>
              <div class="text-[16px] font-black">{{ t('base.create_new') }}</div>
            </template>
            <van-button
              type="primary"
              size="small"
              linear
              @click="createNewBot"
            >
              {{ t('bots.new') }}
            </van-button>
          </van-empty>
        </template>
      </div>
    </div>
  </div>
  <bot-base-info
    ref="baseInfoRef"
    @after-create="afterCreateBot"
  />
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import emptyRobotImageUrl from '@/assets/images/empty-robot.png';
import { getAppList } from '@gptx/base/api/application';
import ListItem from './components/list/ListItem.vue';

const router = useRouter();
/* ref dom */
const baseInfoRef = ref(null);

const form = reactive({
  search: '' /* ,
  page_num: 1,
  page_size: 10 */
});
const isLoading = ref(false);
const botList = ref([]);
const showFilter = computed(() => {
  return botList.value.length || form.search;
});

const createNewBot = () => baseInfoRef.value.open();
const afterCreateBot = async () => {
  await _getAppList();
  const { id } = botList.value[0];
  router.push({ path: `/design/${id}` });
};
const onSearch = (value) => {
  form.search = value;
  _getAppList();
};
const _getAppList = async () => {
  isLoading.value = true;
  try {
    const result = await getAppList(form);
    const {
      code,
      data: { list }
    } = result;
    if (code === 200) botList.value = list;
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  } catch (e) {
    console.log(e);
    isLoading.value = false;
  }
};
const onChat = (plat, { shared_social }) => {
  const { link } = shared_social[plat];
  window.open(link, '_blank');
};
onMounted(() => {
  _getAppList();
});
</script>

<style lang="scss" scoped>

.page-list {
  &:last-child {
    margin-bottom: 64px;
  }
}

.app-list-scroll {
  height: 100%;
  overflow: hidden auto;
}

.h-\[48px\] {
  height: 64px;
}
</style>
