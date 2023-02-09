import request from '@/utils/request'

export const uploadUrl = process.env.VUE_APP_BASE_API + '/sys/file/upload'

export function uploadFile(params) {
  return request.post({
    url: '/sys/file/upload',
    params: params
  })
}
