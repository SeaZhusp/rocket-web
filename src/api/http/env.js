import request from '@/utils/request'

export function searchEnv(params) {
  return request({
    url: '/http/env/list',
    method: 'get',
    params
  })
}

export function deletEnv(id) {
  return request({
    url: `/http/env/delete/${id}`,
    method: 'delete'
  })
}

export function updateEnv(data) {
  return request({
    url: '/http/env/update',
    method: 'put',
    data
  })
}

export function createEnv(data) {
  return request({
    url: '/http/env/create',
    method: 'post',
    data
  })
}
