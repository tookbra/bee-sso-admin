// layout
import layoutHeaderAside from '@/layout/header-aside'

const meta = { requiresAuth: true }

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      {
        path: 'index',
        name: 'index',
        meta,
        component: () => import('@/pages/index')
      },
      {
        path: '/page1',
        name: 'page1',
        component: () => import('@/pages/page1'),
        meta: { meta, title: '页面 1' }
      },
	    {
		    path: '/sys/menu',
		    name: 'menu',
		    component: () => import('@/pages/sys/menu'),
		    meta: { meta, title: '菜单管理' }
	    },
	    {
		    path: '/sys/role',
		    name: 'role',
		    component: () => import('@/pages/sys/role'),
		    meta: { meta, title: '角色管理' }
	    },
	    {
		    path: '/sys/user',
		    name: 'user',
		    component: () => import('@/pages/sys/user'),
		    meta: { meta, title: '用户管理' }
	    },
	    {
		    path: '/sys/log',
		    name: 'log',
		    component: () => import('@/pages/sys/log'),
		    meta: { meta, title: '操作日志' }
	    }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 页面重定向使用 必须保留
  {
    path: '/redirect/:path*',
    component: () => import('@/pages/redirect')
  },
  // 登录
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  // 404
  {
    path: '*',
    name: '404',
    component: () => import('@/pages/error-page-404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
