import request from '@/utils/request'

export function searchCatalogTree(params) {
  return request({
    url: '/http/catalog/tree',
    method: 'get',
    params
  })
}

export function createCatalog(data) {
  return request({
    url: '/http/catalog/create',
    method: 'post',
    data
  })
}

export function updateCatalog(data) {
  return request({
    url: '/http/catalog/update',
    method: 'put',
    data
  })
}

export function deleteCatalog(id) {
  return request({
    url: `/http/catalog/delete/${id}`,
    method: 'delete'
  })
}
