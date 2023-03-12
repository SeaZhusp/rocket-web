import request from '@/utils/request'

// api
export function searchApi(params) { return request({ url: '/http/api/list', method: 'get', params }) }

export function getApiDetail(id) { return request({ url: `/http/api/${id}`, method: 'get' }) }

export function deleteApi(id) { return request({ url: `/http/api/delete/${id}`, method: 'delete' }) }

export function updateApi(data) { return request({ url: '/http/api/update', method: 'put', data }) }

export function createApi(data) { return request({ url: '/http/api/create', method: 'post', data }) }

export function runSingleApi(data) { return request({ url: '/http/api/run', method: 'post', data }) }

// catalog
export function listCatalogTree(params) { return request({ url: '/manage/catalog/tree', method: 'get', params }) }

export function createCatalog(data) { return request({ url: '/manage/catalog/create', method: 'post', data }) }

export function updateCatalog(data) { return request({ url: '/manage/catalog/update', method: 'put', data }) }

export function deleteCatalog(id) { return request({ url: `/manage/catalog/delete/${id}`, method: 'delete' }) }

// envconfig
export function searchEnvConfig(params) { return request({ url: '/http/envconfig/list', method: 'get', params }) }

export function deleteEnvConfig(id) { return request({ url: `/http/envconfig/delete/${id}`, method: 'delete' }) }

export function updateEnvConfig(data) { return request({ url: '/http/envconfig/update', method: 'put', data }) }

export function createEnvConfig(data) { return request({ url: '/http/envconfig/create', method: 'post', data }) }

export function getAllEnvConfig() { return request({ url: '/http/envconfig/all', method: 'get' }) }

// pyshell
export function listPyshell() { return request({ url: '/http/pyshell/list', method: 'get' }) }

export function getPyshellContent(params) { return request({ url: '/http/pyshell/info', method: 'get', params }) }

export function debugFunction(data) { return request({ url: '/http/pyshell/debug', method: 'post', data }) }

export function createPyshell(data) { return request({ url: '/http/pyshell/create', method: 'post', data }) }

export function savePyshell(data) { return request({ url: '/http/pyshell/save', method: 'put', data }) }

export function deletePyshell(data) { return request({ url: '/http/pyshell/delete', method: 'delete', data }) }

// testcase
export function searchTestcaseList(params) { return request({ url: '/http/testcase/list', method: 'get', params }) }

export function deleteTestcase(id) { return request({ url: `/http/testcase/delete/${id}`, method: 'delete' }) }

export function updateTestcase(data) { return request({ url: '/http/testcase/update', method: 'put', data }) }

export function createTestcase(data) { return request({ url: '/http/testcase/create', method: 'post', data }) }

export function runTestcase(data) { return request({ url: '/http/testcase/run', method: 'post', data }) }

// testplan
export function searchTestplanList(params) { return request({ url: '/http/plan/list', method: 'get', params }) }

export function deleteTestplan(id) { return request({ url: `/http/plan/delete/${id}`, method: 'delete' }) }

export function updateTestplan(data) { return request({ url: '/http/plan/update', method: 'put', data }) }

export function createTestplan(data) { return request({ url: '/http/plan/create', method: 'post', data }) }

export function runPlan(id) { return request({ url: `/http/plan/run/${id}`, method: 'post' }) }

// plandetail
export function getPlanTestcaseCatalogTree(params) { return request({ url: '/http/plan/detail/catalog/tree', method: 'get', params }) }

export function getPlanTestcaseList(params) { return request({ url: '/http/plan/detail/testcase/list', method: 'get', params }) }

export function deletePlanDetailTestcase(data) { return request({ url: '/http/plan/detail/testcase/remove', method: 'post', data }) }

export function addTestcaseToPlan(data) { return request({ url: '/http/plan/detail/testcase/add', method: 'post', data }) }

// report
export function searchReportList(params) { return request({ url: '/http/report/list', method: 'get', params }) }

export function deleteReport(id) { return request({ url: `/http/report/delete/${id}`, method: 'delete' }) }

// report detail
export function getReportDetail(params) { return request({ url: '/http/report/view', method: 'get', params }) }
