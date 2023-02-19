import request from '@/utils/request'

export function searchConfig(params) {
  return request({
    url: '/http/config/list',
    method: 'get',
    params
  })
}

export function deletConfig(id) {
  return request({
    url: `/http/config/delete/${id}`,
    method: 'delete'
  })
}

export function updateConfig(data) {
  return request({
    url: '/http/config/update',
    method: 'put',
    data
  })
}

export function createConfig(data) {
  return request({
    url: '/http/config/create',
    method: 'post',
    data
  })
}
