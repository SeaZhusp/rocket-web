import request from '@/utils/request'

export function searchProject(params) {
  return request({
    url: '/sys/project/list',
    method: 'get',
    params
  })
}

export function createProject(data) {
  return request({
    url: '/sys/project/create',
    method: 'post',
    data
  })
}

export function deleteProject(id) {
  return request({
    url: `/sys/project/delete/${id}`,
    method: 'delete'
  })
}

export function updateProject(data) {
  return request({
    url: '/sys/project/update',
    method: 'put',
    data
  })
}

export function listProject(params) {
  return request({
    url: '/sys/project/listall',
    method: 'get',
    params
  })
}
