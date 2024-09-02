<template>
  <div
    ref="chat"
    class="w-full h-full"
  />
</template>

<script setup>
import chart from '@gptx/base/utils/charts';
import { useChartResize } from '@gptx/base/useHooks/web/useEcharts';
const chat = ref(null);
let chatInstance = null;
const setData = (data, option = {}) => {
  let xAxisArr = [];
  let yAxisArr = [];
  if (data && data.length) {
    xAxisArr = data.map((item) => item.date);
    yAxisArr = data.map((item) => item.count);
  }
  setOption({
    color: option.color || ['#3a8ee6'],
    title: {
      top: '4%',
      left: 16,
      textStyle: {
        color: '#36353a',
        fontSize: 16
      },
      show: option.title && option.title?.show !== false,
      ...option.title
    },
    tooltip: {
      trigger: 'axis',
      ...option.tooltip
    },
    xAxis: {
      data: xAxisArr,
      axisLine: {
        lineStyle: {
          color: '#707070'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#cecfd0'
      }
    },
    yAxis: {
      splitLine: {
        lineStyle: {
          color: 'rgba(112, 112, 112, 0.26)',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#707070'
      },
      minInterval: 1
    },
    series: [
      {
        name: '对话',
        type: 'line',
        data: yAxisArr,
        symbolSize: 15,
        smooth: true,
        ...option.series
      }
    ]
  });
};
const setOption = (option) => chatInstance.setOption(option);
onMounted(() => {
  chatInstance = chart.init(chat.value);
  setData([], {});
  const { initChartResize } = useChartResize(chatInstance)
  initChartResize(chatInstance)
});
defineExpose({
  setData
});
</script>

<style lang="scss" scoped></style>
