import request from '@/utils/request'

export function fetchAppList(query) {
  return request({
    url: 'http://localhost:8001/app/list',
    method: 'get',
    params: query
  })
}

