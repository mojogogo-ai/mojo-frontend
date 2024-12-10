<script setup lang="ts">
import { ref, unref, computed, watch } from 'vue'
import { ElInput } from 'element-plus'
// import { propTypes } from '@/utils/propTypes'
// import { useConfigGlobal } from '@/hooks/web/useConfigGlobal'
// import { zxcvbn } from '@zxcvbn-ts/core'
// import type { ZxcvbnResult } from '@zxcvbn-ts/core'
// import { useDesign } from '@/hooks/web/useDesign'

// const { getPrefixCls } = useDesign()


const props = defineProps({
  // 是否显示密码强度
  strength: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: String,
    default: ''
  }
})

watch(
  () => props.modelValue,
  (val) => {
    if (val === unref(valueRef)) return
    valueRef.value = val
  }
)


const emit = defineEmits(['update:modelValue'])

// 设置input的type属性
const textType = ref<'password' | 'text'>('password')

// 输入框的值
const valueRef = ref(props.modelValue)

// 监听
watch(
  () => valueRef.value,
  (val) => {
    emit('update:modelValue', val)
  }
)


</script>

<template>
  <div :class="[]">
    <ElInput v-bind="$attrs" v-model="valueRef" show-password :type="textType" />
  </div>
</template>

<style lang="scss" scoped>

</style>
