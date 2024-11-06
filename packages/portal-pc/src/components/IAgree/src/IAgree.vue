<script lang="ts" setup>
import { ElCheckbox } from 'element-plus'
import { Highlight } from '@/components/Highlight'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  link: {
    type: Array,
    default: undefined
  }
})

// const modelValue = defineModel<boolean>()
const modelValue = ref(false)

const highlightKeys = computed(() => {
  return props.link?.map((item) => item.text) || []
})

const keyClick = (key) => {
  const linkItem = props.link?.find((item) => item.text === key)
  if (linkItem?.url) {
    window.open(linkItem.url)
    return
  }
  if (linkItem?.onClick) {
    linkItem.onClick()
  }
}
</script>

<template>
  <div class="flex items-center">
    <ElCheckbox v-model="modelValue" class="mr-0px!" />
    <Highlight class="ml-10px" :keys="highlightKeys" @click="keyClick">{{ text }}</Highlight>
  </div>
</template>
