<template>
  <div>
    <el-dropdown trigger="hover" @command="changeLangCommand">
      <div :style="{ color:lableColor }" :class="['size-icon--style', { dropdownMenu: position === 'dropdown' }]">
        {{ language }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(item, index) in langList"
            :key="index"
            :disabled="item.value === curLang"
            :command="item.value"
          >
            {{ item.lable }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { supportLang, getCurLang } from "@gptx/base";
const curLang = getCurLang();
const langList = supportLang();
defineProps({
  position: {
    type: String,
    default: () => {
      return '';
    },
  },
  lableColor: {
    type: String,
    default: () => {
      return '#fff';
    },
  },
});
const language = computed(() => {
  return langList.find((i) => {
    return i.value === curLang;
  }).lable;
});

const changeLangCommand = (command) => {
  localStorage.setItem("lang", command);
  window.location.reload();
};
</script>

<style lang="scss" scoped>
.size-icon--style {
  font-size: 18px;
  line-height: 50px;
  padding-right: 7px;
  color: #ffffff;
  &.dropdownMenu {
    color: #666666;
    font-size: var(--font-base);
  }
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
</style>
