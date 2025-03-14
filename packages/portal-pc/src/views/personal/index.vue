<template>
  <div class="bot-management">
    <div class="bot-management-title">
      {{t('personal.title')}}
    </div>
    <div
      class="bot-management-content"
      element-loading-background="transparent"
      :element-loading-text="t('common.loading')"
    >
      <div
        v-if="botList.length"
        v-infinite-scroll="_getMyBotList"
        class="h-full"
        :infinite-scroll-disabled="!isLoadMore || isLoading"
        :infinite-scroll-distance="20"
      >
        <div class="flex flex-wrap gap-5 pt-3">
          <list-item
            v-for="(bot, index) in botList"
            :key="index"
            :bot="bot"
            @edit="editBot(bot)"
            @chat="onChat($event, bot)"
            @delete="_getMyBotList"
            @refresh-list="_getMyBotList"
          />
        </div>
      </div>
      <!-- 空内容展示 -->
      <template v-if="!botList.length && !isLoading">
        <el-empty
          v-if="form.search || form.published !== ''"
          :image="emptyRobotImageUrl"
        >
          <template #description>
            <div class="font-black no-content-psl">{{ t('common.noContent') }}</div>
          </template>
        </el-empty>
        <el-empty
          v-else
          :image="emptyRobotImageUrl"
        >
          <template #description>
            <div class="font-black no-content-psl">{{ t('common.noContent') }}</div>
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
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { t } from '@gptx/base/i18n';
import emptyRobotImageUrl from '@/assets/images/smart-people.svg';
import { getMyBotList } from '@gptx/base/api/application';
import ListItem from './components/list/ListItem.vue';
import { eventBus } from '@gptx/base/utils/eventBus.js';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

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

// 监听代币发布成功事件，刷新列表
eventBus.on('botCoinLaunched', () => {
  resetList();
  
  // 使用Matomo跟踪页面刷新事件（如果已集成）
  if (window.$matomo) {
    window.$matomo.trackEvent('用户中心', '用户行为', '代币发布后刷新列表');
  }
  
  // 显示成功提示
  ElMessage({
    message: t('personal.coinLaunchSuccess') || 'Coin launched successfully!',
    type: 'success',
    duration: 3000
  });
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
  window.open(url, '_blank');
};

onMounted(() => {
  _getMyBotList();

  // 如果是从代币发布页面跳转过来的，检查URL参数
  const query = router.currentRoute.value.query;
  if (query.refresh === 'true') {
    resetList();
  }
});

// 组件销毁时移除事件监听，防止内存泄漏
onBeforeUnmount(() => {
  eventBus.off('botCoinLaunched');
});
</script>

<style scoped>
.bot-management-content {
  position: relative;
  height: 800px; /* 根据需要调整高度 */
  overflow: auto;
}

.el-scrollbar__wrap {
  height: 100%;
}

.loading-more {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}
</style>


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
  margin-bottom: 40px;
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
