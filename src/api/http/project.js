import request from '@/utils/request'

export function searchProject(params) {
  return request({
    url: '/http/project/list',
    method: 'get',
    params
  })
}

export function createProject(data) {
  return request({
    url: '/http/project/create',
    method: 'post',
    data
  })
}

export function deleteProject(id) {
  return request({
    url: `/http/project/delete/${id}`,
    method: 'delete'
  })
}

export function updateProject(data) {
  return request({
    url: '/http/project/update',
    method: 'put',
    data
  })
}

export function listProject() {
  return request({
    url: '/http/project/all',
    method: 'get'
  })
}
