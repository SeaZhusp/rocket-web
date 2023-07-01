import request from '@/utils/request'

// project
export function searchProject(params) { return request({ url: '/manage/project/list', method: 'get', params }) }

export function createProject(data) { return request({ url: '/manage/project/create', method: 'post', data }) }

export function deleteProject(id) { return request({ url: `/manage/project/delete/${id}`, method: 'delete' }) }

export function updateProject(data) { return request({ url: '/manage/project/update', method: 'put', data }) }

export function listProject() { return request({ url: '/manage/project/all', method: 'get' }) }

// pyshell
export function listPyshell() { return request({ url: '/manage/pyshell/list', method: 'get' }) }

export function getPyshellContent(params) { return request({ url: '/manage/pyshell/info', method: 'get', params }) }

export function debugFunction(data) { return request({ url: '/manage/pyshell/debug', method: 'post', data }) }

export function createPyshell(data) { return request({ url: '/manage/pyshell/create', method: 'post', data }) }

export function savePyshell(data) { return request({ url: '/manage/pyshell/save', method: 'put', data }) }

export function deletePyshell(data) { return request({ url: '/manage/pyshell/delete', method: 'delete', data }) }
