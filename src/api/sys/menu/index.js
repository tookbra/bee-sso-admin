import request from '@/plugin/axios'

export function getTree () {
  return request({
    url: '/sys/menus/tree',
    method: 'get'
  })
}

export function getMenuInfo (id) {
	return request({
    url: '/sys/menus/' + id,
    method: 'get'
  })
}

export function delMenu (id) {
  return request({
    url: '/sys/menus/' + id,
    method: 'delete'
  })
}

export function updateMenu (id, data) {
  return request({
	  url: '/sys/menus/' + id,
    method: 'put',
    data
  })
}

export function addMenu (data) {
  return request({
    url: '/sys/menus',
    method: 'post',
    data
  })
}
