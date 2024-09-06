<template>
  <layout @publish="toPublish">
    <template #default>
      <div class="h-full px-[30px] pb-4 pt-[6px]">
        <div class="flex items-center justify-end">
          <!-- <el-button
            class="mr-auto"
            type="primary"
            linear
          >
            {{ t('bots.PV') }}
          </el-button> -->
          <el-select
            v-model="time"
            style="width: 266px"
            @change="setData"
          >
            <el-option
              value="7"
              :label="`${t('bots.analyze.t1')}7${t('bots.analyze.t2')}`"
            />
            <el-option
              value="14"
              :label="`${t('bots.analyze.t1')}14${t('bots.analyze.t2')}`"
            />
            <el-option
              value="30"
              :label="`${t('bots.analyze.t1')}30${t('bots.analyze.t2')}`"
            />
          </el-select>
        </div>
        <div class="mt-2 text-base font-black">{{ t('bots.use') }}</div>
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
  </layout>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { getAnalyzeData } from '@gptx/base/api/application';
import layout from './layout';

const route = useRoute();
const router = useRouter();
const time = ref('7');
const chatRef = ref(null);
const userRef = ref(null);

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
          return { date, count: daily_users };
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
const toPublish = () => {
  router.push(`/publish/${route.params.id}`);
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
