<template>
  <van-form
    class="cover-form"
    :disabled="disabled || loading"
  >
    <div class="design-form">
      <div class="design-form-item">
        <div class="design-form-title">
          {{ t('bots.label.prologue') }}
          <van-button
            type="primary"
            size="small"
            link
            @click="_generatePrologue"
          >
            <svg-icon
              class="text-xl"
              name="auto"
            />
          </van-button>
        </div>
        <div class="design-form-content">
          <van-field
            v-model="form.prologue"
            type="textarea"
            resize="none"
            bordered
            background
            show-word-limit
            maxlength="50"
            :rows="3"
            :placeholder="t('bots.placeholder.prologue')"
            @blur="_updateConfig('prologue')"
          />
        </div>
      </div>
      <div class="design-form-item">
        <div class="design-form-title">
          {{ t('bots.label.prologuePreset') }}
          <div class="flex items-center text-xl text-[var(--h5-color-primary)]">
            <van-button
              v-if="form.predefined_question.length < 3"
              type="primary"
              icon="plus"
              link
              :disabled="isAddQuestionDisable"
              @click="form.predefined_question.push(''), (isNewAdd = true)"
            />
          </div>
        </div>
        <div
          v-for="(val, i) in form.predefined_question"
          class="design-form-content"
        >
          <div class="relative flex items-center">
            <van-field
              v-model="form.predefined_question[i]"
              class="pb-0"
              type="textarea"
              resize="none"
              maxlength="30"
              clearable
              background
              bordered
              show-word-limit
              :placeholder="t('bots.placeholder.prologuePreset')"
              @blur="_updateConfig('predefined_question')"
            />
            <div class="preset-q2a">
              <van-button
                type="primary"
                link
                @click="_generatePredefinedQuestion(i)"
              >
                <svg-icon
                  style="font-size: 18px"
                  name="auto"
                />
              </van-button>
              <van-button
                link
                @click="form.predefined_question.splice(i, 1), _updateConfig('predefined_question')"
              >
                <van-icon
                  class="input-close"
                  name="delete"
                  style="height: 20px"
                  size="18"
                />
              </van-button>
            </div>
          </div>
        </div>
      </div>
      <div class="design-form-item">
        <div class="design-form-title">
          {{ t('bots.label.suggestion') }}
        </div>
        <div class="design-form-content">
          <van-checkbox
            v-model="form.enable_suggestion"
            class="cover-checkbox"
            shape="square"
            icon-size="16"
            @change="_updateConfig('enable_suggestion')"
          >
            {{ t('bots.placeholder.suggestion') }}
          </van-checkbox>
        </div>
      </div>
      <div class="design-form-item mb-0">
        <div class="design-form-title">
          {{ t('bots.label.voice') }}
        </div>
        <div class="design-form-content flex items-center">
          <span class="mr-[10px]">{{ t('bots.label.isVoice') }}</span>
          <van-switch
            v-model="form.enable_voice"
            size="20"
            @change="_updateConfig('enable_voice')"
          />
        </div>
        <div
          v-if="form.enable_voice"
          class="design-form-content"
        >
          <div class="flex items-center">
            <div
              class="mr-[17px]"
              style="width: 120px"
            >
              <selector
                v-model="form.voice_lang"
                border
                :columns="languageList.map((_) => ({ text: t(`common.language.${_}`), value: _ }))"
                :placeholder="t('bots.placeholder.language')"
                @update:model-value="onChangeLanguage"
              />
            </div>
            <div
              class="mr-[17px]"
              style="width: 120px"
            >
              <selector
                v-model="form.voice_id"
                border
                :columns="voiceList[form.voice_lang]"
                :columns-field-names="{ text: 'narrator', value: 'id' }"
                :placeholder="t('bots.placeholder.voiceType')"
                @update:model-value="_updateConfig('voice_id')"
              />
            </div>
            <van-button
              link
              @click="playAudio"
            >
              <svg-icon
                class="shrink-0 text-[24px] text-[#7a7a7a]"
                :class="{ 'text-[var(--h5-color-primary)]': isPlaying }"
                name="sparker"
              />
            </van-button>
          </div>
        </div>
      </div>
    </div>
  </van-form>
