<template>
  <div class="app-page">
    <div
      v-if="showFilter"
      class="app-page-top"
    >
      <el-form
        class="flex"
        inline
        @submit.prevent
      >
        <!--
        <el-form-item
          class="w-[160px]"
          :label="t('bots.status') + ': '"
        >
          <el-select
            v-model="form.published"
            @change="_getAppList"
          >
            <el-option
              v-for="{ label, value } in statusOptionList"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        -->
        <el-form-item class="mr-[auto!important]">
          <el-input
            v-model="form.search"
            prefix-icon="search"
            class="w-[312px]"
            :placeholder="t('bots.a9')"
            @input="_getAppList"
          />
        </el-form-item>
      </el-form>
    </div>
    <div
      v-loading="isLoading"
      class="app-page-content"
      element-loading-background="transparent"
      :element-loading-text="t('common.loading')"
    >
      <el-scrollbar
        v-if="botList.length && !isLoading"
        class="h-full"
      >
        <div class="pt-3">
          <list-item
            v-for="bot in botList"
            class="app-page-item"
            :bot="bot"
            @chat="onChat($event, bot)"
            @delete="_getAppList"
            @refresh-list="_getAppList"
          />
        </div>
      </el-scrollbar>
      <template v-if="!botList.length && !isLoading">
        <el-empty
          v-if="form.search || form.published !== ''"
          :image="emptyRobotImageUrl"
        >
          <template #description>
            <div class="text-[16px] font-black">{{ t('bots.not_found') }}</div>
          </template>
        </el-empty>
        <el-empty
          v-else
          :image="emptyRobotImageUrl"
        >
          <template #description>
            <div class="text-[16px] font-black">{{ t('base.create_new') }}</div>
          </template>
          <el-button
            type="primary"
            linear
            @click="createNewBot"
          >
            {{ t('bots.new') }}
          </el-button>
        </el-empty>
      </template>
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
  published: '',
  search: '' /* ,
  page_num: 1,
  page_size: 10 */
});
const statusOptionList = [
  { value: '', label: t('base.title.select_status') },
  { value: true, label: t('bots.published') },
  { value: false, label: t('bots.unpublished') }
];
const isLoading = ref(false);
const botList = ref([]);
const showFilter = computed(() => {
  return botList.value.length || form.search || form.published !== '';
});

const createNewBot = () => baseInfoRef.value.open();
const afterCreateBot = async ({ app_id }) => {
  router.push(`/design/${app_id}`);
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
.el-empty__description {
  margin-top: 0;
}

.app-page-top {
  margin-bottom: 0;
}
</style>
