<template>
  <page-header />
  <div class="ph-page-wrap">
    <div class="ph-page-box">
      <div class="ppb-title">
        <!-- SVG 图标 -->
        <svg xmlns="http://www.w3.org/2000/svg" width="29" height="28" viewBox="0 0 29 28" fill="none">
          <path d="M14.5002 19.8335L16.3202 15.8435L20.3335 14.0002L16.3202 12.1802L14.5002 8.16683L12.6685 12.1802L8.66684 14.0002L12.6685 15.8435L14.5002 19.8335ZM10.0318 3.22016C11.4494 2.63677 12.9672 2.33559 14.5002 2.3335C16.0285 2.3335 17.5452 2.63683 18.9685 3.22016C20.3802 3.8035 21.6635 4.66683 22.7485 5.75183C23.8335 6.83683 24.6968 8.12016 25.2802 9.53183C25.8635 10.9552 26.1668 12.4718 26.1668 14.0002C26.1668 17.0918 24.9418 20.0668 22.7485 22.2485C21.6666 23.3335 20.3809 24.194 18.9654 24.7806C17.5499 25.3672 16.0324 25.6684 14.5002 25.6668C12.9672 25.6647 11.4494 25.3636 10.0318 24.7802C8.61791 24.1925 7.33349 23.3323 6.25184 22.2485C5.16686 21.1665 4.30634 19.8809 3.71972 18.4654C3.13309 17.0499 2.83192 15.5324 2.8335 14.0002C2.8335 10.9085 4.0585 7.9335 6.25184 5.75183C7.33684 4.66683 8.62017 3.8035 10.0318 3.22016ZM7.89684 20.6035C9.64684 22.3535 12.0268 23.3335 14.5002 23.3335C16.9735 23.3335 19.3535 22.3535 21.1035 20.6035C22.8535 18.8535 23.8335 16.4735 23.8335 14.0002C23.8335 11.5268 22.8535 9.14683 21.1035 7.39683C20.2361 6.53038 19.2065 5.84331 18.0734 5.37489C16.9404 4.90647 15.7262 4.66587 14.5002 4.66683C12.0268 4.66683 9.64684 5.64683 7.89684 7.39683C7.03038 8.26425 6.34332 9.29388 5.8749 10.4269C5.40647 11.5599 5.16587 12.7741 5.16684 14.0002C5.16684 16.4735 6.14684 18.8535 7.89684 20.6035Z" fill="black" />
        </svg>
        <div class="ppb-title-text">
          MojoGogo Points
        </div>
      </div>
      <div class="ppb-points">
        <div class="ppb-points-text">
          {{ user.points }}
        </div>
        <div class="ppb-points-text">
          pts
        </div>
      </div>
      <div class="ppb-more" @click="goMorePoints">
        <div class="ppb-more-text">
          How to earn more
        </div>
        <!-- SVG 图标 -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99984 16.4587C13.5667 16.4587 16.4582 13.5672 16.4582 10.0003C16.4582 6.43349 13.5667 3.54199 9.99984 3.54199C6.433 3.54199 3.5415 6.43349 3.5415 10.0003C3.5415 13.5672 6.433 16.4587 9.99984 16.4587ZM10.448 13.4029C10.2968 13.5541 10.1183 13.6297 9.91267 13.6297C9.70701 13.6297 9.52857 13.5541 9.37735 13.4029C9.22613 13.2516 9.15052 13.0732 9.15052 12.8675C9.15052 12.6619 9.22613 12.4834 9.37735 12.3322C9.52857 12.181 9.70701 12.1054 9.91267 12.1054C10.1183 12.1054 10.2968 12.181 10.448 12.3322C10.5992 12.4834 10.6748 12.6619 10.6748 12.8675C10.6748 13.0732 10.5992 13.2516 10.448 13.4029ZM10.321 11.2162C10.206 11.3251 10.076 11.3795 9.93081 11.3795C9.77355 11.3795 9.6435 11.3251 9.54067 11.2162C9.43784 11.1073 9.38642 10.9742 9.38642 10.817C9.38642 10.696 9.39852 10.575 9.42271 10.454C9.44691 10.3331 9.48925 10.2242 9.54974 10.1274C9.64652 9.97014 9.76145 9.828 9.89452 9.70097C10.0276 9.57395 10.1607 9.4439 10.2937 9.31082C10.451 9.16565 10.5932 9.00536 10.7202 8.82994C10.8472 8.65452 10.9107 8.46399 10.9107 8.25833C10.9107 8.01637 10.8109 7.81676 10.6113 7.65949C10.4117 7.50222 10.1788 7.42359 9.91267 7.42359C9.7433 7.42359 9.58906 7.45686 9.44993 7.52339C9.31081 7.58993 9.18681 7.68974 9.07793 7.82281C8.98115 7.93169 8.86622 8.0194 8.73315 8.08594C8.60007 8.15247 8.467 8.1555 8.33393 8.09501C8.18875 8.03452 8.08895 7.93774 8.03451 7.80466C7.98007 7.67159 7.98914 7.53852 8.06173 7.40544C8.25529 7.07881 8.51539 6.82476 8.84203 6.64329C9.16866 6.46183 9.52554 6.37109 9.91267 6.37109C10.4692 6.37109 10.9561 6.54349 11.3735 6.88827C11.7908 7.23305 11.9995 7.67764 11.9995 8.22203C11.9995 8.52447 11.9239 8.80272 11.7727 9.05677C11.6215 9.31082 11.443 9.54068 11.2374 9.74634C11.1406 9.84312 11.0408 9.9399 10.9379 10.0367C10.8351 10.1335 10.7414 10.2423 10.6567 10.3633C10.6083 10.4359 10.572 10.5115 10.5478 10.5901C10.5236 10.6688 10.5055 10.7504 10.4934 10.8351C10.4934 10.9803 10.4359 11.1073 10.321 11.2162Z" fill="black" />
        </svg>
      </div>
    </div>
    <div class="ph-page">
      <div class="ph-page-top">
        Earned History
      </div>
      <van-list
        v-model:loading="isLoading"
        :finished="!isLoadMore"
        finished-text="no more"
        style="height: calc(100vh - 400px); overflow-y: auto;border: none"
        @load="getStoreList"
      >
        <div v-if="__data.storeList.length" class="infinite-list">
          <PointsListItem
            v-for="appInfo in __data.storeList"
            :key="appInfo.id"
            :app-info="appInfo"
            @open-with="onDropDownClick"
            @open-dig="onDigClick"
            @open-new-chat="onOpenNewChat"
          />
        </div>

        <!-- 空内容展示 -->
        <template v-else-if="!isLoading">
          <van-empty :image="emptyRobotImageUrl">
            <template #description>
              <div class="text-[16px] font-black">{{ t('bots.not_found') }}</div>
            </template>
          </van-empty>
        </template>

        <!-- 加载中时显示加载指示器 -->
        <!--        <van-loading v-if="isLoading && !__data.storeList.length" text="加载中..." />-->
      </van-list>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { t } from '@gptx/base/i18n';
