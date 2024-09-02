import request from '@gptx/base/utils/request';

// app delete
export function appDelete(data) {
  return request({
    url: '/portal/app/delete',
    method: 'delete',
    data
  });
}

// app list
export function getAppList(params) {
  return request({
    url: '/portal/app/list',
    method: 'get',
    params
  });
}

// evaluate
export function evaluateApi(data) {
  return request({
    url: '/portal/chat/evaluate',
    method: 'post',
    data
  });
}

// get app categories
export function getAppCategory(params) {
  return request({
    url: '/portal/app/list-category',
    method: 'get',
    params
  });
}

// quick create app
export function quickCreateApp(data) {
  return request({
    url: '/portal/app/quick-create',
    method: 'put',
    data
  });
}

// get app base info
export function getAppInfo(params) {
  return request({
    url: '/portal/app/info',
    method: 'get',
    params
  });
}

// update app base info
export function updateAppInfo(data) {
  return request({
    url: '/portal/app/simple-update',
    method: 'post',
    data
  });
}

// get bot analyze static data
export function getAnalyzeData(params) {
  return request({
    url: '/portal/app/data-chart-line',
    method: 'get',
    params
  });
}

// get bot detail info
export function getBotDetail(params) {
  return request({
    url: '/portal/app/detail-info',
    method: 'get',
    params
  });
}

// update edit configurations
export function updateConfig(data) {
  return request({
    url: '/portal/app/detail-update',
    method: 'post',
    data
  });
}

// get voice config list
export function getVoiceConfigList(params) {
  return request({
    url: '/portal/voice/list-config',
    method: 'get',
    params
  });
}

// generate prompt
export function generatePrompt(params) {
  return request({
    url: '/portal/conversation/generate-prompt',
    method: 'get',
    params
  });
}

// generate prologue
export function generatePrologue(params) {
  return request({
    url: '/portal/draft/generate-prologue',
    method: 'get',
    params
  });
}

// generate predefined question
export function generatePredefinedQuestion(params) {
  return request({
    url: '/portal/draft/generate-predefined-question',
    method: 'get',
    params
  });
}

// get support llm
export function getSupportLLM(params) {
  return request({
    url: '/portal/app/support-llm',
    method: 'get',
    params
  });
}

// get bind knowledge list
export function getBindKnowledgeList(params) {
  return request({
    url: '/portal/app/knowledge-list',
    method: 'get',
    params
  });
}

// bind knowledge
export function bindKnowledge(params) {
  return request({
    url: '/portal/app/knowledge-bind',
    method: 'post',
    data: params
  });
}

// get app publish info
export function getAppPublishInfo(params) {
  return request({
    url: '/portal/app/publish-info',
    method: 'get',
    params
  });
}

// configure web share
export function configureWebShare(data) {
  return request({
    url: '/portal/app/configure-web-share',
    method: 'post',
    data
  });
}

// configure store share
export function configureStoreShare(data) {
  return request({
    url: '/portal/app/configure-store-share',
    method: 'post',
    data
  });
}

// configure social share
export function configureSocialShare(data) {
  return request({
    url: '/portal/app/configure-social-share',
    method: 'post',
    data
  });
}

//confirm publish app
export function confirmPublishApp(data) {
  return request({
    url: '/portal/app/confirm-publish',
    method: 'post',
    data
  });
}

//remove publish app
export function removePublishApp(data) {
  return request({
    url: '/portal/app/remove-publish',
    method: 'delete',
    data
  });
}