import request from '@/utils/request'

// api
export function searchApi(params) { return request({ url: '/http/api/list', method: 'get', params }) }

export function getApiDetail(id) { return request({ url: `/http/api/${id}`, method: 'get' }) }

export function deleteApi(id) { return request({ url: `/http/api/delete/${id}`, method: 'delete' }) }

export function updateApi(data) { return request({ url: '/http/api/update', method: 'put', data }) }

export function createApi(data) { return request({ url: '/http/api/create', method: 'post', data }) }

export function runSingleApi(data) { return request({ url: '/http/api/run', method: 'post', data }) }

// catalog
export function searchCatalogTree(params) { return request({ url: '/http/catalog/tree', method: 'get', params }) }

export function createCatalog(data) { return request({ url: '/http/catalog/create', method: 'post', data }) }

export function updateCatalog(data) { return request({ url: '/http/catalog/update', method: 'put', data }) }

export function deleteCatalog(id) { return request({ url: `/http/catalog/delete/${id}`, method: 'delete' }) }

// envconfig
export function searchEnvConfig(params) { return request({ url: '/http/envconfig/list', method: 'get', params }) }

export function deleteEnvConfig(id) { return request({ url: `/http/envconfig/delete/${id}`, method: 'delete' }) }

export function updateEnvConfig(data) { return request({ url: '/http/envconfig/update', method: 'put', data }) }

export function createEnvConfig(data) { return request({ url: '/http/envconfig/create', method: 'post', data }) }

export function getAllEnvConfig() { return request({ url: '/http/envconfig/all', method: 'get' }) }

// project
export function searchProject(params) { return request({ url: '/http/project/list', method: 'get', params }) }

export function createProject(data) { return request({ url: '/http/project/create', method: 'post', data }) }

export function deleteProject(id) { return request({ url: `/http/project/delete/${id}`, method: 'delete' }) }

export function updateProject(data) { return request({ url: '/http/project/update', method: 'put', data }) }

export function listProject() { return request({ url: '/http/project/all', method: 'get' }) }
