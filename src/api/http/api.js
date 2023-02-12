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
