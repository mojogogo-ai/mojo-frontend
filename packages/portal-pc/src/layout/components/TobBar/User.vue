<template>
  <div
    class="avatar-container"
    @click="goUserCenter"
  >
    <div
      class="avatar-wrapper"
      :class="{ 'is-active': isActive() }"
    >
      <el-avatar
        :size="32"
        :src="user.avatar"
      />
      <div
        class="nick-name"
        :title="`@${user.nickName}`"
      >
        @{{ user.nickName }}
      </div>
    </div>
  </div>
</template>

<script setup>
import useUserStore from '@/store/modules/user.js';

const user = useUserStore();
const router = useRouter();

onBeforeMount(() => {
  useUserStore().updateSysInfo();
});
// to user center page
const goUserCenter = () => {
  router.push({ path: '/user' });
};
// get active status
const isActive = () => {
  return router?.currentRoute?.value?.path?.includes('/user') ?? false;
};
</script>

<style lang="scss" scoped>
.avatar-container {
  .avatar-wrapper {
    display: flex;
    align-items: center;
    height: 44px;
    padding: 0 10px;
    border-radius: 8px;
    cursor: pointer;

    .user-avatar {
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }

    .nick-name {
      width: 144px;
      margin-left: 6px;
      font-size: 16px;
      font-weight: 400;
      overflow: hidden;
      color: var(--el-color-primary);
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    i {
      cursor: pointer;
      font-size: 14px;
    }
  }
}
</style>
