<template>
  <div class="p-h-c-list-wrap">
    <div class="p-h-c-list">
      <div>
        {{ appInfo.created_at_format }}
      </div>
      <div>
        {{ appInfo.reason }}
      </div>
      <div>
        + {{ appInfo.points }}pt
      </div>
    </div>
    <div class="p-h-c-bottom" />
  </div>
</template>

<script setup>
// import { t } from '@gptx/base/i18n';

defineProps({
  appInfo: {
    type: Object,
    default: () => ({})
  }
});
const emits = defineEmits(['open-new-chat', 'open-with',  'open-dig', 'duplicate']);


</script>

<style lang="scss" scoped>
.p-h-c-list-wrap{
  width: 100%;
  .p-h-c-list{
    display: flex;
    width: 100%;
    div{
      display: flex;
      align-items: center;
    }
    div:first-child{
      width: 157px;
      color: rgba(255, 255, 255, 0.70);
      font-feature-settings: 'dlig' on;
      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: 23px; /* 143.75% */
      letter-spacing: 1px;
    }
    div:nth-child(2){
      width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: rgba(255, 255, 255, 0.70);
      font-feature-settings: 'dlig' on;
      font-family: Inter;
      font-size: 22px;
      font-style: normal;
      font-weight: 600;
      line-height: 24px; /* 109.091% */
    }
    div:last-child{
      margin-left: auto;
      display: inline-flex;
      padding: 6px 20px;
      align-items: center;
      gap: 10px;
      border-radius: 39px;
      background: #000;
      color: var(--Style, #E1FF01);
      font-feature-settings: 'dlig' on;
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: 23px; /* 164.286% */
      letter-spacing: 1px;
    }

    margin-bottom: 32px;
  }

  .p-h-c-bottom{
    height: 1px;
    background: rgba(255, 255, 255, 0.10);
    width: 100%;
    margin-bottom: 28px;
  }
}
</style>
