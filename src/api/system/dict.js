import request from '@/utils/request'

export function searchDict(params) {
  return request({
    url: '/sys/dict/list',
    method: 'get',
    params
  })
}

export function createDict(data) {
  return request({
    url: '/sys/dict/create',
    method: 'post',
    data
  })
}

export function deleteDict(id) {
  return request({
    url: `/sys/dict/delete/${id}`,
    method: 'delete'
  })
}

export function updateDict(data) {
  return request({
    url: '/sys/dict/update',
    method: 'put',
    data
  })
}
