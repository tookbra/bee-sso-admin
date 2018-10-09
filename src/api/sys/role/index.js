import request from '@/plugin/axios'

export function search (data) {
	return request({
		url: '/sys/roles',
		method: 'get',
		params: data
	})
}

export function getInfo (id) {
	return request({
		url: '/sys/roles/' + id,
		method: 'get',
	})
}

export function removeRole (id) {
	return request({
		url: '/sys/roles/' + id,
		method: 'delete'
	})
}

export function addRole(data) {
	return request({
		url: '/sys/roles',
		method: 'post',
		data
	})
}

export function editRole(id, data) {
	return request({
		url: '/sys/roles/' + id,
		method: 'put',
		data
	})
}

export function getRoleMenu(id) {
	return request({
		url: 'sys/roles/menu/' + id,
		method: 'get'
	})
}

export function updatePermission(id, data) {
	return request({
		url:  'sys/roles/menu/' + id,
		method: 'put',
		data
	})
}
