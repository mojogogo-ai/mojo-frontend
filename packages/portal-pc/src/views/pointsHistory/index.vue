<template>
  <div class="ph-page-wrap">
    <div class="ph-page-box">
      <div class="ppb-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="33" height="32" viewBox="0 0 33 32" fill="none">
          <path d="M16.4491 22.667L18.5291 18.107L23.1157 16.0003L18.5291 13.9203L16.4491 9.33366L14.3557 13.9203L9.7824 16.0003L14.3557 18.107L16.4491 22.667ZM11.3424 3.68033C12.9625 3.01359 14.6971 2.66938 16.4491 2.66699C18.1957 2.66699 19.9291 3.01366 21.5557 3.68033C23.1691 4.34699 24.6357 5.33366 25.8757 6.57366C27.1157 7.81366 28.1024 9.28033 28.7691 10.8937C29.4357 12.5203 29.7824 14.2537 29.7824 16.0003C29.7824 19.5337 28.3824 22.9337 25.8757 25.427C24.6392 26.667 23.1699 27.6504 21.5522 28.3208C19.9345 28.9913 18.2002 29.3355 16.4491 29.3337C14.6971 29.3313 12.9625 28.9871 11.3424 28.3203C9.72648 27.6487 8.25858 26.6656 7.0224 25.427C5.78242 24.1905 4.79897 22.7212 4.12854 21.1034C3.45812 19.4857 3.11392 17.7515 3.11573 16.0003C3.11573 12.467 4.51573 9.06699 7.0224 6.57366C8.2624 5.33366 9.72906 4.34699 11.3424 3.68033ZM8.9024 23.547C10.9024 25.547 13.6224 26.667 16.4491 26.667C19.2757 26.667 21.9957 25.547 23.9957 23.547C25.9957 21.547 27.1157 18.827 27.1157 16.0003C27.1157 13.1737 25.9957 10.4537 23.9957 8.45366C23.0044 7.46343 21.8277 6.67821 20.5328 6.14287C19.2379 5.60753 17.8502 5.33256 16.4491 5.33366C13.6224 5.33366 10.9024 6.45366 8.9024 8.45366C7.91216 9.44499 7.12695 10.6217 6.59161 11.9166C6.05627 13.2115 5.78129 14.5991 5.7824 16.0003C5.7824 18.827 6.9024 21.547 8.9024 23.547Z" fill="black" />
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
      <div class="ppb-more">
        <div class="ppb-more-text" @click="goMorePoints">
          How to earn more
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M10.4486 16.4587C14.0154 16.4587 16.9069 13.5672 16.9069 10.0003C16.9069 6.43349 14.0154 3.54199 10.4486 3.54199C6.88173 3.54199 3.99023 6.43349 3.99023 10.0003C3.99023 13.5672 6.88173 16.4587 10.4486 16.4587ZM10.8967 13.4029C10.7455 13.5541 10.5671 13.6297 10.3614 13.6297C10.1557 13.6297 9.9773 13.5541 9.82608 13.4029C9.67486 13.2516 9.59925 13.0732 9.59925 12.8675C9.59925 12.6619 9.67486 12.4834 9.82608 12.3322C9.9773 12.181 10.1557 12.1054 10.3614 12.1054C10.5671 12.1054 10.7455 12.181 10.8967 12.3322C11.0479 12.4834 11.1236 12.6619 11.1236 12.8675C11.1236 13.0732 11.0479 13.2516 10.8967 13.4029ZM10.7697 11.2162C10.6548 11.3251 10.5247 11.3795 10.3795 11.3795C10.2223 11.3795 10.0922 11.3251 9.9894 11.2162C9.88657 11.1073 9.83515 10.9742 9.83515 10.817C9.83515 10.696 9.84725 10.575 9.87144 10.454C9.89564 10.3331 9.93798 10.2242 9.99847 10.1274C10.0953 9.97014 10.2102 9.828 10.3433 9.70097C10.4763 9.57395 10.6094 9.4439 10.7425 9.31082C10.8997 9.16565 11.0419 9.00536 11.1689 8.82994C11.2959 8.65452 11.3595 8.46399 11.3595 8.25833C11.3595 8.01637 11.2596 7.81676 11.06 7.65949C10.8604 7.50222 10.6275 7.42359 10.3614 7.42359C10.192 7.42359 10.0378 7.45686 9.89866 7.52339C9.75954 7.58993 9.63554 7.68974 9.52666 7.82281C9.42988 7.93169 9.31495 8.0194 9.18188 8.08594C9.0488 8.15247 8.91573 8.1555 8.78266 8.09501C8.63748 8.03452 8.53768 7.93774 8.48324 7.80466C8.4288 7.67159 8.43787 7.53852 8.51046 7.40544C8.70402 7.07881 8.96412 6.82476 9.29076 6.64329C9.61739 6.46183 9.97427 6.37109 10.3614 6.37109C10.9179 6.37109 11.4048 6.54349 11.8222 6.88827C12.2396 7.23305 12.4482 7.67764 12.4482 8.22203C12.4482 8.52447 12.3726 8.80272 12.2214 9.05677C12.0702 9.31082 11.8918 9.54068 11.6861 9.74634C11.5893 9.84312 11.4895 9.9399 11.3867 10.0367C11.2838 10.1335 11.1901 10.2423 11.1054 10.3633C11.057 10.4359 11.0207 10.5115 10.9965 10.5901C10.9723 10.6688 10.9542 10.7504 10.9421 10.8351C10.9421 10.9803 10.8846 11.1073 10.7697 11.2162Z" fill="black" />
        </svg>
      </div>
    </div>
    <div class="ph-page">
      <div class="ph-page-top">
        <!-- 头部内容 -->
        Earned History
      </div>
      <div
        v-infinite-scroll="getStoreList"
        :infinite-scroll-immediate="true"
        class="infinite-list"
        :infinite-scroll-disabled="!isLoadMore || isLoading"
        :infinite-scroll-distance="10"
        style="overflow: auto; height: 1150px;"
      >
        <div v-loading="isLoading" element-loading-background="transparent" :element-loading-text="t('common.loading')">
          <div v-if="__data.storeList.length && !isLoading" class="w-[753px]">
            <list-item
              v-for="appInfo in __data.storeList"
              :key="appInfo.id"
              :app-info="appInfo"
              @open-with="onDropDownClick($event, appInfo)"
              @open-dig="onDigClick()"
              @open-new-chat="onOpenNewChat(appInfo)"
            />
          </div>
          <template v-if="!__data.storeList.length && !isLoading">
            <el-empty :image="emptyRobotImageUrl">
              <template #description>
                <div class="text-[16px] font-black">{{ t('bots.not_found') }}</div>
              </template>
            </el-empty>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { getPointLogList } from '@gptx/base/api/user.js';
