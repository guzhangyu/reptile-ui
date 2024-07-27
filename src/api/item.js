import request from '@/utils/request'

export const craw = data => {
  return request({
    url: '/api/item/craw',
    method: 'post',
    params: data,
  })
}

export const list = params => {
  return request({
    url: '/api/item',
    method: 'get',
    params: params,
  })
}

export const test = data => {
  return request({
    url: '/api/item/test',
    method: 'post',
    data,
  })
}
