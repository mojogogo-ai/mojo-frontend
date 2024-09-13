import request from '@gptx/base/utils/request';

// get list
export const getList = (params) =>
  request({
    url: '/v1/bot/list',
    method: 'get', 
    params
  });