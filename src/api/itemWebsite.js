import request from '@/utils/request'

export const add = data => {
  return request({
    url: '/api/itemWebsite',
    method: 'post',
    data,
  })
}

export const update = data => {
  return request({
    url: '/api/itemWebsite/' + data.id,
    method: 'put',
    data,
  })
}

export const deleteById = id => {
  return request({
    url: '/api/itemWebsite/' + id,
    method: 'delete',
  })
}

export const list = () => {
  return request({
    url: '/api/itemWebsite',
    method: 'get',
  })
}

export const getById = id => {
  return request({
    url: '/api/itemWebsite/' + id,
    method: 'get',
  })
}
