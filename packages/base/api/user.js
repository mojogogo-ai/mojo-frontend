import request from '@gptx/base/utils/request';

// 更新用户信息
export function updateUserInfo(data) {
  return request({
    url: '/portal/user/update',
    method: 'post',
    data
  });
}


// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/portal/draft/upload-bot-icon',
    method: 'post',
    headers: {
      'Content-Type': 'application/form-data'
    },
    data
  });
}

// user avatar upload
export function userAvatarUpload(data, config) {
  return request({
    url: '/portal/user/upload',
    method: 'post',
    headers: {
      'Content-Type': 'application/form-data'
    },
    data,
    ...config
  });
}
