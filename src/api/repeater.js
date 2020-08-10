import request from '@/utils/request'

const baseUrl = 'http://localhost:8001/'

export function fetchAppList(query) {
  return request({
    url: baseUrl + 'app/list',
    method: 'get',
    params: query
  })
}

export function fetchConfigInfoList(query) {
  return request({
    url: baseUrl + 'config/list',
    method: 'get',
    params: query
  })
}

export function fetchModuleInfoList(query) {
  return request({
    url: baseUrl + 'module/list',
    method: 'get',
    params: query
  })
}

export function updateModuleInfoList(query) {
  return request({
    url: baseUrl + 'module/update',
    method: 'post',
    params: query
  })
}

export function getModuleStatus(query) {
  return request({
    url: baseUrl + 'module/getStatus',
    method: 'post',
    params: query
  })
}

export function installModule(query) {
  return request({
    url: baseUrl + 'module/install',
    method: 'post',
    params: query
  })
}

export function attachModule(query) {
  return request({
    url: baseUrl + 'module/attach',
    method: 'post',
    params: query
  })
}

export function detachModule(query) {
  return request({
    url: baseUrl + 'module/detach',
    method: 'post',
    params: query
  })
}

export function fetchRecordList(query) {
  return request({
    url: baseUrl + 'record/list',
    method: 'get',
    params: query
  })
}

export function fetchRecordDetail(query) {
  return request({
    url: baseUrl + 'record/detail',
    method: 'get',
    params: query
  })
}
