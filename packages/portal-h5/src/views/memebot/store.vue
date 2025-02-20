<template>
  <div class="app-page">
    <page-header
      :title="t('menu.ass')"
      :placeholder="t('store.placeholder.name')"
      input-area
      @search="onSearch"
    />
<!--    <div class="create-title">-->
<!--      <span v-show="status ==='create'">{{t('bots.title')}}</span>-->
<!--      <span v-show="status ==='edit'">{{t('bots.edit_title')}}</span>-->
<!--    </div>-->
<!--    <div v-show="status ==='create'" class="tab-container mb-[40px]">-->
<!--      <button @click="tabClick('form')" :class="['tab-button',{ 'selected': tab ==='form'}]">-->
<!--        {{t('bots.bot_form')}}-->
<!--      </button>-->
<!--      <button @click="tabClick('ai')" :class="['tab-button',{ 'selected': tab ==='ai' }]">-->
<!--        {{t('bots.bot_ai')}}-->
<!--      </button>-->
<!--    </div>-->
<!--    <CreateEditForm v-show="tab === 'form'" :editForm="editForm" :status="status"></CreateEditForm>-->
<!--    <CreateAi v-show="tab === 'ai'"></CreateAi>-->
    <div class="text-center mt-[200px] text-[24px]">
      Please use a PC to create your own meme coin.
    </div>
  </div>
</template>

<script setup>
import { CreateEditForm, CreateAi } from './components/store/index.js';
import { useRoute } from 'vue-router';
import { t } from '@gptx/base/i18n';
import { getList } from '@gptx/base/api/assistant-store';
import { ref } from 'vue';
import { getBotInfo } from '@gptx/base/api/application.js';
import { ElMessage } from 'element-plus';

const router = useRouter();
const __data = reactive({
  storeList: []
});
let isLoadMore = true;
let timer = null;
const isLoading = ref(true);
/* ref dom */
const scrollbar = ref(null);

const onSearch = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  timer = setTimeout(() => {
    isLoadMore = true;
    __data.storeList = [];
    isLoading.value = true;
    getStoreList();
  }, 300);
};
const getStoreList = async () => {
  if (!isLoadMore) return;
  try {
    const { code, data } = await getList({
    });
    if (code === 200) {
      const {
        list,
        total
      } = data;
      __data.storeList.push(...list);
      if (__data.storeList.length >= total) {
        isLoadMore = false;
      }
    }
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  } catch (error) {
    console.log(error);
  }
};
const route = useRoute();
const id = route.query.id;
const status = ref('create'); // create，edit

const editForm = reactive({
  id: '',
  icon: '',
  name: '',
  introduction: '',
  classification: [],
  gender: null,
  symbol: '',
  twitter: '',
  telegram: '',
  website: '',
})
const _getMemeDetail = async () => {
  if (id) {
    status.value = 'edit';
    try {
      const { code, data } = await getBotInfo({
        id: id
      });
      if (code === 200) {
        editForm.id = data.id;
        editForm.icon = data.icon;
        editForm.name = data.name;
        editForm.introduction = data.introduction;
        editForm.classification = data.classification;
        editForm.gender = data.gender
        editForm.symbol = data.symbol;
        editForm.twitter = data.twitter;
        editForm.telegram = data.telegram;
        editForm.website = data.website;
      }
    } catch (error){
      ElMessage.error(t('bots.error.getDetail'));
    } finally {

    }
  }
}
_getMemeDetail();


onMounted(async () => {
  onSearch();
});

// up up up
const tab = ref('form');

const tabClick = (value) => {
  tab.value = value
}
</script>

<style lang="scss" scoped>
.app-page{
  color: #fff
}
.create-title {
  text-align: center;
  margin-top: 26px;
  margin-bottom: 20px;
  font-family: TT Norms Pro;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 23px; /* 115% */
  color: #e1ff01;
}

.tab-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 8px;
  .tab-button {
    font-family: TT Norms Pro;
    font-weight: 500;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    gap: 0px;
    border-radius: 48px;
    opacity: 1;
    background-color: #FFFFFF1A;
    border: none;
    cursor: pointer;
    outline: none;
    color: rgba(255, 255, 255, 0.70);
    text-align: center;
    font-size: 14px;
    font-style: normal;
    line-height: 23px; /* 164.286% */
    display: flex;
    width: 160px;
    height: 40px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
  }
  .selected {
    background: #E0FF31;
    color: #000;
  }
}
</style>
