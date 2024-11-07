<template>
  <div class="bot-management">
    <div class="bot-management-title">
      Bot Management
    </div>
    <div
      v-if="showFilter"
      style="visibility: hidden"
      class="bot-management-top"
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
            @change="_getMyBotList"
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
            @input="_getMyBotList"
          />
        </el-form-item>
      </el-form>
    </div>
    <div
      v-loading="isLoading"
      class="bot-management-content"
      element-loading-background="transparent"
      :element-loading-text="t('common.loading')"
    >
      <el-scrollbar
        v-if="botList.length && !isLoading"
        class="h-full"
      >
        <div class="pt-3 flex gap-5 flex-wrap">
          <list-item
            v-for="bot in botList"
            class="bot-management-item"
            :bot="bot"
            @chat="onChat($event, bot)"
            @delete="_getMyBotList"
            @refresh-list="_getMyBotList"
            @click="editBot(bot)"
          />
        </div>
      </el-scrollbar>
      <template v-if="!botList.length && !isLoading">
        <el-empty
          v-if="form.search || form.published !== ''"
          :image="emptyRobotImageUrl"
        >
          <template #description>
            <div class="no-content-psl font-black">{{ t('common.noContent') }}</div>
          </template>
        </el-empty>
        <el-empty
          v-else
          :image="emptyRobotImageUrl"
        >
          <template #description>
            <div class="no-content-psl font-black">{{ t('common.noContent') }}</div>
          </template>
          <el-button
            type="primary"
            linear
            class="new-bot-btn"
            @click="createNewBot"
          >
            + {{ t('bots.new') }}
          </el-button>
        </el-empty>
      </template>
    </div>
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import emptyRobotImageUrl from '@/assets/images/smart-people.svg';
import { getMyBotList } from '@gptx/base/api/application';
import ListItem from './components/list/ListItem.vue';
import { eventBus } from '@gptx/base/utils/eventBus.js';


const form = reactive({
  published: '',
  search: '' /* ,
  page_num: 1,
  page_size: 10 */
});
const isLoading = ref(false);
const botList = ref([]);
const showFilter = computed(() => {
  return botList.value.length || form.search || form.published !== '';
});
// 监听createBotSuccess，刷新
eventBus.on('createBotSuccess', () => {
  _getMyBotList();
});
eventBus.on('botPublishSuccess', () => {
  _getMyBotList();
});
const createNewBot = () => {
  eventBus.emit('createBot');
};
const editBot = (bot) => {
  eventBus.emit('editBot', bot);
};
const _getMyBotList = async () => {
  isLoading.value = true;
  try {
    const result = await getMyBotList(form);
    const {
      code,
      data: { list }
    } = result;
    if (code === 200) botList.value = list || [];
    isLoading.value = false;
  } catch (e) {
    console.log(e);
    isLoading.value = false;
  }
};
const onChat = ({ url }) => {
  // console.log('onChat', url);
  // const { url } = {url};
  window.open(url, '_blank');
};
onMounted(() => {
  _getMyBotList();
});
</script>

<style lang="scss" scoped>
.el-empty__description {
  margin-top: 0;
}

.bot-management-top {
  margin-bottom: 0;
}
:deep(.el-empty) {
  margin-top: 120px;
}
:deep(.el-empty__image) {
  width: 240px;
}

.bot-management-title{
  margin-top: 70px;
  color: var(--Style, #E1FF01);
  text-align: center;
  font-feature-settings: 'dlig' on;
  font-family: Inter;
  font-size: 32px;
  font-style: normal;
  font-weight: 500;
  line-height: 23px; /* 71.875% */
}
:deep(.el-empty__description){
  margin-top: 40px;
  margin-bottom: 20px;
  .no-content-psl{
    color: rgba(255, 255, 255, 0.70);
    text-align: center;
    font-feature-settings: 'dlig' on;
    font-family: Inter;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 19px; /* 105.556% */
  }
}
:deep(.new-bot-btn) {
  display: inline-flex;
  padding: 16px 79.5px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background: var(--Style, #E1FF01);
}
</style>
