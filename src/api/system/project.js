import request from '@/utils/request'

export function searchProject(params) {
  return request({
    url: '/sys/project/list',
    method: 'get',
    params
  })
}

export function createUser(data) {
  return request({
    url: '/sys/user/create',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/sys/user/delete/${id}`,
    method: 'delete'
  })
}

export function updateUser(data) {
  return request({
    url: '/sys/user/update',
    method: 'put',
    data
  })
}
