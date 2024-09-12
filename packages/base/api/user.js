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

// get user info
export function getUserInfo(token) {
  return request({
    url: '/v1/user/info',
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + token
    }
  });
}

// confirm user invite
export function confirmUserInvite(data) {
  return request({
    url: '/v1/user/invited',
    method: 'post',
    data
  });
}
