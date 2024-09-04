<template>
  <div class="page-header">
    <div
      class="page-header-icon"
      @click="onLeftIconClick"
    >
      <van-icon
        name="wap-nav"
        size="18"
        color="#fff"
      />
    </div>
    <div class="flex flex-1 items-center justify-center">
      <div class="line-clamp-1 text-center text-base font-bold">
        {{ title }}
      </div>
    </div>
    <div
      class="page-header-icon right"
      :class="{ 'is-show-search': isShowSearch }"
    >
      <van-search
        v-if="isShowSearch"
        v-model="searchValue"
        show-action
        :placeholder="placeholder"
        shape="round"
        background="transparent"
        @search="onSearch"
      >
        <template #action>
          <div @click="isShowSearch = false">{{ t('common.cancel') }}</div>
        </template>
      </van-search>
      <van-icon
        v-if="inputArea && !isShowSearch"
        name="search"
        size="18"
        color="#fff"
        @click="isShowSearch = true"
      />
      <van-image
        v-if="rightIcon.indexOf('/') > -1"
        width="100%"
        height="100%"
        :src="rightIcon"
        @click="emits('right-icon-click')"
      />
      <van-icon
        v-else
        size="18"
        color="#fff"
        :name="rightIcon"
        @click="emits('right-icon-click')"
      />
    </div>
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n/index.js';
import { useLayoutStore } from '@/store/modules/layout';

const storeLayout = useLayoutStore();
defineProps({
  rightIcon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  customStyle: {
    type: Object,
    default: () => ({})
  },
  inputArea: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: t('common.search')
  }
});
const emits = defineEmits(['search', 'right-icon-click']);

const isShowSearch = ref(false);
const searchValue = ref('');

const onLeftIconClick = () => {
  storeLayout.setSidebarVisible(true);
};
const onSearch = () => {
  // isShowSearch.value = false;
  emits('search', searchValue.value);
};
</script>

<style lang="scss">
.page-header {
  position: sticky;
  top: 0;
  width: 100%;
  height: var(--van-action-bar-height);
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &[border='bottom'] {
    border-bottom: 1px solid #e7e7e7;
  }
}

.page-header-icon {
  position: absolute;
  top: 50%;
  left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  width: 24px;
  transform: translateY(-50%);

  &.right {
    left: unset;
    right: 8px;
    height: 24px;
    width: 24px;
    transition: left 0.3s ease-out;

    &.is-show-search {
      width: calc(100% - 16px);

      .van-search {
        width: 100%;
        padding: 0;
      }
    }
  }

  .van-search__content {
    --van-search-content-background: #fff;
  }
}

.icon-right-icon {
  font-size: 18px;
  color: #72757c;
}
</style>
