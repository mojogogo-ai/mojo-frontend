<template>
  <div class="relative page-list">
    <el-card
      class="page-list__inner"
      shadow="hover"
    >
      <div class="flex mb-2">
        <div class="app-page-col">
          <el-image
            class="cursor-pointer page-list-img"
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
        <div class="relative flex-1 app-page-col">
          <div class="flex items-center">
            <div
              class="mr-2 line-clamp-1 h-[24px] flex-1 cursor-pointer pr-3 text-base text-[var(--el-color-primary)]"
              :title="bot.name"
              @click="toBotDetail"
            >
              {{ bot.name }}
            </div>
            <div class="more-option-trigger">
              <el-dropdown trigger="click">
                <el-button link>
                  <el-icon>
                    <MoreFilled />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-item
                    v-if="bot.published"
                    icon="sort-down"
                    @click.stop="onUnpublish(bot.id)"
                  >
                    {{ t('bots.unpublish') }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    class="is-delete"
                    icon="delete"
                    @click.stop="onDelete(bot.id)"
                  >
                    {{ t('bots.delete') }}
                  </el-dropdown-item>
                </template>
              </el-dropdown>
            </div>
          </div>
          <div
            class="my-2 line-clamp-4 h-[80px] cursor-pointer text-[var(--el-text-color-placeholder)]"
            :title="bot.description"
            @click="toBotDetail"
          >
            {{ bot.description }}
          </div>
          <div
            v-if="bot.app_categories && bot.app_categories.length"
            class="mt-2"
          >
            <el-tag
              v-for="{ name } in appInfo.app_categories"
              class="mr-1"
              type="info"
            >
              {{ t(name) }}
            </el-tag>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="page-list-option">
          <span class="mr-auto text-xs text-[var(--el-text-color-placeholder)]">
            <!--            <el-icon :class="{ 'text-[var(&#45;&#45;el-color-primary)]': bot.published }"><Promotion /></el-icon>
            {{ bot.published ? t('bots.published') : t('bots.unpublished') }}-->
          </span>
          <el-dropdown v-if="platList && platList.length">
            <el-button
              class="ml-1"
              size="small"
              @click.stop="() => {}"
            >
              {{ t('store.action.plat') }}
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="{ s_name } in platList"
                  @click.stop="emit('chat', s_name)"
                >
                  <el-image
                    class="plat-icon"
                    :src="platIcons[s_name]"
                  />
                  <span class="capitalize">{{ s_name }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button
            class="ml-1"
            type="primary"
            size="small"
            linear
            @click.stop="toBotDetail"
          >
            {{ t('bots.view') }}
          </el-button>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { appDelete, removePublishApp } from '@gptx/base/api/application';
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

const props = defineProps({
  bot: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(['chat', 'delete', 'refresh-list']);

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
  router.push({ path: `/design/${id}` });
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
    const { code } = await appDelete({ id });
    if (code === 200) emit('delete');
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

watch(
  () => props.bot,
  ({ shared_social }) => {
    platList = [...Object.values(shared_social).filter((_) => _.enabled === true)];
  },
  {
    immediate: true
  }
);
</script>

<style lang="scss" scoped>
.more-option-trigger {
  border-radius: 4px;
}

:deep(.page-list__inner .el-card__body) {
  min-height: 218px;
}
</style>
<style lang="scss">
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
</style>
