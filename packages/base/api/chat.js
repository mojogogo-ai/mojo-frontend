import request from '@gptx/base/utils/request';
// chat detail
export const chatDetail = (params) =>
  request({
    url: '/portal/chat/detail',
    method: 'get',
    params
});

// clear chat
export const chatNewSession = (data) =>
    request({
    url: '/portal/chat/new-session',
    method: 'post',
    data
});

// get store app detail info
export const getStoreAppDetail = (params) =>
    request({
    url: '/portal/store/app-detail-info',
    method: 'get',
    params
});

// store app copy
export const storeAppCopy = (data) =>
    request({
    url: '/portal/store/app-copy',
    method: 'put',
    data
});