</template>

<script setup>
import { Howl } from 'howler';
import { t } from '@gptx/base/i18n';
import {
  generatePredefinedQuestion,
  generatePrologue,
  getVoiceConfigList,
  updateConfig
} from '@gptx/base/api/application';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  botId: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(['update']);

const loading = ref(false);
const languageList = ref([]);
const voiceList = reactive({
  zh: [],
  en: []
});
const isPlaying = ref(false);
let form = reactive({
  prologue: '',
  predefined_question: [],
  enable_suggestion: false,
  enable_voice: false,
  voice_id: 0,
  voice_lang: ''
});
let formOrigin = {};
let audioContext = null;
const isAddQuestionDisable = computed(() => {
  return (
    !!(
      form.predefined_question.length && form.predefined_question.filter((_) => !_.length || !_.trim().length).length
    ) || isNewAdd.value
  );
});
const isNewAdd = ref(false);

const onChangeLanguage = (value) => {
  form.voice_id = voiceList[value][0].id;
};
const playAudio = () => {
  if (isPlaying.value) {
    audioContext.stop();
    return;
  }
  const { preview_audio } = voiceList[form.voice_lang].find((_) => _.id === form.voice_id);
  audioContext = new Howl({ src: [preview_audio], html5: true });
  isPlaying.value = true;
  audioContext.on('load', () => {
    audioContext.play();
  });
  audioContext.on('stop', () => {
    audioContext = null;
    isPlaying.value = false;
  });
  audioContext.on('end', () => {
    audioContext = null;
    isPlaying.value = false;
  });
};
const _generatePrologue = async () => {
  try {
    loading.value = true;
    const {
      data: { prologue },
      code
    } = await generatePrologue({ app_id: props.botId });
    if (code === 200) {
      form.prologue = prologue;
      _updateConfig('prologue');
    }
    loading.value = false;
  } catch (e) {
    console.log(e);
    loading.value = false;
  }
};
const _generatePredefinedQuestion = async (i) => {
  try {
    loading.value = true;
    const {
      data: { predefined_question },
      code
    } = await generatePredefinedQuestion({ app_id: props.botId });
    if (code === 200) {
      form.predefined_question[i] = predefined_question;
      _updateConfig('predefined_question');
    }
    loading.value = false;
  } catch (e) {
    console.log(e);
    loading.value = false;
  }
};
const _updateConfig = async (key) => {
  try {
    if (JSON.stringify(form[key]) === JSON.stringify(formOrigin[key])) return console.log('nothing changed');
    loading.value = true;
    const params = {
      id: props.botId
    };
    switch (key) {
      case 'enable_voice':
        if (form.enable_voice) {
          params.voice_id = form.voice_id;
        }
        break;
    }
    params[key] = form[key];
    const { code } = await updateConfig(params);
    if (code === 200) {
      emits('update');
    }
    loading.value = false;
  } catch (e) {
    console.log(e);
    loading.value = false;
  }
};
const _getVoiceConfigList = async () => {
  try {
    const {
      data: { list },
      code
    } = await getVoiceConfigList();
    if (code === 200) {
      const keys = Object.keys(list);
      languageList.value = keys;
      keys.forEach((key) => {
        voiceList[key] = list[key];
      });
    }
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => props.data,
  (val) => {
    for (const key in form) {
      if (Object.hasOwnProperty.call(form, key)) {
        form[key] = val[key];
      }
    }
    formOrigin = JSON.parse(JSON.stringify(val));
    isNewAdd.value = false;
  }
);
onMounted(() => {
  _getVoiceConfigList();
});
</script>

<style lang="scss" scoped>
.input-close {
  color: var(--van-danger-color);
}

.pb-0 {
  &.van-field {
    &.van-cell {
      margin-bottom: 0;
    }
  }
}

.preset-q2a {
  position: absolute;
  left: 6px;
  bottom: -2px;
}
</style>
