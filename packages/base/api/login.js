import request from '@gptx/base/utils/request'

export function welcomeAccess (token, anonymousToken = undefined ) {
  return request({
    url: '/portal/user/welcome',
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + token
    },
    params:{
      anonymous_token: anonymousToken
    }
  })
}