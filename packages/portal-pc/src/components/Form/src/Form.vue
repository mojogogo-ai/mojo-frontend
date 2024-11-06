<template>
  <ElForm
    ref="elFormRef"
    v-bind="getFormBindValue()"
    :model="computedModel"
    class="form-container"
    @submit.prevent
  >
    <template v-if="isCustom">
      <slot />
    </template>
    <template v-else>
      <ElRow v-if="isCol" :gutter="20">
        <template v-for="item in filteredSchema" :key="item.field">
          <component
            :is="getComponent(item)"
            v-if="isDivider(item)"
            v-bind="getComponentProps(item)"
          >
            <template #default>{{ item.label }}</template>
          </component>
          <ElCol v-else :span="item.colProps?.span || 24">
            <ElFormItem v-if="!item.hidden" :label="item.label" :prop="item.field">
              <component
                :is="getComponent(item)"
                v-bind="getComponentProps(item)"
                v-model="formModel[item.field]"
              />
            </ElFormItem>
          </ElCol>
        </template>
      </ElRow>
    </template>
  </ElForm>
</template>

<script setup lang="js">
import { ref, computed, unref, onMounted } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol } from 'element-plus'
import { componentMap } from './helper/componentMap'
import {
  setTextPlaceholder,
  setComponentProps,
} from './helper'


const props = defineProps({
  schema: { type: Array, default: () => [] },
  isCol: { type: Boolean, default: true },
  model: { type: Object, default: () => ({}) },
  autoSetPlaceholder: { type: Boolean, default: true },
  isCustom: { type: Boolean, default: false },
  labelWidth: { type: [String, Number], default: 'auto' },
  rules: { type: Object, default: () => ({}) },
  labelPosition: { type: String, default: 'right' },
  labelSuffix: { type: String, default: '' },
  hideRequiredAsterisk: { type: Boolean, default: false },
  requireAsteriskPosition: { type: String, default: 'left' },
  showMessage: { type: Boolean, default: true },
  inlineMessage: { type: Boolean, default: false },
  statusIcon: { type: Boolean, default: false },
  validateOnRuleChange: { type: Boolean, default: true },
  size: { type: String, default: undefined },
  disabled: { type: Boolean, default: false },
  scrollToError: { type: Boolean, default: false },
  scrollToErrorOffset: { type: [Boolean, Object], default: undefined }
})

const emit = defineEmits(['register'])

const elFormRef = ref(null)
const formModel = ref(props.model)

const mergeProps = ref({})
const getProps = computed(() => {
  return { ...props, ...mergeProps.value }
})

// 判断是否为分隔符组件
const isDivider = (item) => {
  return item.component === 'Divider'
}


const getComponent = (item) => {
  return componentMap[item.component]
}

const getComponentProps = (item) => {
  const componentProps = { ...item.componentProps, ...setComponentProps(item) }
  if (props.autoSetPlaceholder) {
    componentProps.placeholder = componentProps.placeholder || setTextPlaceholder(item)
  }
  return componentProps
}

const filteredSchema = computed(() => {
  return props.schema.filter((item) => !item.remove)
})

const computedModel = computed(() => {
  return props.isCustom ? props.model : formModel.value
})

const isCustom = computed(() => props.isCustom)
const isCol = computed(() => props.isCol)

const getFormBindValue = () => {
  const keysToOmit = ['schema', 'isCol', 'autoSetPlaceholder', 'isCustom', 'model']
  const boundProps = { ...getProps.value }
  keysToOmit.forEach((key) => delete boundProps[key])
  return boundProps
}

onMounted(() => {
  emit('register', unref(elFormRef)?.$parent, unref(elFormRef))
})
</script>

<style lang="scss" scoped>
.form-container {
  /* custom styles for the form */
}
</style>
