import request from '@/utils/request'

// dict
export function searchDict(params) { return request({ url: '/sys/dict/list', method: 'get', params }) }

export function createDict(data) { return request({ url: '/sys/dict/create', method: 'post', data }) }

export function deleteDict(id) { return request({ url: `/sys/dict/delete/${id}`, method: 'delete' }) }

export function updateDict(data) { return request({ url: '/sys/dict/update', method: 'put', data }) }

export function searchDictItem(params) { return request({ url: '/sys/dict/item/list', method: 'get', params }) }

export function createDictItem(data) { return request({ url: '/sys/dict/item/create', method: 'post', data }) }

export function updateItemDict(data) { return request({ url: '/sys/dict/item/update', method: 'put', data }) }

export function deleteItemDict(id) { return request({ url: `/sys/dict/item/delete/${id}`, method: 'delete' }) }

// file
export const uploadUrl = process.env.VUE_APP_BASE_API + '/sys/file/upload'

export function uploadFile(params) { return request.post({ url: '/sys/file/upload', params: params }) }

// user
export function login(data) { return request({ url: '/sys/user/login', method: 'post', data }) }

export function searchUser(params) { return request({ url: '/sys/user/list', method: 'get', params }) }

export function createUser(data) { return request({ url: '/sys/user/create', method: 'post', data }) }

export function deleteUser(id) { return request({ url: `/sys/user/delete/${id}`, method: 'delete' }) }

export function updateUser(data) { return request({ url: '/sys/user/update', method: 'put', data }) }
