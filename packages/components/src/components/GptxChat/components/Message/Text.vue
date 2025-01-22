<script setup>
import MarkdownIt from 'markdown-it'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'
import { useClipboard } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  inversion: Boolean,
  error: Boolean,
  text: {
    type: String,
    default: ''
  },
  predefinedQuestion: {
    type:Array,
    default:()=>[]
  },
  loading: Boolean,
  asRawText: Boolean
})



const isMobile = ref(false)
const emit = defineEmits(['predefinedQuestionHandle']);
const textRef = ref()

const mdi = new MarkdownIt({
  html: false,
  linkify: true,
  highlight (code, language) {
    const validLang = !!(language && hljs.getLanguage(language))
    if (validLang) {
      const lang = language ?? ''
      return highlightBlock(hljs.highlight(code, { language: lang }).value, lang)
    }
    return highlightBlock(hljs.highlightAuto(code).value, '')
  }
})
const defaultRender = mdi.renderer.rules.link_open   
    || function(tokens, idx, options, env, self) {  
        return self.renderToken(tokens, idx, options);  
};  
mdi.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    // 在所有链接上添加 target="_blank" 和 rel="noopener noreferrer"  
    tokens[idx].attrPush(['target', '_blank']);  
    tokens[idx].attrPush(['rel', 'noopener noreferrer']);  
    
    // 调用默认渲染器或原渲染规则，完成其他渲染逻辑  
    return defaultRender(tokens, idx, options, env, self); 
  };



mdi.use(mila, [{
  matcher(href) {
    return href.startsWith("/app-design/");
  },
  attrs: {
    target: '_blank',
    rel: 'noopener',
    class:'app-design',
  }}
])

const wrapClass = computed(() => {
  return [
    isMobile.value ? 'p-2' : 'px-3 py-2',
    props.inversion ? 'message-request' : 'message-reply',
    props.inversion ? 'text-[#fff]': 'text-[#fff]',
    { 'text-red-500': props.error }
  ]
})
const predefinedQuestion2 = computed(() => {
  return props.predefinedQuestion.filter(i => !!i.content)
})
const text = computed(() => {
  const value = props.text ?? ''
  if (!props.asRawText) { return mdi.render(value) }
  return value
})
console.log("test",text)
function highlightBlock (str, lang) {
  return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">${t('chat.copyCode')}</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`
}

function textEventHandler(event){
  const classList = event.target.classList
  const parentElement = event.target.parentElement
  // code copy
  if (classList.contains("code-block-header__copy")) {
    const code = parentElement?.nextElementSibling?.textContent;
    if (code) {
      const { copy, copied } = useClipboard({ code });
      copy(code);
      if (copied) {
        ElMessage.success(t("bots.bb"));
      } else {
        ElMessage.error(t('chat.copy2'));
      }
    }
  }

  // create bot link
  if (classList.contains("app-design")) {
    event.preventDefault()
    let sourceHref =  event.target.href
    if (sourceHref.includes("/app-design/")) {
      let curURL = new URL(window.location)
      let appId =  sourceHref.split('/app-design/')
      let newHref = `${curURL.origin}${curURL.pathname}#/design/${appId[1]}`
      window.open(newHref)
    }
  }
}

const testString1 = props.text
// 预置问题--触发
const predefinedQuestionHandle = ((i)=>{
  emit('predefinedQuestionHandle',i)
})
</script>

<template>
  <div
    class="text-wrap min-w-[20px] rounded-[12px] text-white"
    :class="wrapClass"
    :style="{
      background: inversion?'#E0FF3180':'#FFFFFF26',
      border: inversion ? '1px solid #E0FF3180' : '1px solid #FFFFFF1A'
    }"
  >
    <div
      ref="textRef"
      class="leading-relaxed break-words"
    >
      <!-- 答 -->
      <div v-if="!inversion">
        
        <div
          v-if="!asRawText"
          class="markdown-body"
          @click="textEventHandler($event)"
          v-html="text"
        />
        <div
          v-else
          class="whitespace-pre-wrap"
          v-text="text"
        />
        <!-- 开场白预置问题 -->
        <div class="flex flex-col items-start">
          <div v-for="(i,index) in predefinedQuestion2" :key="index" class="predefined-question">
            <div class="dot" />
            <div @click="predefinedQuestionHandle(i.content)">{{ i.content }}</div>
          </div>
        </div>
      </div>
      <!-- 问 -->
      <div
        v-else
        class="whitespace-pre-wrap"
        v-text="text"
      />
    </div>
    <div v-if="loading&&!text" class="loader" />
  </div>
</template>

<style lang="scss" scoped>
.predefined-question{
  margin: 2px 0;
  font-weight: 400;
  font-size: 14px;
  color: #066BE9;
  cursor: pointer;
  display: flex;
  &:hover{
    opacity: 0.8;
  }
  .dot{
    flex-shrink: 0;
    width: 6px;
    height: 6px;
    background: #A4A4A4;
    border-radius: 50%;
    margin:8px 8px 0;
  }
}
.loader {
  border-color: transparent;
  width: 25px;
  aspect-ratio: 4;
  --_g: no-repeat radial-gradient(circle closest-side,#ffffff 90%,#ffffff00);
  background:
    var(--_g) 0 50%,
    var(--_g) 50%  50%,
    var(--_g) 100% 50%;
  background-size: calc(100%/3) 100%;
  animation: l7 1s infinite linear;
}
@keyframes l7 {
    33%{background-size:calc(100%/3) 0,calc(100%/3) 100%,calc(100%/3) 100%}
    50%{background-size:calc(100%/3) 100%,calc(100%/3) 0,calc(100%/3) 100%}
    66%{background-size:calc(100%/3) 100%,calc(100%/3) 100%,calc(100%/3) 0
    }
}
</style>

<style lang="scss">
.text-red-500 .markdown-body{
  color: red !important;
}
.markdown-body {
background-color: transparent;
font-size: var(--font-size-14);
color: white;

p {
  white-space: pre-wrap;
}

ol {
  list-style-type: decimal;
}

ul {
  list-style-type: disc;
}

li {
  list-style: inherit;
}

pre code,
pre tt {
  line-height: 1.65;
}

code.hljs {
  padding: 0;
}

.code-block {
  &-wrapper {
    position: relative;
    padding-top: 24px;
  }

  &-header {
    position: absolute;
    top: 5px;
    right: 0;
    width: 100%;
    padding: 0 1rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #b3b3b3;

    &__copy {
      cursor: pointer;
      margin-left: 0.5rem;
      user-select: none;

      &:hover {
        color: #65a665;
      }
    }
  }
}

}

@media screen and (max-width: 533px) {
.markdown-body .code-block-wrapper {
  padding: unset;
  code {
    padding: 24px 16px 16px 16px;
  }
}
}
</style>
