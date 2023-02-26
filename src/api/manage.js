import request from '@/utils/request'

// project
export function searchProject(params) { return request({ url: '/manage/project/list', method: 'get', params }) }

export function createProject(data) { return request({ url: '/manage/project/create', method: 'post', data }) }

export function deleteProject(id) { return request({ url: `/manage/project/delete/${id}`, method: 'delete' }) }

export function updateProject(data) { return request({ url: '/manage/project/update', method: 'put', data }) }

export function listProject() { return request({ url: '/manage/project/all', method: 'get' }) }
