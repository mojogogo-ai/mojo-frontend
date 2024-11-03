import request from '@gptx/base/utils/request';

// 更新用户信息
export function updateUserInfo(data) {
  return request({
    url: '/v1/user/update',
    method: 'post',
    data
  });
}

// updatePersonalInfo
export function updatePersonalInfo(data) {
  return request({
    url: '/v1/user/update-personal-info',
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

//generate icon
export const generateAvatarIcon = (data) =>
  request({
    url: '/v1/user/generate-icon',
    method: 'post',
    data
  });

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

// oss 
export function getOssPresignedUrl(params) {
  return request({
    url: '/v1/oss/presigned-url',
    method: 'get',
    params
  });
}
// oss v2 /portal/v1/oss/upload/presignUrl
export function getOssPresignedUrlV2(params) {
  return request({
    url: '/v1/oss/upload/presign-url',
    method: 'get',
    params,
    // headers: {
    //   Authorization: 'Bearer ' + token
    // }
  });
}
// /portal/v1/oss/get/presign-url
export function getOssUrlV2(params) {
  return request({
    url: '/v1/oss/get/presign-url',
    method: 'get',
    params
  });
}

// /portal/v1/user/cancel
export function cancelUser(data) {
  return request({
    url: '/v1/user/cancel',
    method: 'post',
    data
  });
}

// /portal/v1/user/bind-email-refer
export function bindEmailRefer(data) {
  return request({
    url: '/v1/user/bind-email-refer',
    method: 'post',
    data
  });
}

// check-in
export function checkIn() {
  return request({
    url: '/v1/user/check-in',
    method: 'post'
  });
}
// /portal/v1/user/point-log-list
export function getPointLogList(params) {
  return request({
    url: '/v1/user/point-log-list',
    method: 'get',
    params
  });
}