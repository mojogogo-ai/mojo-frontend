<template>
  <div class="cursor-pointer bot-manage-item">
    <div class="bmi-content">
      <div class="bmic-left">
        <div class="bmicl-avatar">
          <van-image
            class="cursor-pointer bmicl-avatar-img"
            width="80px"
            height="80px"
            fit="cover"
            :src="bot.icon || defaultBotImage"
            @click="toBotDetail"
            @error="imageError"
          />
          <div v-if="imageErrorFlag" class="page-list-img__error">
            <van-icon name="photo-o" />
          </div>
        </div>
        <div class="bmicl-info">
          <div class="bmicli-title" @click="toBotDetail">
            {{ bot.name }}
          </div>
          <div class="bmicli-author">
            <van-image
              class="bmicli-author-avatar"
              width="20px"
              height="20px"
              fit="cover"
              :src="user.avatar"
              round
            />
            <span class="bmicli-author-name">@{{ user.nickname }}</span>
          </div>
          <div class="bmicli-desc" :title="bot.introduction">
            {{ bot.introduction }}
          </div>
          <div class="bmicl-toolbar">
            <div v-if="bot.public === 1" class="bmiclt-btn bb-publish">
              Published
            </div>
          </div>
        </div>
      </div>
      <div class="bmic-right">
        <!-- 保留自定义 SVG 图标 -->
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M18.7417 1.5H3.94877V0.5H19.9488H20.4488V1V17H19.4488V2.20711L2.30232 19.3536L1.59521 18.6464L18.7417 1.5Z"
            fill="#E1FF01"
          />
        </svg>
      </div>
    </div>
    <div class="bmi-bottom">
      <div class="cursor-pointer bmi-share-bar">
        <div v-if="bot?.discord_address" class="bmi-s-b-item" @click.stop="goLink(bot, 'discord')">
          <!-- Discord 图标 -->
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
            <path d="M19.1964 6.20799C18.016 5.65567 16.7671 5.26322 15.4829 5.04102C15.323 5.33021 15.1361 5.71918 15.0072 6.02862C13.6226 5.82041 12.2507 5.82041 10.8916 6.02862C10.7628 5.71925 10.5717 5.33021 10.4102 5.04102C9.12477 5.26331 7.87487 5.65676 6.69387 6.21087C4.34374 9.76229 3.70664 13.2254 4.02516 16.6395C5.58391 17.8035 7.09451 18.5106 8.57965 18.9734C8.94877 18.4658 9.27504 17.9284 9.55509 17.3668C9.02186 17.1638 8.5078 16.9136 8.01904 16.6192C8.14766 16.5239 8.27325 16.4245 8.39564 16.3213C11.3573 17.7066 14.5754 17.7066 17.5018 16.3213C17.6247 16.4239 17.7503 16.5232 17.8783 16.6192C17.3888 16.9144 16.8738 17.1651 16.3395 17.3683C16.6211 17.9322 16.9468 18.4701 17.3149 18.9748C18.8015 18.5121 20.3135 17.805 21.8722 16.6395C22.246 12.6817 21.2338 9.25041 19.1964 6.20799ZM9.95861 14.5399C9.06951 14.5399 8.34037 13.7098 8.34037 12.6991C8.34037 11.6884 9.05397 10.8569 9.95861 10.8569C10.8633 10.8569 11.5924 11.6869 11.5769 12.6991C11.5783 13.7098 10.8633 14.5399 9.95861 14.5399ZM15.9388 14.5399C15.0497 14.5399 14.3206 13.7098 14.3206 12.6991C14.3206 11.6884 15.0341 10.8569 15.9388 10.8569C16.8435 10.8569 17.5725 11.6869 17.557 12.6991C17.557 13.7098 16.8435 14.5399 15.9388 14.5399Z" fill="#5865F2" />
          </svg>
        </div>
        <div v-if="bot?.telegram_address" class="bmi-s-b-item" @click.stop="goLink(bot, 'telegram')">
          <!-- Telegram 图标 -->
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
      <div class="more-option-trigger" @click.stop="isShowAction = true">
        <van-icon name="ellipsis" />
      </div>
    </div>
    <van-action-sheet
      v-model:show="isShowAction"
      :actions="actions"
      :cancel-text="t('common.cancel')"
      teleport="body"
      @select="onActionSelect"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { showConfirmDialog, showToast } from 'vant';
import { t } from '@gptx/base/i18n';
import { botDelete, removePublishApp } from '@gptx/base/api/application';
import defaultBotImage from '@/assets/logo/bot-default-logo.svg';
import useUserStore from '@/store/modules/user.js';
import { eventBus } from '@gptx/base/utils/eventBus.js';

