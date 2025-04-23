<template>
  <div class="cursor-pointer bot-manage-item" @click="goPage(bot)">
    <div class="bmi-content">
      <div class="bmic-left">
        <div class="bmicl-avatar">
          <el-image
            class="cursor-pointer bmicl-avatar-img"
            width="80px"
            height="80px"
            fit="cover"
            :src="bot.icon"
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
        <div class="bmicl-info">
          <div class="bmicli-title">
            {{ bot.name }}
          </div>
          <div class="bmicl-toolbar">
            <!-- <div v-show="bot.public == '1'" class="bmiclt-btn">
              Published
            </div> -->

            <!-- <div v-if="bot.bot_type===1&&bot.meme_state === 3" class="p-2 bmiclt-btn" @click.stop="detailCoin(bot)">
              <el-avatar
                size="small"
                :src="bot.meme_icon"
              />
              <span class="ml-2"> {{ bot.meme_symbol }}</span>
            </div> -->
            <div v-if="bot.bot_type===1&&bot.meme_state !== 3" class="bmiclt-btn" :style="{backgroundColor: bot.meme_state === 3 ? 'rgba(17, 198, 65, 0.80)': '#db5f00'}">
              {{ MemeStatusText[bot.meme_state] }}
            </div>
            <div v-if="bot.bot_type===1&&bot.meme_state === 3" class="p-2  coin-continer" @click.stop="detailCoin(bot)">
              <el-avatar
                class="coin-logo"
                size="small"
                :src="coinImageUrl"
              />
              <span class="ml-2 meme-symbol"> {{ bot.meme_symbol }}</span>
            </div>
          </div>
          <div class="bmicli-author">
            <el-image
              class="bmicli-author-avatar"
              width="20px"
              height="20px"
              fit="cover"
              :src="user.avatar"
            />
            <span class="bmicli-author-name">@{{ user.nickname }}</span>
          </div>
          <div class="bmicli-desc" :title="bot.introduction">
            {{ bot.introduction }}
          </div>

        </div>
      </div>
      <div class="bmic-right">
        <svg-icon
          name="arrow-upper-right" class="arrow-upper-right-icon" />
      </div>
    </div>
    <div class="bmi-bottom">
      <div class="cursor-pointer bmi-share-bar">
        <div v-if="bot?.telegram_address" class="bmi-s-b-item" @click.stop="goLink(bot, 'telegram')">
          <svg-icon
            name="telegram-icon"
            class="telegram-icon"
          />
        </div>
        <div v-else class="no-icon"></div>
      </div>
      <div class="more-option-trigger" @click.stop="()=>{}">
        <el-button
          v-if="bot.bot_type===1 && bot.meme_state !== 3"
          class="mr-5"
          type="primary"
          @click.stop="lanchedMemeCoin(bot)"
        >
          {{ MemeStatus[bot.meme_state] }}
        </el-button>
        <el-dropdown popper-class="bot-manage-dropdown">
          <div class="flex items-center justify-center rounded-[10px] w-11 h-11 bg-white/10 hover:opacity-75">
            <el-icon color="#FFFFFF" class="rotate-90" size="14">
              <MoreFilled />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-item
              class="is-delete"
              @click.stop="onDelete(bot.id)"
            >
              {{ t('bots.delete') }}
            </el-dropdown-item>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
  <StartLaunch
    ref="startLaunchRef"
    width="600px"
  />
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { botDelete } from '@gptx/base/api/application';
import { memeCheck } from '@gptx/base/api/meme-bot';
import coinImageUrl from '@/assets/images/coin.png';
const router = useRouter();

// import IconTelegram from '@/assets/images/bots/publish/telegram.svg';
// import IconDiscord from '@/assets/images/bots/publish/discord.svg';
// import IconLine from '@/assets/images/bots/publish/line.svg';
// import IconMessenger from '@/assets/images/bots/publish/messenger.svg';
// import IconSlack from '@/assets/images/bots/publish/slack.svg';
// import IconInstagram from '@/assets/images/bots/publish/instagram.svg';
// import IconReddit from '@/assets/images/bots/publish/reddit.svg';

import StartLaunch from '@/components/StartLaunch/index.vue';

