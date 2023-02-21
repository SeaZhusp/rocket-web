import request from '@/utils/request'

export function searchApi(params) {
  return request({
    url: '/http/api/list',
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

export function runSingleApi(data) {
  return request({
    url: '/http/api/run',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/http/api/run/result',
  })
}
