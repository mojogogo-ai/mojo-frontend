<template>
  <!--  <div class="relative page-list">-->
  <!--    <el-card-->
  <!--      class="page-list__inner"-->
  <!--      shadow="hover"-->
  <!--    >-->
  <!--      <div class="flex mb-2">-->
  <!--        <div class="app-page-col">-->
  <!--          <el-image-->
  <!--            class="cursor-pointer page-list-img"-->
  <!--            fit="cover"-->
  <!--            :src="bot.icon || defaultBotImage"-->
  <!--            @click="toBotDetail"-->
  <!--          >-->
  <!--            <template #error>-->
  <!--              <div class="page-list-img__error">-->
  <!--                <el-icon>-->
  <!--                  <Picture />-->
  <!--                </el-icon>-->
  <!--              </div>-->
  <!--            </template>-->
  <!--          </el-image>-->
  <!--        </div>-->
  <!--        <div class="relative flex-1 app-page-col">-->
  <!--          <div class="flex items-center">-->
  <!--            <div-->
  <!--              class="mr-2 line-clamp-1 h-[24px] flex-1 cursor-pointer pr-3 text-base text-[var(&#45;&#45;el-color-primary)]"-->
  <!--              :title="bot.name"-->
  <!--              @click="toBotDetail"-->
  <!--            >-->
  <!--              {{ bot.name }}-->
  <!--            </div>-->
  <!--            <div class="more-option-trigger">-->
  <!--              <el-dropdown trigger="click">-->
  <!--                <el-button link>-->
  <!--                  <el-icon>-->
  <!--                    <MoreFilled />-->
  <!--                  </el-icon>-->
  <!--                </el-button>-->
  <!--                <template #dropdown>-->
  <!--                  <el-dropdown-item-->
  <!--                    v-if="bot.public"-->
  <!--                    icon="sort-down"-->
  <!--                    @click.stop="onUnpublish(bot.id)"-->
  <!--                  >-->
  <!--                    {{ t('bots.unpublish') }}-->
  <!--                  </el-dropdown-item>-->
  <!--                  <el-dropdown-item-->
  <!--                    class="is-delete"-->
  <!--                    icon="delete"-->
  <!--                    @click.stop="onDelete(bot.id)"-->
  <!--                  >-->
  <!--                    {{ t('bots.delete') }}-->
  <!--                  </el-dropdown-item>-->
  <!--                </template>-->
  <!--              </el-dropdown>-->
  <!--            </div>-->
  <!--          </div>-->
  <!--          <div-->
  <!--            class="my-2 line-clamp-4 h-[80px] cursor-pointer text-[var(&#45;&#45;el-text-color-placeholder)]"-->
  <!--            :title="bot.description"-->
  <!--            @click="toBotDetail"-->
  <!--          >-->
  <!--            {{ bot.description }}-->
  <!--          </div>-->
  <!--          <div-->
  <!--            v-if="bot.app_categories && bot.app_categories.length"-->
  <!--            class="mt-2"-->
  <!--          >-->
  <!--            <el-tag-->
  <!--              v-for="{ name } in appInfo.app_categories"-->
  <!--              class="mr-1"-->
  <!--              type="info"-->
  <!--            >-->
  <!--              {{ t(name) }}-->
  <!--            </el-tag>-->
  <!--          </div>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--      <template #footer>-->
  <!--        <div class="page-list-option">-->
  <!--          <span class="mr-auto text-xs text-[var(&#45;&#45;el-text-color-placeholder)]">-->
  <!--            &lt;!&ndash;            <el-icon :class="{ 'text-[var(&#45;&#45;el-color-primary)]': bot.public }"><Promotion /></el-icon>-->
  <!--            {{ bot.public ? t('bots.public') : t('bots.unpublic') }}&ndash;&gt;-->
  <!--          </span>-->
  <!--          <el-dropdown v-if="platList && platList.length">-->
  <!--            <el-button-->
  <!--              class="ml-1"-->
  <!--              size="small"-->
  <!--              @click.stop="() => {}"-->
  <!--            >-->
  <!--              {{ t('store.action.plat') }}-->
  <!--            </el-button>-->
  <!--            <template #dropdown>-->
  <!--              <el-dropdown-menu>-->
  <!--                <el-dropdown-item-->
  <!--                  v-for="{ s_name } in platList"-->
  <!--                  @click.stop="emit('chat', s_name)"-->
  <!--                >-->
  <!--                  <el-image-->
  <!--                    class="plat-icon"-->
  <!--                    :src="platIcons[s_name]"-->
  <!--                  />-->
  <!--                  <span class="capitalize">{{ s_name }}</span>-->
  <!--                </el-dropdown-item>-->
  <!--              </el-dropdown-menu>-->
  <!--            </template>-->
  <!--          </el-dropdown>-->
  <!--          <el-button-->
  <!--            class="ml-1"-->
  <!--            type="primary"-->
  <!--            size="small"-->
  <!--            linear-->
  <!--            @click.stop="toBotDetail"-->
  <!--          >-->
  <!--            {{ t('bots.view') }}-->
  <!--          </el-button>-->
  <!--        </div>-->
  <!--      </template>-->
  <!--    </el-card>-->
  <!--  </div>-->
  <div class="bot-manage-item cursor-pointer">
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
            <div v-show="bot.public == '1'" class="bmiclt-btn bb-publish">
              Published
            </div>
          </div>
        </div>
      </div>
      <div class="bmic-right">
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M18.7417 1.5H3.94877V0.5H19.9488H20.4488V1V17H19.4488V2.20711L2.30232 19.3536L1.59521 18.6464L18.7417 1.5Z" fill="#E1FF01" />
        </svg>
      </div>
    </div>
    <div class="bmi-bottom">
      <div class="bmi-share-bar cursor-pointer">
        <div class="bmi-s-b-item" @click.stop="goLink(bot, 'discord')">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
            <rect x="0.94873" width="24" height="24" rx="12" fill="white" />
            <path d="M19.1964 6.20799C18.016 5.65567 16.7671 5.26322 15.4829 5.04102C15.323 5.33021 15.1361 5.71918 15.0072 6.02862C13.6226 5.82041 12.2507 5.82041 10.8916 6.02862C10.7628 5.71925 10.5717 5.33021 10.4102 5.04102C9.12477 5.26331 7.87487 5.65676 6.69387 6.21087C4.34374 9.76229 3.70664 13.2254 4.02516 16.6395C5.58391 17.8035 7.09451 18.5106 8.57965 18.9734C8.94877 18.4658 9.27504 17.9284 9.55509 17.3668C9.02186 17.1638 8.5078 16.9136 8.01904 16.6192C8.14766 16.5239 8.27325 16.4245 8.39564 16.3213C11.3573 17.7066 14.5754 17.7066 17.5018 16.3213C17.6247 16.4239 17.7503 16.5232 17.8783 16.6192C17.3888 16.9144 16.8738 17.1651 16.3395 17.3683C16.6211 17.9322 16.9468 18.4701 17.3149 18.9748C18.8015 18.5121 20.3135 17.805 21.8722 16.6395C22.246 12.6817 21.2338 9.25041 19.1964 6.20799ZM9.95861 14.5399C9.06951 14.5399 8.34037 13.7098 8.34037 12.6991C8.34037 11.6884 9.05397 10.8569 9.95861 10.8569C10.8633 10.8569 11.5924 11.6869 11.5769 12.6991C11.5783 13.7098 10.8633 14.5399 9.95861 14.5399ZM15.9388 14.5399C15.0497 14.5399 14.3206 13.7098 14.3206 12.6991C14.3206 11.6884 15.0341 10.8569 15.9388 10.8569C16.8435 10.8569 17.5725 11.6869 17.557 12.6991C17.557 13.7098 16.8435 14.5399 15.9388 14.5399Z" fill="#5865F2" />
          </svg>
        </div>
        <div class="bmi-s-b-item" @click.stop="goLink(bot, 'telegram')">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
            <g clip-path="url(#clip0_994_681)">
              <path d="M12.9487 0C9.76686 0 6.71248 1.26506 4.46436 3.51469C2.21393 5.76522 0.949374 8.81734 0.94873 12C0.94873 15.1813 2.21436 18.2357 4.46436 20.4853C6.71248 22.7349 9.76686 24 12.9487 24C16.1306 24 19.185 22.7349 21.4331 20.4853C23.6831 18.2357 24.9487 15.1813 24.9487 12C24.9487 8.81869 23.6831 5.76431 21.4331 3.51469C19.185 1.26506 16.1306 0 12.9487 0Z" fill="url(#paint0_linear_994_681)" />
              <path d="M6.38057 11.873C9.87932 10.349 12.2118 9.3443 13.3781 8.8588C16.7118 7.47261 17.4037 7.23186 17.8556 7.2237C17.9549 7.22211 18.1762 7.24667 18.3206 7.36339C18.4406 7.46183 18.4743 7.59495 18.4912 7.68842C18.5062 7.7818 18.5268 7.99461 18.5099 8.16074C18.3299 10.0582 17.5481 14.6629 17.1506 16.7882C16.9837 17.6874 16.6518 17.9889 16.3312 18.0184C15.6337 18.0825 15.1049 17.5579 14.4299 17.1155C13.3743 16.4231 12.7781 15.9922 11.7524 15.3167C10.5674 14.5359 11.3362 14.1067 12.0112 13.4055C12.1874 13.2219 15.2587 10.4291 15.3168 10.1758C15.3243 10.1441 15.3318 10.026 15.2606 9.96373C15.1912 9.9013 15.0881 9.92267 15.0131 9.93955C14.9062 9.96355 13.2206 11.0788 9.95057 13.2851C9.47245 13.614 9.03932 13.7743 8.64932 13.7659C8.22182 13.7567 7.39682 13.5236 6.7837 13.3245C6.0337 13.0802 5.43557 12.951 5.48807 12.536C5.51432 12.32 5.81245 12.099 6.38057 11.873Z" fill="white" />
            </g>
            <defs>
              <linearGradient id="paint0_linear_994_681" x1="1200.95" y1="0" x2="1200.95" y2="2400" gradientUnits="userSpaceOnUse">
                <stop stop-color="#2AABEE" />
                <stop offset="1" stop-color="#229ED9" />
              </linearGradient>
              <clipPath id="clip0_994_681">
                <rect width="24" height="24" fill="white" transform="translate(0.94873)" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
      <div class="more-option-trigger" @click.stop="()=>{}">
        <el-dropdown popper-class="bot-manage-dropdown" trigger="click">
          <el-button link style="transform: rotate(90deg)">
            <el-icon>
              <MoreFilled />
            </el-icon>
          </el-button>
          <template #dropdown>
            <!--            <el-dropdown-item-->
            <!--              v-if="bot.public"-->
            <!--              @click.stop="onUnpublish(bot.id)"-->
            <!--            >-->
            <!--              {{ t('bots.unpublish') }}-->
            <!--            </el-dropdown-item>-->
            <el-dropdown-item
              v-if="bot.public != '1'"
              @click.stop="toPublish(bot)"
            >
              publish
            </el-dropdown-item>
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
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { botDelete, removePublishApp } from '@gptx/base/api/application';
import router from '@/router';
import defaultBotImage from '@/assets/logo/bot-default-logo.svg';
import IconTelegram from '@/assets/images/bots/publish/telegram.svg';
import IconDiscord from '@/assets/images/bots/publish/discord.svg';
import IconLine from '@/assets/images/bots/publish/line.svg';
import IconMessenger from '@/assets/images/bots/publish/messenger.svg';
import IconSlack from '@/assets/images/bots/publish/slack.svg';
import IconInstagram from '@/assets/images/bots/publish/instagram.svg';
import IconReddit from '@/assets/images/bots/publish/reddit.svg';
import { ElMessageBox } from 'element-plus';
import useUserStore from '@/store/modules/user.js';
import PublishDialog from '../publish/PublishDialog.vue';
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


let platList = reactive([]);
const platIcons = {
  telegram: IconTelegram,
  slack: IconSlack,
  instagram: IconInstagram,
  reddit: IconReddit,
  discord: IconDiscord,
  messenger: IconMessenger,
  line: IconLine
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

// watch(
//   () => props.bot,
//   ({ shared_social }) => {
//     platList = [...Object.values(shared_social).filter((_) => _.enabled === true)];
//   },
//   {
//     immediate: true
//   }
// );
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
