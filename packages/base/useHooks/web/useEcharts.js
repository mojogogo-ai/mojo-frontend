// useEcharts.js
import { useDebounceFn } from '@vueuse/core'

// 按照惯例，组合式函数名以“use”开头
export function useChartResize (chart) {
  // 组合式函数可以随时更改其状态。
  const resizeChart = useDebounceFn(() => {
    chart?.resize()
  }, 200)

  // 一个组合式函数也可以挂靠在所属组件的生命周期上
  // 来启动和卸载副作用
  onActivated(() => {
    // console.log('onActivated666')
    window.addEventListener('resize', resizeChart)
    chart?.resize()
  })

  onUnmounted(() => {
    // console.log('removeEventListener')
    window.removeEventListener('resize', resizeChart)
  })
  onDeactivated(() => {
    // console.log('removeEventListener')
    window.removeEventListener('resize', resizeChart)
  })

  function sidebarResizeHandler (e) {
    if (e.propertyName === 'width') {
      resizeChart()
    }
  }

  // 初始化监听
  const initChartResize = function () {
    window.addEventListener('resize', resizeChart)

    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm && sidebarElm.addEventListener('transitionend', sidebarResizeHandler)
  }
 return { initChartResize }
}
