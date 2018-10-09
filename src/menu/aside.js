// 菜单 侧边栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '页面',
    icon: 'folder-o',
    children: [
	    { path: '/sys/menu', title: '菜单管理' },
	    { path: '/sys/role', title: '角色管理' },
	    { path: '/sys/user', title: '用户管理' },
	    { path: '/sys/log', title: '操作日志' }
    ]
  }
]
