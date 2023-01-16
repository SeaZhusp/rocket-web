import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/user/login',
    method: 'post',
    data
  })
}

export function searchUser(params){
  return request({
    url: '/sys/user/list',
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