const props = defineProps({
  bot: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['chat', 'delete', 'refresh-list']);
const router = useRouter();
const user = useUserStore();
const isShowAction = ref(false);
const imageErrorFlag = ref(false);

const actions = computed(() => {
  let arr = [];
  if (props.bot.public === '1') {
    arr.push({ name: t('bots.unpublish'), action: 'unpublish' });
  } else {
    arr.push({ name: t('bots.publish.btn'), action: 'publish' });
  }
  arr.push({ name: t('bots.delete'), className: 'is-delete', action: 'delete' });
  return arr;
});

const goLink = (bot, platform) => {
  let url;
  if (platform === 'telegram') {
    url = bot.telegram_address;
  } else if (platform === 'discord') {
    url = bot.discord_address;
  }
  if (!url) {
    showToast({
      message: t('tips.configurePlatformAddress'),
      type: 'warning'
    });
    return;
  }
  emit('chat', { url });
};

// 打开 Bot 详情页面
const toBotDetail = () => {
  // const { id } = props.bot;
  // router.replace({
  //   path: `/design/${id}`
  // });
};

// 处理图片加载错误
const imageError = () => {
  imageErrorFlag.value = true;
};

// 选择操作
const onActionSelect = (action) => {
  console.log(action, 'action');
  const id = props.bot.id;
  switch (action?.action) {
    case 'unpublish':
      onUnpublish(id);
      break;
    case 'publish':
      onPublish(id);
      break;
    case 'delete':
      onDelete(id);
      break;
    default:
      break;
  }
  isShowAction.value = false;
};

// 删除 Bot
const onDelete = async (id) => {
  console.log('onDelete', id);
  try {
    const message = props.bot.public === '1' ? t('bots.deleteDesc') : t('bots.deleteDescCn');
    const action = await showConfirmDialog({
      title: t('bots.delete'),
      message,
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel')
    });
    if (action === 'confirm') {
      const { code } = await botDelete({ id });
      if (code === 200) {
        emit('delete');
        eventBus.emit('createBotSuccess');
        showToast(t('bots.deleteSuccess'));
      }
    }
  } catch (error) {
    console.log(error);
    showToast(t('common.error'));
  }
};

// 发布 Bot
const onPublish = (id) => {
  // router.push({
  //   path: `/publish/${id}`
  // });
  eventBus.emit('publishBot', { id });

};

// 取消发布 Bot
const onUnpublish = async (id) => {
  try {
    const href = router.resolve({
      path: `/publish/${id}`
    }).href;
    const action = await showConfirmDialog({
      title: t('bots.unpublish'),
      message: `${t('bots.unpublishDesc')} <a class="text-primary" href="${href}" target="_blank">${t('bots.toPublish')}</a>`,
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      allowHtml: true
    });
    if (action === 'confirm') {
      const { code } = await removePublishApp({ app_id: id });
      if (code === 200) {
        emit('refresh-list');
        showToast(t('bots.unpublishSuccess'));
      }
    }
  } catch (error) {
    console.log(error);
    showToast(t('common.error'));
  }
};
</script>

<style lang="scss" scoped>
.bot-manage-item {
  width: 100%;
  height: 222px;
  flex-shrink: 0;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(25px);
  padding: 22px 22px 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .bmi-content {
    display: flex;
    justify-content: space-between;

    .bmic-left {
      display: flex;
      gap: 16px;

      .bmicl-avatar {
        position: relative;

        .bmicl-avatar-img {
          border-radius: 10px;
        }

        .page-list-img__error {
          position: absolute;
          top: 0;
          left: 0;
          width: 80px;
          height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 10px;

          .van-icon {
            color: #fff;
            font-size: 24px;
          }
        }
      }

      .bmicl-info {
        display: flex;
        flex-direction: column;
        gap: 8px;
        justify-content: center;

        .bmicli-title {
          color: #e1ff01;
          font-family: Inter, sans-serif;
          font-size: 20px;
          font-weight: 700;
          line-height: 23px;
          width: 215px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
        }

        .bmicli-author {
          display: flex;
          gap: 12px;
          align-items: center;

          .bmicli-author-avatar {
            width: 20px;
            height: 20px;
          }

          .bmicli-author-name {
            color: rgba(255, 255, 255, 0.7);
            font-family: Inter, sans-serif;
            font-size: 13px;
            font-weight: 500;
            line-height: 19px;
          }
        }

        .bmicli-desc {
          color: rgba(255, 255, 255, 0.7);
          font-family: Inter, sans-serif;
          font-size: 14px;
          font-weight: 500;
          line-height: 19px;
          width: 203px;
          height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          cursor: pointer;
        }

        .bmicl-toolbar {
          height: 27px;

          .bmiclt-btn {
            width: 73px;
            height: 27px;
            display: flex;
            padding: 4px 8px;
            justify-content: center;
            align-items: center;
            border-radius: 8px;
            background: rgba(17, 198, 65, 0.8);
            color: #fff;
            font-family: Inter, sans-serif;
            font-size: 12px;
            font-weight: 500;
            line-height: 19px;
          }
        }
      }
    }
  }

  .bmi-bottom {
    display: flex;
    margin-top: 24px;
    justify-content: space-between;

    .bmi-share-bar {
      display: flex;
      gap: 13px;

      .bmi-s-b-item {
        width: 25px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.07);
        backdrop-filter: blur(25px);
        cursor: pointer;

        svg {
          width: 25px;
          height: 24px;
        }
      }
    }

    .more-option-trigger {
      width: 32px;
      height: 32px;
      flex-shrink: 0;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      .van-icon {
        font-size: 24px;
        color: #fff;
      }
    }
  }
}

.van-action-sheet__title {
  display: none;
}

.van-action-sheet__cancel {
  color: var(--van-danger-color);
}

.is-delete {
  color: var(--van-danger-color);
}
</style>

<style lang="scss">
/* 额外的样式调整 */
.text-primary {
  color: var(--van-primary-color);
}

.text-primary-light {
  color: var(--van-primary-light-3);
}
</style>
