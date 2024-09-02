<template>
  <el-dialog
    v-model="dialogVisible"
    :width="isMobi()?'98%':650"
    destroy-on-close
  >
    <template #header>
      <div class="text-base font-bold text-left">
        {{ $t("chat.dl1") }}
      </div>
    </template>
    <el-checkbox-group
      v-model="form.tapType"
      class="grid grid-cols-2 gap-6 mb-[20px]"
      :class="{'grid-cols-1':isMobi(),'grid-cols-2':!isMobi()}"
    >
      <el-checkbox
        v-for="item in dlArr"
        :key="item.value"
        :value="item.value"
        :style="{width: isMobi()?'100%':'220px'}"
        :border="!isMobi()"
      >
        {{ item.label }}
      </el-checkbox>
    </el-checkbox-group>
    <el-input
      v-model.trim="form.content"
      :placeholder="$t('chat.dl7')"
      type="textarea"
      :rows="3"
      resize="none"
      maxlength="500" show-word-limit
    />
    <div class="mt-[20px]">{{ $t("chat.dl8") }}</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          :disabled="form.tapType.length == 0 && !form.content"
          @click="handleCommit()"
        >
          {{ $t("user.submit") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { t } from "@gptx/base/i18n";
import { isMobi } from '@gptx/base'
var dialogVisible = ref(false);
const emit = defineEmits(["DislikeSubmit"]);
const form = ref({
  tapType: [],
  content: "",
});
const dlArr = ref([
  {
    label: t("chat.dl2"),
    value: "1",
  },
  {
    label: t("chat.dl3"),
    value: "2",
  },
  {
    label: t("chat.dl4"),
    value: "3",
  },
  {
    label: t("chat.dl5"),
    value: "4",
  },
  {
    label: t("chat.dl6"),
    value: "5",
  },
]);

function show() {
  dialogVisible.value = !dialogVisible.value;
  form.value.tapType = [];
  form.value.content = "";
}

function handleCommit() {
  emit("DislikeSubmit", form.value);
}

defineExpose({ show });
</script>