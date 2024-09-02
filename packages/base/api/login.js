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


// sms login
export const visitorLogin = (params) =>
  request({
    url: '/portal/visitor/login',
    method: 'get',
    params
});

// verify
export function visitorAnonymous (data) {
  return request({
    url: '/portal/visitor/verify',
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + data
    },
  })
}

export function getSmsCode(data, token) {
  return request({
    url: '/portal/user/send-sms-captcha',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + token
    },
    data
  });
}

export function smsCaptchaLogin(data, token) {
  return request({
    url: '/portal/user/sms-captcha-login',
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + token
    },
    data
  });
}

export function getSmsGefreshToken(data) {
  return request({
    url: '/portal/user/refresh-token',
    method: 'post',
    data
  });
}