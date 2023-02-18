import request from '@/utils/request'

export function searchEnv(params) {
  return request({
    url: '/http/env/list',
    method: 'get',
    params
  })
}

export function getApiDetail(id) {
  return request({
    url: `/http/api/${id}`,
    method: 'get'
  })
}

export function deleteApi(id) {
  return request({
    url: `/http/api/delete/${id}`,
    method: 'delete'
  })
}

export function updateApi(data) {
  return request({
    url: '/http/api/update',
    method: 'put',
    data
  })
}

export function createApi(data) {
  return request({
    url: '/http/api/create',
    method: 'post',
    data
  })
}
