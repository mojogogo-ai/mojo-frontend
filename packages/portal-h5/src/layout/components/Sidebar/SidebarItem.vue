<template>
  <router-link
    class="sidebar-menu__item"
    :class="{ 'is-active': isActive(menuInfo.path) }"
    :to="menuInfo.path"
  >
    <svg-icon
      class="sidebar-menu__icon"
      :style="{color: isActive(menuInfo.path) ? `${menuInfo.iconActiveColor || 'var(--h5-text-color-primary)'}`:'inherit'}"
      :name="menuInfo.meta.icon"
    />
    <span class="sidebar-menu__title">{{ menuInfo.meta.title }}</span>
  </router-link>
</template>

<script setup>
const router = useRouter();
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});
const isActive = (path) => {
  // if (path === '/discord' && !isDiscordEnabled()) {
  //   return false;
  // }
  const isInclude = router?.currentRoute?.value?.path?.includes(path) ?? false;
  return isInclude;
};
// 注意：没有多级菜单，待优化路由结构
const menuInfo = computed(() => {
  return props.item.children[0];
});
</script>
