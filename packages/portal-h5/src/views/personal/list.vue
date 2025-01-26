<template>
  <page-header
    :title="t('menu.c')"
    :placeholder="t('bots.a9')"
  />
  <div class="bot-management">
    <div class="bot-management-title">
      Manage My Bots
    </div>
    <div class="bot-management-content">
      <van-list
        v-model:loading="isLoading"
        :finished="!isLoadMore"
        finished-text="no more"
        style="height: calc(100vh - 140px);overflow-y: auto"
        @load="onLoad"
      >
        <list-item
          v-for="bot in botList"
          :key="bot.id"
          class="bot-management-item"
          :bot="bot"
          @chat="onChat($event, bot)"
          @delete="_getMyBotList"
          @refresh-list="_getMyBotList"
          @click="editBot(bot)"
        />

        <!-- 空内容展示 -->
        <template v-if="!isLoading && botList.length === 0">
          <van-empty :image="emptyRobotImageUrl">
            <template #description>
              <div class="font-black no-content-psl">{{ t('common.noContent') }}</div>
            </template>
            <!-- 显示创建新 Bot 按钮的条件 -->
            <van-button
              v-if="!form.search && form.published === ''"
              type="primary"
              class="new-bot-btn"
              @click="createNewBot"
            >
              + {{ t('bots.new') }}
            </van-button>
          </van-empty>
        </template>
        <!-- 加载中时显示加载指示器 -->
        <!--        <van-loading v-if="isLoading && botList.length === 0" text="{{ t('common.loading') }}" />-->
      </van-list>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { t } from '@gptx/base/i18n';
import emptyRobotImageUrl from '@/assets/images/smart-people.svg';
import { getMyBotList } from '@gptx/base/api/application';
import ListItem from './components/list/ListItem.vue';
import { eventBus } from '@gptx/base/utils/eventBus.js';
import { useRouter } from 'vue-router';

const form = reactive({
  published: '',
  search: '',
  page_num: 1,
  page_size: 10
});
const isLoading = ref(false);
const botList = ref([]);
const total = ref(0);
const isLoadMore = ref(true);
const router = useRouter();

// 监听 createBotSuccess 和 botPublishSuccess 事件，刷新列表
eventBus.on('createBotSuccess', () => {
  resetList();
});
eventBus.on('botPublishSuccess', () => {
  resetList();
});

const createNewBot = () => {
  router.push({ path: '/memebot' });
};
const editBot = (bot) => {
  eventBus.emit('editBot', bot);
};
const _getMyBotList = async () => {
  if (!isLoadMore.value || isLoading.value) return; // 如果已加载完或正在加载中则退出
  isLoading.value = true;
  try {
    const result = await getMyBotList(form);
    const {
      code,
      data: { list, page }
    } = result;
    if (code === 200) {
      botList.value = [...botList.value, ...(list || [])];
      total.value = page.total;
      // 检查是否加载完所有数据
      if (botList.value.length >= total.value) {
        isLoadMore.value = false;
      } else {
        form.page_num += 1;
      }
    }
    isLoading.value = false;
  } catch (e) {
    console.log(e);
    isLoading.value = false;
  }
};
const resetList = () => {
  botList.value = [];
  form.page_num = 1;
  isLoadMore.value = true;
  _getMyBotList();
};
const onChat = ({ url }) => {
  const cleanUrl = url.replace(/^"|"$/g, '');
  window.open(cleanUrl, '_blank');
};

const onLoad = () => {
  _getMyBotList();
};


onMounted(() => {
  _getMyBotList();
});
</script>

<style scoped>
.bot-management {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 让容器占满整个视口高度 */
  padding: 20px;
  box-sizing: border-box;
}

.bot-management-title {
  margin-top: 20px;
  margin-bottom: 20px;
  color: var(--Style, #E1FF01);
  text-align: center;
  font-feature-settings: 'dlig' on;
  font-family: Inter, sans-serif;
  font-size: 32px;
  font-style: normal;
  font-weight: 500;
  line-height: 1.2; /* 使用倍数而不是固定像素 */
}

.no-content-psl {
  color: rgba(255, 255, 255, 0.70);
  text-align: center;
  font-feature-settings: 'dlig' on;
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 1.1;
}

.new-bot-btn {
  display: inline-flex;
  padding: 16px 79.5px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background: var(--Style, #E1FF01);
  margin-top: 20px;
}


/* 响应 Vant Empty 组件的样式 */
.van-empty {
  margin-top: 40px;
}

.van-empty__image {
  width: 240px;
}
</style>

<style lang="scss" scoped>
/* 如果需要，可以在这里添加额外的 SCSS 样式 */
</style>
