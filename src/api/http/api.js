import request from '@/utils/request'

export function searchApi(params) {
  return request({
    url: '/http/api/list',
    method: 'get',
    params
  })
}
