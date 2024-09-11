import request from '@gptx/base/utils/request'

export function welcomeAccess (token, data ) {
  return request({
    url: '/v1/user/welcome',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + token
    },
    data
  })
}
