<template>
  <div
    class="avatar-container"
    @click="goUserCenter"
  >
    <div
      class="avatar-wrapper"
    >
      <el-avatar
        :size="38"
        :src="user.avatar"
      />

      <div class="flex flex-col">
        <div>
          <div
            class="user-code"
            :title="`@${user.nickName}`"
          >
            user2024090411548745
          </div>
        </div>
        <div class="flex items-center">
          <div
            class="nick-name"
            :title="`@${user.nickName}`"
          >
            @{{ user.nickName }}
          </div>
          <div style="border:1px solid rgba(224, 255, 49, 0.5)" class="px-3 py-1 text-[#e1ff01] rounded-full text-xs">
            {{ 25500 }} pts
          </div>
        </div>
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
      // width: 144px;
      margin: 0 10px;
      font-size: 13px;
      font-style: normal;
      font-weight: 500;
      overflow: hidden;
      // color: var(--el-color-primary);
      color: #fff;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: rgba(255, 255, 255, 0.70);

    }
    .user-code {
      // width: 144px;
      margin: 0 10px;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
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