import { ElMessageBox } from 'element-plus';
import useUserStore from '@/store/modules/user.js';
import { eventBus } from '@gptx/base/utils/eventBus.js';
import { useRouter } from 'vue-router';

defineProps({
  bot: {
    type: Object,
    required: true
  }
});
// const publishDialogRef = ref(null);
const emit = defineEmits(['chat', 'delete', 'refresh-list', 'edit']);

const goLink = (bot, platform) => {
  let url
  if(platform === 'telegram') {
    let telegram_address = bot.telegram_address;
    if (telegram_address.startsWith('t.me')) {
      telegram_address =  'https://' + telegram_address
    }
    url = telegram_address
  } else if(platform === 'discord') {
    url = bot.discord_address
  }
  if(!url) {
    ElMessageBox.alert('Please configure the platform address first', 'Tips', {
      confirmButtonText: 'OK',
      type: 'warning'
    });
    return
  }
  emit('chat', { url });
};

// dropdown command delete
const onDelete = async (id) => {
  try {
    const content =  t('bots.deleteDescCn');
    await ElMessageBox.confirm(content, t('bots.delete'), {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning',
      customClass: 'customize-message-box'
    });
    const { code } = await botDelete({ id });
    if (code === 200) emit('delete');
    eventBus.emit('createBotSuccess');
  } catch (error) {
    console.log(error);
  }
};
// dropdown command unpublish
// const onUnpublish = async (id) => {
//   try {
//     const { href } = router.resolve({ path: `/publish/${id}` });
//     await ElMessageBox.confirm(
//       `${t(
//         'bots.unpublishDesc'
//       )}<a class="text-[var(--el-color-primary)] hover:text-[var(--el-color-primary-light-3)]" href="${href}" >${t(
//         'bots.toPublish'
//       )}</a>`,
//       t('bots.unpublish'),
//       {
//         confirmButtonText: t('common.confirm'),
//         cancelButtonText: t('common.cancel'),
//         type: 'warning',
//         dangerouslyUseHTMLString: true,
//         customClass: 'customize-message-box'
//       }
//     );
//     const { code } = await removePublishApp({ app_id: id });
//     if (code === 200) emit('refresh-list');
//   } catch (error) {
//     console.log(error);
//   }
// };
const user = useUserStore();
const toPublish = async ({ id }) => {
  eventBus.emit('publishBot', { id });
};

const startLaunchRef = ref(null);
const MemeStatus = {
  // 1: 'Pending',
  // 2: 'Launch',
  // 3: 'Coin Launched'
  1: 'Launch',
  2: 'Launch',
  3: 'Coin Launched'
};
const MemeStatusText = {
  1: 'Launch pending',
  2: 'Launching',
  3: 'Coin Launched'
};

const lanchedMemeCoin = async (bot) => {
  const result = await memeCheck({ bot_id: bot.id });
  if (result.code === 200) { // 对话创建完成meme coin

   const meme_state = result.data.state

    if (meme_state === 1) { // TO create meme coin
        goLink(bot, 'telegram')
      } else if (meme_state === 2) { // lanching
        startLaunchRef.value.open({ ...result.data, bot_id: bot.id });
        // startLaunchRef.value.open({ // test
        //   "name": "Dem0 Token" + new Date().getTime(),
        //   "symbol": "Dem0" + new Date().getTime(),
        //   "image": "https://s1.locimg.com/2024/12/11/3964164cf2a43.png",
        //   bot_id: bot.id
        // });
      } else {
        //
      }
  }


};

const detailCoin = (item) => {
  if (item.meme_token_mint) {
    let url = `https://pump.fun/coin/${item.meme_token_mint}`;
    window.open(url, '_blank')
  }
};
const goPage = (bot) => {
  // if (bot.meme_state === 3) {
    router.push({ path: '/memebotDetail', query: { id: bot.id , nickName: bot.create_nick_name, memeState: bot.meme_state } });
  // } else {
  //   router.push({ path: '/memebot', query: { id: bot.id } });
  // }
}

</script>

