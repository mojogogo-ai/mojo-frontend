
import request from '@gptx/base/utils/request';

export const getTokenCreate = (data) =>
request({
    url: '/v1/dapp/token/create',
    method: 'post',
    data
});

// bot meme create
export const memeCreate = (data) =>
request({
    url: '/v1/bot/meme-create',
    method: 'post',
    data
});

//check bot meme state
export function memeCheck(params) {
    return request({
      url: '/v1/bot/meme-check',
      method: 'get',
      params
    });
}

// update bot meme state
export function memePaid(data) {
    return request({
      url: '/v1/bot/meme-paid',
      method: 'post',
      data
    });
}

// bot meme list
export function memeList(params) {
    return request({
      url: '/v1/bot/meme-list',
      method: 'get',
      params
    });
}