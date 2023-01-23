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

export function searchDictItem(params) {
  return request({
    url: '/sys/dict/item/list',
    method: 'get',
    params
  })
}

export function createDictItem(data) {
  return request({
    url: '/sys/dict/item/create',
    method: 'post',
    data
  })
}

export function updateItemDict(data) {
  return request({
    url: '/sys/dict/item/update',
    method: 'put',
    data
  })
}

export function deleteItemDict(id) {
  return request({
    url: `/sys/dict/item/delete/${id}`,
    method: 'delete'
  })
}