<style lang="scss" scoped>
.bot-manage-item{
  width: 412px;
  // height: 222px;
  flex-shrink: 0;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(25px);
  padding: 22px 22px 20px;
  .bmi-content{
    display: flex;
    justify-content: space-between;
    .bmic-left{
      display: flex;
      gap: 16px;
      .bmicl-avatar{
        :deep(.el-image){
          width: 80px;
          height: 80px;
          border-radius: 10px;
        }
      }
      .bmicl-info{
        display: flex;
        flex-direction: column;
        gap: 8px;
        //align-items: center;
        justify-content: center;
        .bmicli-title{
          color: var(--Style, #E1FF01);
          font-feature-settings: 'dlig' on;
          font-family: Inter;
          font-size: 20px;
          font-style: normal;
          font-weight: 700;
          line-height: 23px; /* 115% */
          width: 215px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .bmicli-author{
          display: flex;
          gap: 12px;
          align-items: center;
          .bmicli-author-avatar{
            width: 20px;
            height: 20px;
            border-radius: 50%;
          }
          .bmicli-author-name{
            color: rgba(255, 255, 255, 0.70);
            font-feature-settings: 'dlig' on;
            font-family: Inter;
            font-size: 13px;
            font-style: normal;
            font-weight: 500;
            line-height: 19px; /* 146.154% */
          }
        }
        .bmicli-desc{
          color: rgba(255, 255, 255, 0.70);
          font-feature-settings: 'dlig' on;
          font-family: Inter;
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: 19px; /* 135.714% */
          width: 203px;
          height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;

        }
        .bmicl-toolbar{
          display: flex;
          height: 27px;
          .bmiclt-btn{
            // width: 73px;
            // height: 27px;
            display: flex;
            padding: 4px 8px;
            margin-right: 5px;
            justify-content: center;
            align-items: center;
            border-radius: 8px;
            background: rgba(17, 198, 65, 0.80);
            color: #FFF;
            font-feature-settings: 'dlig' on;
            font-family: Inter;
            font-size: 12px;
            font-style: normal;
            font-weight: 500;
            line-height: 19px; /* 158.333% */
          }
        }
      }
    }
  }
  .bmi-bottom{
    display: flex;
    margin-top: 50px;
    justify-content: space-between;
    .bmi-share-bar{
      display: flex;
      gap: 13px;
      .bmi-s-b-item{
        width: 25px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.07);
        backdrop-filter: blur(25px);
        svg{
          width: 25px;
          height: 24px;
        }
      }
      .no-icon{
        width: 25px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
      }
    }
    position: relative;
    .more-option-trigger{
      position: absolute;
      // opacity: 0.8;
      bottom: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}


</style>
<style lang="scss">
.bot-manage-dropdown{
  .el-dropdown__popper.el-popper{
    border-radius: 8px;
    //overflow: hidden;
    --el-bg-color-overlay:rgba(255, 255, 255, 0.10);
  }
  .el-dropdown-menu__item:not(.is-disabled):hover.is-delete{
    background-color: var(--el-color-info-light-4)!important;
  }
  .el-dropdown-menu__item {
    color: var(--el-text-color-primary);

    &.is-delete {
      color: var(--el-color-danger);
    }

    &:not(.is-disabled) {
      &:hover,
      &:focus {
        color: var(--el-text-color-primary);
        background-color: var(--el-text-color-placeholder);

        &.is-delete {
          color: var(--el-color-danger);
          background-color: var(--el-color-danger-light-9);
        }
      }
    }
  }
 .el-dropdown-menu__item {
    color: #000000;

    &.is-delete {
      color: var(--el-color-danger);
    }

    &:not(.is-disabled) {
      &:hover,
      &:focus {
        color: #000000;
        background-color: var(--el-text-color-placeholder);

        &.is-delete {
          color: var(--el-color-danger);
          background-color: var(--el-color-danger-light-9);
        }
      }
    }
  }
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
.coin-logo{
  --el-avatar-size: 20px;
  background-color: transparent;
}
.coin-continer{
  padding-left: 0px;
  padding-top: 0px;
  display: flex;
}
.arrow-upper-right-icon{
  font-size: 20px;
  color: #E1FF01;
}
.telegram-icon{
  font-size: 24px;
}
</style>
