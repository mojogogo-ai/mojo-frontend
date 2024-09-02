import request from '@gptx/base/utils/request';

// get list category
export const getListCategory = (params) =>
  request({
    url: '/portal/store/list-category',
    method: 'get',
    params
  });

// get list
export const getList = (params) =>
  request({
    url: '/portal/store/list-app',
    method: 'get',
    params
  });