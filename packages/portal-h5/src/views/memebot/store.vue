<template>
  <div class="app-page">
    <page-header
      title="Bot Store"
      placeholder="Enter an application name"
      input-area
      @search="onSearch"
    />
    <div class="create-title">
      <span v-show="status ==='create'">{{t('bots.title')}}</span>
      <span v-show="status ==='edit'">{{t('bots.edit_title')}}</span>
    </div>
    <CreateEditForm :editForm="editForm" :status="status"></CreateEditForm>
  </div>
</template>

<script setup>
import { CreateEditForm } from './components/store/index.js';
import { useRoute, useRouter } from 'vue-router';
import { t } from '@gptx/base/i18n';
import { getList } from '@gptx/base/api/assistant-store';
import { ref, reactive, onMounted } from 'vue';
import { getBotInfo } from '@gptx/base/api/application.js';
import { showToast } from 'vant';

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
        console.log('获取到的Meme数据:', data);
        
        // 确保字段正确处理
        editForm.id = data.id;
        editForm.icon = data.icon || '';
        editForm.name = data.name || '';
        editForm.introduction = data.introduction || '';
        
        // 处理classification字段
        if (data.classification) {
          if (Array.isArray(data.classification)) {
            editForm.classification = data.classification;
          } else if (typeof data.classification === 'string') {
            // 如果是字符串，尝试解析JSON
            try {
              const parsedValue = JSON.parse(data.classification);
              editForm.classification = Array.isArray(parsedValue) ? parsedValue : [data.classification];
            } catch (e) {
              // 如果解析失败，则作为单个元素处理
              editForm.classification = [data.classification];
            }
          } else {
            editForm.classification = [data.classification];
          }
        } else {
          editForm.classification = [];
        }
        
        // 确保gender是数字类型
        editForm.gender = data.gender !== undefined && data.gender !== null ? 
          Number(data.gender) : null;
        editForm.symbol = data.symbol || '';
        editForm.twitter = data.twitter || '';
        editForm.telegram = data.telegram || '';
        editForm.website = data.website || '';
        
        console.log('处理后的编辑表单:', { 
          gender: editForm.gender, 
          genderType: typeof editForm.gender,
          classification: editForm.classification,
          symbol: editForm.symbol
        });
      }
    } catch (error){
      showToast({
        message: "Unable to retrieve details for this meme bot.",
        type: "fail",
        position: "top",
      });
      setTimeout(() => {
        router.replace({ path: '/personal' });
      }, 1500);
    }
  }
}

onMounted(async () => {
  await _getMemeDetail();
  onSearch();
});
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
</style>