import { ListItem } from './components/store/index.js';
import emptyRobotImageUrl from '@/assets/images/empty-robot.png';
import useUserStore from '@/store/modules/user.js';

const router = useRouter();
const __data = reactive({
  storeList: []
});
let totalSize = ref(0);
let isLoadMore = ref(true);
let pageNum = ref(1);
const pageSize = 10;
const isLoading = ref(false);

const user = useUserStore();

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
  console.log('getStoreList1');

  if (!isLoadMore.value || isLoading.value) return; // 如果已加载完或正在加载中则退出
  isLoading.value = true;
  console.log('getStoreList2');
  try {
    const { code, data } = await getPointLogList({
      page_num: pageNum.value,
      page_size: pageSize
    });
    console.log(code, data)
    // return
    // const {list, page} = data
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
});
</script>

<style>
.infinite-list {
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>


<style lang="scss" scoped>
.ph-page-wrap{
  margin-top: 116px;
  padding-bottom: 157px;
  display: flex;
  gap: 20px;
  .ph-page-box{
    width: 305px;
    height: 265px;
    flex-shrink: 0;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.10);
    background: var(--Style, #E1FF01);
    backdrop-filter: blur(50px);
    display: flex;
    flex-direction: column;
    align-items: center;
    //justify-content: center;
    padding-top: 40px;
    .ppb-title{
      display: inline-flex;
      align-items: center;
      margin-bottom: 40px;
      gap: 8px;
      .ppb-title-text{
        color: #000;
        font-feature-settings: 'dlig' on;
        font-family: Inter;
        font-size: 22px;
        font-style: normal;
        font-weight: 700;
        line-height: 23px; /* 104.545% */
      }
    }
    .ppb-points{
      display: inline-flex;
      padding: 20px 32px;
      justify-content: center;
      align-items: center;
      gap: 10px;
      border-radius: 60px;
      background: #000;
      margin-bottom: 34px;
      .ppb-points-text{
        color: #FFF;
        text-align: right;
        font-feature-settings: 'dlig' on;
        font-family: Inter;
        font-size: 28px;
        font-style: normal;
        font-weight: 500;
        line-height: 19px; /* 67.857% */
        &:last-child{
          color: #FFF;
          text-align: center;
          font-feature-settings: 'dlig' on;
          font-family: Inter;
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: 19px; /* 135.714% */
        }
      }
    }
    .ppb-more{
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      .ppb-more-text{
        color: #000;
        text-align: center;
        font-feature-settings: 'dlig' on;
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
      }
    }
  }
}
.ph-page {
  width: 955px;
  min-height: 20vh;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(50px);
  overflow: hidden;
  padding: 0 100px;
  .ph-page-top{
    color: rgba(255, 255, 255, 0.70);
    text-align: center;
    font-feature-settings: 'dlig' on;
    font-family: Inter;
    font-size: 28px;
    font-style: normal;
    font-weight: 600;
    line-height: 23px; /* 82.143% */
    padding-top: 72px;
    padding-bottom: 72px;
  }
}

.app-page-content {
  overflow: hidden;
  //min-height: 50vh;
}
</style>
