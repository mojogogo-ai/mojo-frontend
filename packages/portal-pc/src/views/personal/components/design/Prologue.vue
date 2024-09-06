<template>
  <el-scrollbar class="h-full">
    <el-form
      :disabled="disabled || loading"
      @submit.prevent
    >
      <div class="design-form">
        <div class="design-form-item">
          <div class="design-form-title">
            {{ t('bots.label.prologue') }}
            <el-button
              type="primary"
              link
              @click="_generatePrologue"
            >
              <svg-icon
                class="text-xl"
                name="auto"
              />
            </el-button>
          </div>
          <div class="design-form-content">
            <el-input
              v-model="form.prologue"
              type="textarea"
              resize="none"
              maxlength="50"
              show-word-limit
              :rows="3"
              :placeholder="t('bots.placeholder.prologue')"
              @blur="_updateConfig('prologue')"
            />
          </div>
        </div>
        <div class="design-form-item">
          <div class="design-form-title">
            {{ t('bots.label.prologuePreset') }}
            <div class="flex items-center text-xl text-[var(--el-color-primary)]">
              <el-button
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
            <div class="flex items-center">
              <el-input
                v-model="form.predefined_question[i]"
                size="large"
                maxlength="30"
                show-word-limit
                :placeholder="t('bots.placeholder.prologuePreset')"
                clearable
                @blur="_updateConfig('predefined_question')"
              />
              <div class="ml-1">
                <el-button
                  type="primary"
                  link
                  @click="_generatePredefinedQuestion(i)"
                >
                  <svg-icon
                    class="text-xl"
                    name="auto"
                  />
                </el-button>
              </div>
              <div class="ml-1">
                <el-button
                  link
                  @click="form.predefined_question.splice(i, 1), _updateConfig('predefined_question')"
                >
                  <div class="input-close">
                    <el-icon
                      class="text-[var(--el-color-white)]"
                      size="10"
                    >
                      <SemiSelect />
                    </el-icon>
                  </div>
                </el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="design-form-item">
          <div class="design-form-title">
            {{ t('bots.label.suggestion') }}
          </div>
          <div class="design-form-content">
            <el-checkbox
              v-model="form.enable_suggestion"
              size="large"
              :label="t('bots.placeholder.suggestion')"
              @change="_updateConfig('enable_suggestion')"
            />
          </div>
        </div>
        <div class="design-form-item">
          <div class="design-form-title">
            {{ t('bots.label.voice') }}
          </div>
          <div class="design-form-content">
            <span class="mr-[10px]">{{ t('bots.label.isVoice') }}</span>
            <el-switch
              v-model="form.enable_voice"
              size="large"
              @change="_updateConfig('enable_voice')"
            />
          </div>
          <div
            v-if="form.enable_voice"
            class="design-form-content"
          >
            <div class="flex items-center">
              <el-select
                v-model="form.voice_lang"
                class="mr-[17px]"
                style="width: 120px"
                size="large"
                :placeholder="t('bots.placeholder.language')"
                @change="onChangeLanguage"
              >
                <el-option
                  v-for="lang in languageList"
                  :value="lang"
                  :label="t(`common.language.${lang}`)"
                />
              </el-select>
              <el-select
                v-model="form.voice_id"
                class="mr-[17px]"
                style="width: 120px"
                size="large"
                :placeholder="t('bots.placeholder.voiceType')"
                @change="_updateConfig('voice_id')"
              >
                <el-option
                  v-for="voice in voiceList[form.voice_lang]"
                  :value="voice.id"
                  :label="voice.narrator"
                />
              </el-select>
              <el-button
                link
                @click="playAudio"
              >
                <svg-icon
                  class="shrink-0 text-[24px]"
                  :class="{ 'text-[var(--el-color-primary)]': isPlaying }"
                  name="sparker"
                />
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-form>
  </el-scrollbar>
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
  display: flex;
  align-items: center;
  justify-content: center;
  height: 16px;
  width: 16px;
  background-color: var(--el-color-danger);
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    opacity: 0.88;
  }
}

.el-checkbox {
  align-items: flex-start;
  white-space: wrap;
}
</style>
