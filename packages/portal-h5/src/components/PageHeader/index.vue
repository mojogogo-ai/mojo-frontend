<template>
  <div class="page-header">
    <!--    <div
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
        </div>-->
    <div
      v-show="!isShowSearch"
      class="flex flex-1 items-center"
    >
      <div class="sidebar-logo__link">
        <svg-icon
          name="logo"
          class="sidebar-logo__icon"
        />
        {{ isCn ? $t('common.productName_Cn') : $t('common.productName') }}
      </div>
    </div>
    <div
      v-show="!isShowSearch"
      class="page-header-icon"
      @click="onLeftIconClick"
    >
      <van-icon
        name="wap-nav"
        size="18"
        color="var(--van-blue)"
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
const isCn = computed(() => {
  return window.SITE_TYPE && window.SITE_TYPE === '2';
});

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
  padding: 0 32px 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--h5-fill-color-light);
  backdrop-filter: var(--backdrop-blur);

  &[border='bottom'] {
    border-bottom: var(--van-border);
  }

  .sidebar-logo__link {
    margin-top: 0;
  }

  .sidebar-logo__icon {
    font-size: 20px;
  }
}

.page-header-icon {
  position: absolute;
  top: 50%;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 30px;
  transform: translateY(-50%);
  border: var(--van-border);
  border-radius: 50%;
  background: var(--h5-fill-color-light);
  //backdrop-filter: var(--backdrop-blur);

  &.right {
    left: 8px;
    right: unset;
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
}
</style>
