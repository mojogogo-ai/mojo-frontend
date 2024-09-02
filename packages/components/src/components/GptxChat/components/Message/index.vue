<script setup>
import AvatarComponent from './Avatar.vue'
import TextComponent from './Text.vue'
import { useClipboard } from '@vueuse/core'
import { t } from '@gptx/base/i18n'
import prologueBotImg from '@/assets/images/bot.png';
import { isMobi } from '@gptx/base'

import { filesize } from 'filesize';
import IconHtml from '@/assets/images/base/upload/html.svg';
import IconMd from '@/assets/images/base/upload/md.svg';
import IconPdf from '@/assets/images/base/upload/pdf.svg';
import IconTxt from '@/assets/images/base/upload/txt.svg';
import IconExcel from '@/assets/images/base/upload/xls.svg';
import IconDoc from '@/assets/images/base/upload/doc.svg';
import IconCsv from '@/assets/images/base/upload/csv.svg';
const docIcons = {
  '.pdf': IconPdf,
  '.doc': IconDoc,
  '.docx': IconDoc,
  '.txt': IconTxt,
  '.html': IconHtml,
  '.md': IconMd,
  '.xls': IconExcel,
  '.xlsx': IconExcel,
  '.csv': IconCsv
};

const props = defineProps({
  text: {
    type:String,
    default:''
  },
  inversion: Boolean,
  error: Boolean,
  loading: Boolean,
  isPrologue: Boolean,
  predefinedQuestion: {
    type:Array,
    default:()=>[]
  },
  suggestedQuestion: {
    type:Array,
    default:()=>[]
  },
  isGood: {
    type:Number,
    default:1
  },
  lastFlag: Boolean,
  isHome: {
    type:Boolean,
    default: false
  },
  conversationOptions: {
    type: Object,
    default: null
  },
})

const emit = defineEmits(['ealuate', 'regenerateAgain', 'predefinedQuestionHandle'])
const textRef = ref()
const asRawText = ref(props.inversion)
const messageRef = ref()
function handleRegenerate () {
  messageRef.value?.scrollIntoView()
  emit('regenerateAgain')
}

function handleCopy () {
  let copyText = props.text || ''
  const { copy, copied } = useClipboard({ copyText })
    copy(copyText)
    if (copied) {
      ElMessage.success(t("bots.bb"));
    } else {
      ElMessage.error(t('chat.copy2'))
    }
}

function handleeEaluate (bol) { // 点赞
  emit('ealuate', bol)
}
// 预置问题--触发
const predefinedQuestionCall = ((i)=>{
  emit('predefinedQuestionHandle',i)
})

const isCn = computed(() => {
  return  window.SITE_TYPE && window.SITE_TYPE === '2'
});

const callToolPending = computed(() => {
  let bol = props.conversationOptions && props.conversationOptions.extendsData && props.conversationOptions.extendsData.call_tool_pending
  if (bol) {
    return props.conversationOptions.extendsData.call_tool_pending
  } else {
    return null
  }
});

const filetList = computed(() => {
  let bol = props.conversationOptions && props.conversationOptions.refs && props.conversationOptions.refs
  if (bol) {
    return props.conversationOptions.refs
  } else {
    return []
  }
});
</script>

