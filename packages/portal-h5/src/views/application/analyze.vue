<template>
  <div class="pt-[6px] px-[30px] pb-4 h-full">
    <div class="flex items-center justify-end">
      <selector
        v-model="time"
        style="width: 266px"
        :columns="columns"
        border
        @update:model-value="setData"
      />
    </div>
    <div class="text-base font-black mt-[12px]">{{ t('bots.use') }}</div>
    <div class="flex mt-3">
      <div class="chart-container">
        <single-line-chart ref="chatRef" />
      </div>
      <div class="chart-container">
        <single-line-chart ref="userRef" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { getAnalyzeData } from '@gptx/base/api/application';
const route = useRoute();
const time = ref('7');
const chatRef = ref(null);
const userRef = ref(null);
const columns = [
  {
    value: '7',
    text: `${t('bots.analyze.t1')}7${t('bots.analyze.t2')}`
  },
  {
    value: '14',
    text: `${t('bots.analyze.t1')}14${t('bots.analyze.t2')}`
  },
  {
    value: '30',
    text: `${t('bots.analyze.t1')}30${t('bots.analyze.t2')}`
  }
];

const setData = async () => {
  try {
    const {
      data: { list },
      code
    } = await getAnalyzeData({ id: route.params.id, past_day: time.value });
    if (code === 200) {
      chatRef.value.setData(
        list.map(({ date, daily_sessions }) => {
          return {
            date,
            count: daily_sessions
          };
        }),
        {
          title: {
            text: t('bots.analyze.chat')
          },
          series: {
            name: t('bots.chats')
          }
        }
      );
      userRef.value.setData(
        list.map(({ date, daily_users }) => {
          return { date, count: daily_users + Math.ceil(Math.random() * 10) };
        }),
        {
          color: '#3d8200',
          title: {
            text: t('bots.analyze.user')
          },
          series: {
            name: t('bots.analyze.users')
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  setData();
});
</script>

<style lang="scss" scoped>
.chart-container {
  flex: 1;
  height: 458px;
  background-color: #fff;
  border-radius: 11px;
  box-shadow: 0 1px 2px 1px rgba(#000, 0.16);
  & + & {
    margin-left: 30px;
  }
}
</style>
