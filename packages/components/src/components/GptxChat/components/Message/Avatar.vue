<script setup>
import useUserStore from '@/store/modules/user'
import { useChatStore } from '@gptx/base/useHooks/store/useChatStore.js'
import defaultBotIcon from '@/assets/logo/bot-default-logo.svg'
import defaultUserIcon from '@/assets/logo/avatar-default.svg'

defineProps({
  inversion: Boolean // true:问.false:答
})

const userStore = useUserStore()
const userAvatar = computed(() => {
  if(chatStore.getChatHistoryByCurrentActive.avatar) { // user avatar
    return chatStore.getChatHistoryByCurrentActive.avatar
  } else {
    return !userStore.avatar ? defaultUserIcon : userStore.avatar
  }
})

const chatStore = useChatStore()
const appIcon = computed(() => {
  let icon = chatStore.getChatHistoryByCurrentActive.icon || ''
  return !icon ? defaultBotIcon: icon
})

</script>

<template>
  <template v-if="inversion">
    <el-avatar
      shape="square"
      :size="30"
      :src="userAvatar"
    />
  </template>
  <template v-else>
    <el-avatar
      shape="square"
      :size="30"
      :src="appIcon"
    />
  </template>
</template>
<style scoped lang="scss">

</style>