<template>
  <div
    ref="messageRef"
    class="flex w-full mb-4 overflow-hidden "
    :class="[{ 'mt-5': isPrologue }]"
  >
    <div
      v-if="!isMobi()"
      class="mr-2 basis-8"
      :style="{ 'margin-top': isHome ? '78px' : '13px' }"
    >
      <AvatarComponent :inversion="inversion" />
    </div>
    <div
      class="items-start overflow-hidden text-sm"
      style="max-width: 100%;"
    >
      <!-- 开场白样式特别处理 -->
      <div
        v-if="isHome && !isMobi()"
        class="prologue-preview"
      >
        <span class="prologue-content"> {{ isCn ? $t('chat.tip2_cn'):$t('chat.tip2') }}</span>
        <img
          class="prologue-preview-img"
          :src="prologueBotImg"
          alt=""
        >
      </div>
      <!--  items-end -->
      <div
        class="flex flex-col gap-1 mt-2"
      >
        <TextComponent
          ref="textRef"
          :inversion="inversion"
          :error="error"
          :text="text"
          :loading="loading"
          :as-raw-text="asRawText"
          :predefined-question="predefinedQuestion"
          @predefined-question-handle="predefinedQuestionCall"
        />
        <div v-if="filetList.length" class="flex flex-wrap  w-full p-2 mt-2 rounded-lg align-center bg-[#fff]">
          <div v-for="file in filetList" class="relative flex items-center m-1 rounded-lg bg-[#F6F7F9] p-4">
            <img
              style="width: 20px;height: 20px;"
              :src="docIcons[/\.[^\.]+$/.exec(file.file_name)[0].toLocaleLowerCase()]"
            >
            <div class="flex flex-col justify-center h-full px-2 text-xs">
              <div
                class="truncate max-w-36 min-w-18"
                :title="file.file_name"
              >
                {{ file.file_name }}
              </div>
              <div class="mt-1">
                {{ filesize(file.file_size) }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="callToolPending&&callToolPending.loading" class="mt-2 text-xs">
          {{ callToolPending.message }}
        </div>
        
        <div
          v-if="!loading"
          class="flex flex-row self-end gap-2 mt-1"
        >
          <div
            v-if="!inversion && !isPrologue && lastFlag"
            class="mb-2 shadow-[0px_3px_6px_1px_rgba(0,0,0,0.16)] rounded-[50%] transition cursor-pointer text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-300"
            :title="$t('chat.operate_3')"
            @click="handleRegenerate"
          >
            <el-button native-color="#000" native-color-hover="#066BE9" size="small" circle plain><el-icon><RefreshRight /></el-icon></el-button>
          </div>
          <div
            v-if="!isPrologue&&!inversion"
            class="mb-2 shadow-[0px_3px_6px_1px_rgba(0,0,0,0.16)] rounded-[50%] transition cursor-pointer text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-300"
            :title="$t('chat.copy')"
            @click="handleCopy"
          >
            <el-button native-color="#000" native-color-hover="#066BE9" size="small" circle plain><el-icon><CopyDocument /></el-icon></el-button>
          </div>
          <div v-if="!inversion && !isPrologue">
            <el-button native-color="#000" native-color-hover="#066BE9" size="small" circle plain class="button-class shadow-[0px_3px_6px_1px_rgba(0,0,0,0.16)] rounded-[50%]" :style="{'background' :isGood===2? '#066BE9':''}" @click="handleeEaluate(true)">
              <i
                :style="{'color':isGood===2?'#fff':''}"
                class="mb-2 transition cursor-pointer icon-zan text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-300 iconfont icon-dianzan"
                style="margin-left: 1px;margin-top:6px;"
              />
            </el-button>
            <el-button native-color="#000" native-color-hover="#066BE9" size="small" circle plain class="button-class mr-1 shadow-[0px_3px_6px_1px_rgba(0,0,0,0.16)] rounded-[50%]" :style="{'background':isGood===3?'#066BE9':''}" @click="handleeEaluate(false)">
              <i
                :style="{'color':isGood===3?'#fff':''}"
                class="mb-2 transition cursor-pointer icon-zan text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-300 iconfont icon-dianzan-down"
                style="margin-top:10px;"
              />
            </el-button>
          </div>
        </div>
        <!-- suggested question -->
        <div v-if="lastFlag&&!loading&&suggestedQuestion.length">
          <el-text>{{ $t('chat.tip3') }}</el-text>
          <div class="flex flex-col items-start">
            <div v-for="(i,index) in suggestedQuestion" :key="index" class="suggested-question" @click="predefinedQuestionCall(i)">
              {{ i }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-button+.el-button){
  margin-left: 7px;
}
.prologue-content{
  font-weight: bold;
  font-size: 16px;
  color: #36353A;
}
.icon-zan{
  color:#000;
}
.suggested-question{
  padding: 8px;
  margin: 4px 0;
  background: #FFFFFF;
  border: 1px solid #E6E5E9;
  border-radius: 14px;
  font-weight: 400;
  font-size: 14px;
  color: #7A7A7A;
  cursor: pointer;
  &:hover{
    opacity: 0.8;
  }
}
.prologue-preview {
  position: relative;
  display: flex;
  align-items: flex-end;
  height: 62px;
  width: fit-content;

  &-img {
    position: absolute;
    bottom: -8px;
    right: -132px;
    width: 105px;
    height: 62px;
  }
}
</style>
