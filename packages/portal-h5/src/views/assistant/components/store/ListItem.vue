<template>
  <div class="page-list">
    <van-cell class="page-list__inner">
      <div class="flex">
        <div class="app-page-col">
          <van-image
            class="page-list-img"
            fit="cover"
            :src="appInfo.icon || defaultBotImage"
            radius="10"
          >
            <template #error>
              <div class="page-list-img__error">
                <van-icon name="photo" />
              </div>
            </template>
          </van-image>
        </div>
        <div class="flex-1 app-page-col">
          <div class="flex items-center">
            <div
              class="line-clamp-1 flex-1 text-base text-[var(--van-blue)]"
              :title="appInfo.name"
            >
              {{ appInfo.name }}
            </div>
            <van-button
              v-if="platList && platList.length"
              link
              @click="showMoreAction = true"
            >
              <van-icon
                class="text-placeholder hover:text-[var(--h5-color-primary)]"
                name="weapp-nav"
              />
            </van-button>
          </div>
          <div class="p-2  coin-continer" @click.stop="detailCoin(appInfo)">
            <el-avatar
              class="coin-logo"
              size="small"
              :src="coinImageUrl"
            />
            <span class="ml-2 meme-symbol"> {{ appInfo.symbol }}</span>
          </div>
          <div class="mt-2">
            <van-image
              class="align-middle"
              width="16px"
              height="16px"
              round
              :src="appInfo.create_user_icon || defaultBotImage"
            />

            <span class="mx-1 text-xs text-[var(--el-text-color-placeholder)]">  {{ appInfo.create_user_name || '-' }} </span>

<!--            <span class="text-xs text-[var(&#45;&#45;el-text-color-placeholder)]"> @{{ appInfo.create_nick_name }} </span>-->
          </div>
          <div
            class="text-placeholder my-2 line-clamp-4 h-[100px]"
            :title="appInfo.introduction"
          >
            {{ appInfo.introduction }}
          </div>
          <!-- <div v-if="appInfo.app_categories && appInfo.app_categories.length">
            <van-tag
              v-for="{ name } in appInfo.app_categories"
              class="my-2 mr-1"
              size="large"
            >
              {{ t(name) }}
            </van-tag>
          </div> -->
        </div>
        <div  @click="goPage(appInfo.id)">
          <svg-icon
            name="arrow-upper-right" class="arrow-upper-right-icon" />
        </div>
      </div>
      <div class="flex justify-between page-list-option">
        <div class="flex items-center gap-5">
          <!--          <div class="flex text-[14px]  items-center gap-1">-->
          <!--            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">-->
          <!--              <path d="M12 3C13.1935 3 14.3381 3.47411 15.182 4.31802C16.0259 5.16193 16.5 6.30653 16.5 7.5C16.5 8.69347 16.0259 9.83807 15.182 10.682C14.3381 11.5259 13.1935 12 12 12C10.8065 12 9.66193 11.5259 8.81802 10.682C7.97411 9.83807 7.5 8.69347 7.5 7.5C7.5 6.30653 7.97411 5.16193 8.81802 4.31802C9.66193 3.47411 10.8065 3 12 3ZM12 21C12 21 21 21 21 18.75C21 16.05 16.6125 13.125 12 13.125C7.3875 13.125 3 16.05 3 18.75C3 21 12 21 12 21Z" fill="white" fill-opacity="0.7" />-->
          <!--            </svg>-->
          <!--            9-->
          <!--          </div>-->
          <!--          <div class="flex text-[14px]  items-center gap-1">-->
          <!--            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">-->
          <!--              <path fill-rule="evenodd" clip-rule="evenodd" d="M3.95556 4.90722C3.34373 5.51906 3 6.34889 3 7.21416V14.1892C3 15.0544 3.34373 15.8843 3.95556 16.4961C4.5674 17.1079 5.39723 17.4517 6.2625 17.4517H6.6V20.0707C6.6 20.8915 7.5261 21.3712 8.19615 20.8978L13.0786 17.4517H17.7375C18.6028 17.4517 19.4326 17.1079 20.0444 16.4961C20.6563 15.8843 21 15.0544 21 14.1892V7.21416C21 6.34889 20.6563 5.51906 20.0444 4.90722C19.4326 4.29539 18.6028 3.95166 17.7375 3.95166H6.2625C5.39723 3.95166 4.5674 4.29539 3.95556 4.90722ZM8 11.9999C8.55229 11.9999 9 11.5522 9 10.9999C9 10.4476 8.55229 9.99988 8 9.99988C7.44772 9.99988 7 10.4476 7 10.9999C7 11.5522 7.44772 11.9999 8 11.9999ZM12 11.9999C12.5523 11.9999 13 11.5522 13 10.9999C13 10.4476 12.5523 9.99988 12 9.99988C11.4477 9.99988 11 10.4476 11 10.9999C11 11.5522 11.4477 11.9999 12 11.9999ZM17 10.9999C17 11.5522 16.5523 11.9999 16 11.9999C15.4477 11.9999 15 11.5522 15 10.9999C15 10.4476 15.4477 9.99988 16 9.99988C16.5523 9.99988 17 10.4476 17 10.9999Z" fill="white" fill-opacity="0.7" />-->
          <!--            </svg>-->
          <!--            77-->
          <!--          </div>-->
          <!--          <div class="flex text-[14px]  items-center gap-1">-->
          <!--            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">-->
          <!--              <path d="M9.72245 6.72634C10.736 4.90878 11.2424 4 12 4C12.7576 4 13.264 4.90878 14.2775 6.72634L14.5399 7.19672C14.8279 7.71351 14.9719 7.97191 15.1959 8.1423C15.4199 8.3127 15.6999 8.3759 16.2599 8.50229L16.7687 8.61749C18.7366 9.06308 19.7198 9.28548 19.9542 10.0383C20.1878 10.7902 19.5174 11.575 18.1759 13.1438L17.8287 13.5494C17.4479 13.995 17.2567 14.2182 17.1711 14.4934C17.0855 14.7693 17.1143 15.0669 17.1719 15.6613L17.2247 16.2029C17.4271 18.2965 17.5287 19.3428 16.9159 19.8076C16.3031 20.2724 15.3815 19.8484 13.54 19.0004L13.0624 18.7813C12.5392 18.5397 12.2776 18.4197 12 18.4197C11.7224 18.4197 11.4608 18.5397 10.9376 18.7813L10.4608 19.0004C8.61848 19.8484 7.6969 20.2724 7.08492 19.8084C6.47133 19.3428 6.57293 18.2965 6.77532 16.2029L6.82812 15.6621C6.88572 15.0669 6.91452 14.7693 6.82812 14.4942C6.74332 14.2182 6.55213 13.995 6.17134 13.5502L5.82415 13.1438C4.48258 11.5758 3.81219 10.791 4.04579 10.0383C4.27938 9.28548 5.26416 9.06228 7.23211 8.61749L7.7409 8.50229C8.30009 8.3759 8.57928 8.3127 8.80408 8.1423C9.02887 7.97191 9.17207 7.71351 9.46006 7.19672L9.72245 6.72634Z" fill="white" fill-opacity="0.7" />-->
          <!--            </svg>-->
          <!--            7.8K-->
          <!--          </div>-->
        </div>
        <div class="flex items-center">
          <!-- 大漂亮独有 -->
          <svg-icon
            v-if="appInfo.id===1"
            name="chat"
            class="text-[#409eff] mr-3"
            size="20"
            @click="openDig()"
          />
          <!-- <svg-icon
            name="discord"
            class="text-[#409eff] mr-3"
            size="20"
            @click="openDs(appInfo)"
          /> -->
          <svg-icon
            v-if="appInfo.telegram_address"
            name="telegram"
            class="text-[#409eff] mr-3"
            size="20"
            @click="openTg(appInfo)"
          />
        </div>
      </div>
    </van-cell>
  </div>
