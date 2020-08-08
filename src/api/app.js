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

