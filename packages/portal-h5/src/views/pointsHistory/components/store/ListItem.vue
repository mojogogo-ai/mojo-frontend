<template>
  <div class="p-h-c-list-wrap">
    <div class="p-h-c-time">
      {{ appInfo.created_at_format }}
    </div>
    <div class="p-h-c-list">
      <div>
        {{ appInfo.reason }}
      </div>
      <div>
        {{ appInfo.points }}pt
      </div>
    </div>
    <div class="p-h-c-bottom"></div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  appInfo: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['open-new-chat', 'open-with', 'open-dig', 'click']);
</script>

<style lang="scss" scoped>
.p-h-c-list-wrap {
  width: 100%;
}

.p-h-c-list {
  display: flex;
  width: 100%;
  justify-content: space-between;
  div {
    display: flex;
    align-items: center;

  }

  div:first-child {
    color: rgba(255, 255, 255, 0.70);
    font-feature-settings: 'dlig' on;
    font-family: Inter;
    font-size: 17px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px; /* 141.176% */
  }


  div:last-child {
    border-radius: 39px;
    background: #000;
    display: flex;
    padding: 4px 20px;
    align-items: center;
    gap: 10px;
  }

  margin-bottom: 32px;
}
.p-h-c-time{
  display: flex;
  padding-bottom: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  align-self: stretch;
  color: rgba(255, 255, 255, 0.70);
  font-feature-settings: 'dlig' on;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 23px; /* 191.667% */
  letter-spacing: 1px;
  margin-bottom: 4px;
  margin-top: 16px;
}
.p-h-c-bottom {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  width: 100%;
  margin-bottom: 0;
}
</style>
