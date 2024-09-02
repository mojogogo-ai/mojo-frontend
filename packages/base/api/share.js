import request from '@gptx/base/utils/request.js';

// web share anonymous
export function webShareAnonymous(data) {
  return request({
    url: '/portal/web-share/anonymous',
    method: 'POST',
    data
  });
}

// web share verification password
export function webShareVerification(data) {
  return request({
    url: '/portal/web-share/verification',
    method: 'POST',
    data
  });
}

// web share chat detail
export function getWebShareChatDetail(params) {
  return request({
    url: '/portal/web-share/chat-detail',
    method: 'GET',
    params
  });
}

// web share clear chat 
export function shareNewSession(data) {
  return request({
    url: '/portal/web-share/new-session',
    method: 'POST',
    data
  });
}