</template>

<script setup>
import defaultBotImage from '@/assets/logo/bot-default-logo.svg';
import coinImageUrl from '@/assets/images/coin.png';
import ListItem from '@/views/personal/components/list/ListItem.vue';
import { useRouter } from 'vue-router';

// import IconTelegram from '@/assets/images/bots/publish/telegram.svg';
// import IconDiscord from '@/assets/images/bots/publish/discord.svg';
// import IconLine from '@/assets/images/bots/publish/line.svg';
// import IconMessenger from '@/assets/images/bots/publish/messenger.svg';
// import IconSlack from '@/assets/images/bots/publish/slack.svg';
// import IconInstagram from '@/assets/images/bots/publish/instagram.svg';
// import IconReddit from '@/assets/images/bots/publish/reddit.svg';

const props = defineProps({
  appInfo: {
    type: Object,
    default: () => ({})
  }
});
const router = useRouter();

let platList = reactive([]);

const showMoreAction = ref(false);
const openTg = ()=>{
  const cleanUrl = props?.appInfo?.telegram_address.replace(/^"|"$/g, '');
  window.open(cleanUrl, '_blank');
}
const openDs = ()=>{
  const cleanUrl = props?.appInfo?.discord_address.replace(/^"|"$/g, '');
  window.open(cleanUrl, '_blank');
}
const openDig = () => {
  window.open('https://virtual-human.mojogogo.ai/', '_blank');
};

const detailCoin = (item) => {
  if (item.meme_token_mint) {
    let url = `https://pump.fun/coin/${item.meme_token_mint}`;
    window.open(url, '_blank')
  }
};
const goPage = (id) => {
  router.push({ path: '/memebotDetail', query: { id: id } });
}
</script>

<style lang="scss" scoped>
.h-\[38px\] {
  height: 38px;
}

.line-clamp-4 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.h-\[100px\] {
  height: 100px;
}

.text-\[var\(--van-blue\)\] {
  color: var(--van-blue);
}
.meme-symbol{
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
  line-height: 23px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  color: #E1FF01;
}
.meme-symbol:hover {
  cursor: pointer;
}
.coin-logo{
  --el-avatar-size: 20px;
  background-color: transparent;
}
.coin-continer{
  padding-left: 0px;
  padding-top: 0px;
  display: flex;
}
.coin-continer:hover {
  cursor: pointer;
}
.arrow-upper-right-icon{
  font-size: 20px;
  color: #E1FF01;
}
</style>
