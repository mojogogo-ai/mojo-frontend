<template>
  <div class=" bot-manage-item">
    <div class="bmi-content">
      <div class="bmic-left">
        <div class="cursor-pointer hover:opacity-75 bmicl-avatar" @click="detailCoin(bot)">
          <el-image
            class="bmicl-avatar-img"
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
          <div class="bmicli-author">
            <span class="bmicli-author-name">{{ bot.symbol }}</span>
          </div>
          <div class="bmicl-toolbar">
            <div v-if="bot?.twitter" class="cursor-pointer hover:opacity-75 h-[30px] px-2 py-0.5 mr-2 mb-2 bg-[#e1ff01] rounded-[27px] justify-start items-center gap-1 inline-flex" @click="goLink(bot, 'Twitter')">
              <svg-icon name="prime_twitter" class="text-xl text-[#000]" />
              <div class="text-black text-sm font-medium font-['Inter'] leading-relaxed">Twitter</div>
            </div>
            <div v-if="bot?.telegram"  class="cursor-pointer hover:opacity-75 h-[30px] px-2 py-0.5 mr-2 mb-2 bg-[#e1ff01] rounded-[27px] justify-start items-center gap-1 inline-flex" @click="goLink(bot, 'Telegram')">
              <svg-icon name="telegram-fill" class="text-xl text-[#000]" />
              <div class="text-black text-sm font-medium font-['Inter'] leading-relaxed">Telegram</div>
            </div>
            <div v-if="bot?.website" class="cursor-pointer hover:opacity-75 h-[30px] px-2 py-0.5 mr-2 mb-2 bg-[#e1ff01] rounded-[27px] justify-start items-center gap-1 inline-flex" @click="goLink(bot, 'Web')">
              <svg-icon name="web-fill" class="text-xl text-[#000]" />
              <div class="text-black text-sm font-medium font-['Inter'] leading-relaxed">Website</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import IconTelegram from '@/assets/images/bots/publish/telegram.svg';
// import IconDiscord from '@/assets/images/bots/publish/discord.svg';
// import IconLine from '@/assets/images/bots/publish/line.svg';
// import IconMessenger from '@/assets/images/bots/publish/messenger.svg';
// import IconSlack from '@/assets/images/bots/publish/slack.svg';
// import IconInstagram from '@/assets/images/bots/publish/instagram.svg';
// import IconReddit from '@/assets/images/bots/publish/reddit.svg';

defineProps({
  bot: {
    type: Object,
    required: true
  }
});

const goLink = (bot, platform) => {
  let url = ''
  if(platform === 'Twitter') {
    url = bot.twitter
    if (url.startsWith('t.me')) {
      url =  'https://' + url
    }
  } else if(platform === 'Telegram') {
    url = bot.telegram
  } else if(platform === 'Web') {
    url = bot.website
  }
  if (url) {
    window.open(url, '_blank');
  }
};
const detailCoin = (bot) => {
  if (bot.token_mint) {
    let url = `https://explorer.solana.com/address/${bot.token_mint}?cluster=devnet`;
    window.open(url, '_blank')
  }
};
</script>

<style lang="scss" scoped>
.bot-manage-item{
  width: 413px;
  height: 190px;
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
          height: 27px;
          .bmiclt-btn{
            width: 73px;
            height: 27px;
            display: flex;
            padding: 4px 8px;
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
}
</style>