import { getPointLogList } from '@gptx/base/api/user.js';
import PointsListItem from './components/store/ListItem.vue';
import emptyRobotImageUrl from '@/assets/images/empty-robot.png';
import useUserStore from '@/store/modules/user.js';


const router = useRouter();
const user = useUserStore();

const __data = reactive({
  storeList: [],
});
let totalSize = ref(0);
let isLoadMore = ref(true);
let pageNum = ref(1);
const pageSize = 10;
const isLoading = ref(false);

const onDropDownClick = (plat, { address }) => {
  window.open(address, '_blank');
};

const onDigClick = () => {
  window.open('https://virtual-human.mojogogo.ai/', '_blank');
};

const onOpenNewChat = ({ app_id }) => {
  router.push(`/bot/${app_id}`);
};

const goMorePoints = () => {
  router.push('/tasks');
};

const getStoreList = async () => {

  if (!isLoadMore.value || isLoading.value) return; // 如果已加载完或正在加载中则退出
  isLoading.value = true;
  try {
    const { code, data } = await getPointLogList({
      page_num: pageNum.value,
      page_size: pageSize,
    });
    console.log(code, data);
    if (code === 200 && data.list) {
      __data.storeList.push(...data.list);
      totalSize.value = data.page.total;
      pageNum.value += 1;

      // 检查是否加载完所有数据
      if (__data.storeList.length >= totalSize.value) {
        isLoadMore.value = false;
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getStoreList();
});
</script>

<style scoped>
.ph-page-wrap {
  margin-top: 16px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ph-page-box {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  flex-shrink: 0;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: var(--Style, #e1ff01);
  backdrop-filter: blur(50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 24px;
  padding-bottom: 14px;
}

.ppb-title {
  display: inline-flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 8px;
}

.ppb-title-text {
  color: #000;
  font-feature-settings: 'dlig' on;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 23px; /* 115% */
}

.ppb-points {
  display: inline-flex;
  padding: 20px 32px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 60px;
  background: #000;
  margin-bottom: 12px;

}

.ppb-points-text {
  color: #FFF;
  text-align: right;
  font-feature-settings: 'dlig' on;
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 19px; /* 79.167% */
}

.ppb-points-text:last-child {
  color: #FFF;
  text-align: center;
  font-feature-settings: 'dlig' on;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 19px; /* 135.714% */
}

.ppb-more {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.ppb-more-text {
  color: #000;
  text-align: center;
  font-feature-settings: 'dlig' on;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 19px; /* 158.333% */
}

.ph-page {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(50px);
  padding: 0 20px;
}

.ph-page-top {
  color: rgba(255, 255, 255, 0.70);
  text-align: center;
  font-feature-settings: 'dlig' on;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 23px; /* 115% */
  padding-top: 40px;
  padding-bottom: 40px;
}

.infinite-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
}

.van-empty {
  margin-top: 40px;
}

.van-empty__image {
  width: 240px;
}
</style>
