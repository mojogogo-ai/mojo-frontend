import request from '@gptx/base/utils/request';

//generate icon
export const generateKnowledgeIcon = (data) =>
  request({
    url: '/portal/draft/generate-bot-icon',
    method: 'post',
    data
  });

// 创建知识库
export const createKnowledgeBase = (data) =>
  request({
    url: '/portal/knowledge/create',
    method: 'put',
    data
  });

// 知识库列表
export const findKnowledgeList = (name) =>
  request({
    url: `/portal/knowledge/list?name=${name}`,
    method: 'get'
  });

// 获取知识库下所有文件（不分页）
export const findAllDocsList = (data) =>
  request({
    url: `/portal/knowledge/doc-list`,
    method: 'get',
    params: data
  });

// 知识库详情
export const getKnowledgeDetail = (id) =>
  request({
    url: `/portal/knowledge/info`,
    method: 'get',
    params: {
      id
    }
  });

// 知识库更新
export const updateKnowledge = (data) =>
  request({
    url: '/portal/knowledge/update',
    method: 'post',
    data
  });

// 知识库删除
export const handleRemoveKnowledge = (id) =>
  request({
    url: '/portal/knowledge/delete',
    method: 'delete',
    params: {
      id
    }
  });

// 知识库文档列表
export const findKnowledgeFileList = (data) =>
  request({
    url: '/portal/knowledge-detail/list',
    method: 'get',
    params: data
  });

// knowledge doc file save
export const saveKnowledgeDocFiles = (params) =>
  request({
    url: '/portal/knowledge/doc-file-save',
    method: 'post',
    params
  });

// 删除已经上传的知识库文档
export const removeKnowledgeDoc = (data) =>
  request({
    url: '/portal/knowledge/doc-remove',
    method: 'delete',
    data
  });

// 解析知识库文档重试
export const resolverKnowledgeDoc = (data) =>
  request({
    url: '/portal/knowledge/doc-file-parsing',
    method: 'post',
    data
  });

// 文档启用
export const docAvailable = (data) =>
  request({
    url: '/portal/knowledge/doc-available',
    method: 'post',
    data
  });

// 文档下载
export const downloadDocSample = (data) =>
  request({
    url: '/portal/knowledge/doc-sample',
    method: 'get',
    data,
    responseType: 'blob'
  });

// 搜索测试
export const searchTest = (params) =>
  request({
    url: '/portal/knowledge/doc-search',
    method: 'get',
    params
  });

// segment QA list
export const docSegmented = (params) =>
  request({
    url: '/portal/knowledge/doc-segment',
    method: 'GET',
    params
  });

// segment QA save
export const docUpdatedSegmented = (data) =>
  request({
  url: '/portal/knowledge/doc-segment',
  method: 'POST',
  data
});
// segment DELETE
export const docDeleteSegmented = (data) =>
  request({
  url: '/portal/knowledge/doc-segment',
  method: 'DELETE',
  data
});
// segment add
export const docAddSegmented = (data) =>
  request({
  url: '/portal/knowledge/doc-segment',
  method: 'PUT',
  data
});