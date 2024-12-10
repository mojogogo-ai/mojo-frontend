<template>
  <div class="cursor-pointer bot-manage-item">
    <div class="bmi-content">
      <div class="bmic-left">
        <div class="bmicl-avatar">
          <el-image
            class="cursor-pointer bmicl-avatar-img"
            width="80px"
            height="80px"
            fit="cover"
            :src="bot.icon || defaultBotImage"
            @click="toBotDetail"
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
          <div class="bmicl-toolbar">
            <div class="bmiclt-btn bb-publish">
              pending
            </div>
          </div>
        </div>
      </div>
      <div class="bmic-right">
        <!-- <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M18.7417 1.5H3.94877V0.5H19.9488H20.4488V1V17H19.4488V2.20711L2.30232 19.3536L1.59521 18.6464L18.7417 1.5Z" fill="#E1FF01" />
        </svg> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { botDelete, removePublishApp } from '@gptx/base/api/application';
import router from '@/router';
import defaultBotImage from '@/assets/logo/bot-default-logo.svg';
// import IconTelegram from '@/assets/images/bots/publish/telegram.svg';
// import IconDiscord from '@/assets/images/bots/publish/discord.svg';
// import IconLine from '@/assets/images/bots/publish/line.svg';
// import IconMessenger from '@/assets/images/bots/publish/messenger.svg';
// import IconSlack from '@/assets/images/bots/publish/slack.svg';
// import IconInstagram from '@/assets/images/bots/publish/instagram.svg';
// import IconReddit from '@/assets/images/bots/publish/reddit.svg';
import { ElMessageBox } from 'element-plus';
import useUserStore from '@/store/modules/user.js';
import { eventBus } from '@gptx/base/utils/eventBus.js';

const props = defineProps({
  bot: {
    type: Object,
    required: true
  }
});
const publishDialogRef = ref(null);
const emit = defineEmits(['chat', 'delete', 'refresh-list']);

const goLink = (bot, platform) => {
  // emit('chat', { bot, platform });
  let url
  console.log(bot)
  if(platform === 'telegram') {
     url = bot.telegram_address
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

// open bot sub page design(unused)|analyze(used)
const toBotDetail = () => {
  const { id } = props.bot;
  // router.push({ path: `/design/${id}` });
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
const onUnpublish = async (id) => {
  try {
    const { href } = router.resolve({ path: `/publish/${id}` });
    await ElMessageBox.confirm(
      `${t(
        'bots.unpublishDesc'
      )}<a class="text-[var(--el-color-primary)] hover:text-[var(--el-color-primary-light-3)]" href="${href}" >${t(
        'bots.toPublish'
      )}</a>`,
      t('bots.unpublish'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
        dangerouslyUseHTMLString: true,
        customClass: 'customize-message-box'
      }
    );
    const { code } = await removePublishApp({ app_id: id });
    if (code === 200) emit('refresh-list');
  } catch (error) {
    console.log(error);
  }
};
const user = useUserStore();
const toPublish = async ({ id }) => {
  eventBus.emit('publishBot', { id });
};
</script>

<style lang="scss" scoped>
.bot-manage-item{
  width: 413px;
  height: 222px;
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
          -webkit-line-clamp: 2;
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
  .bmi-bottom{
    display: flex;
    margin-top: 24px;
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
    }
    position: relative;
    .more-option-trigger{
      position: absolute;
      opacity: 0;
      :deep(.el-dropdown) {
        width: 100%;
        height: 100%;
        button{
          width: 100%;
          height: 100%;
        }
        display: flex;
        align-items: center;
        justify-content: center;
      }
      &:hover{
        opacity: 1;
      }
      bottom: 0;
      right: 0;
      width: 40px;
      height: 40px;
      flex-shrink: 0;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.10);
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

</style>
