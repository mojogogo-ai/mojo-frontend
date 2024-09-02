<template>
  <div class="pt-[52px]">
    <div class="p-3">
      <div
        v-for="publish in publishList"
        class="page-list"
      >
        <el-card
          class="page-list__inner"
          shadow="hover"
        >
          <div class="flex">
            <div class="app-page-col">
              <el-image
                class="page-list-img"
                :src="publish.icon"
              />
            </div>
            <div class="flex-1 app-page-col">
              <div
                class="h-[24px] text-base font-black line-clamp-1"
                :title="publish.title"
              >
                {{ publish.title }}
              </div>
              <div
                class="text-[#7a7a7a] line-clamp-2 my-2 h-[42px]"
                :title="publish.subtitle"
              >
                {{ publish.subtitle }}
              </div>
              <div
                v-if="['website'].includes(publish.name)"
                class="flex"
              >
                <div
                  class="publish-option"
                  @click="openShare"
                >
                  <svg-icon
                    class="mr-[2px] opacity-80"
                    name="option"
                  />
                  {{ t('bots.publish.label.option') }}
                </div>
                <div
                  class="publish-option"
                  @click="onCopy"
                >
                  <svg-icon
                    class="mr-[2px] opacity-80"
                    name="copy"
                  />
                  {{ t('chat.copy') }}
                </div>
                <div
                  class="publish-option"
                  @click="onPreview"
                >
                  <svg-icon
                    class="mr-[2px] opacity-80"
                    name="eye"
                  />
                  {{ t('chat.preview') }}
                </div>
              </div>
              <div
                v-if="['javascript'].includes(publish.name)"
                class="flex"
              >
                <div
                  class="publish-option"
                  @click="openConfig(publish.name)"
                >
                  <svg-icon
                    class="mr-[2px] opacity-80"
                    name="option"
                  />
                  {{ t('bots.publish.label.optionDes') }}
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <website-share
      ref="shareRef"
      :bot-id="botId"
      :option="data"
      @update-option="emits('update-option')"
    />
    <website-configure
      ref="configRef"
      :bot-id="botId"
    />
  </div>
</template>

<script setup>
import { t } from '@gptx/base/i18n';
import { useClipboard } from '@vueuse/core';
import IconWebsite from '@/assets/images/bots/publish/website.svg';
import IconJavascript from '@/assets/images/bots/publish/javascript.svg';
// import IconRobot from '@/assets/images/bots/publish/robot.svg';
import { WebsiteConfigure, WebsiteShare } from './Website/index';

const props = defineProps({
  botId: {
    type: String,
    default: ''
  },
  data: {
    type: Object,
    default: () => ({})
  }
});
const emits = defineEmits(['update-option']);

const publishList = [
  {
    title: t('bots.publish.website'),
    subtitle: t('bots.publish.websiteDes'),
    icon: IconWebsite,
    name: 'website'
  },
  {
    title: t('bots.publish.javascript'),
    subtitle: t('bots.publish.javascriptDes'),
    icon: IconJavascript,
    name: 'javascript'
  }
];
/* ref dom */
const shareRef = ref(null);
const configRef = ref(null);

const openShare = () => {
  shareRef.value.open();
};
const openConfig = (name) => {
  configRef.value.open(name);
};
const onCopy = () => {
  try {
    const { shared_key } = props.data;
    if (shared_key) {
      const { origin, pathname } = window.location;
      let copyText = `bot-shared/${shared_key}`;
      if (copyText) copyText = `${origin}${pathname}#/${copyText}`;
      const { copy, copied } = useClipboard({ copyText, legacy: true });
      copy(copyText);
      if (copied) {
        ElMessage.success(t('bots.bb'));
      } else {
        ElMessage.error(t('chat.copy2'));
      }
    } else {
      ElMessage.warning(t('bots.publish.configured'));
    }
  } catch (error) {
    console.log(error);
  }
};
const onPreview = () => {
  const { shared_key } = props.data;
  if (shared_key) {
    const { origin, pathname } = window.location;
    let url = `${origin}${pathname}#/bot-shared/${shared_key}`;
    window.open(url, '_blank');
  } else {
    ElMessage.warning(t('bots.publish.configured'));
  }
};
</script>
