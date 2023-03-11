import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard' }
    }]
  },

  {
    path: '/http',
    component: Layout,
    redirect: '/http/api',
    meta: { title: '接口测试' },
    children: [
      {
        path: '/http/api',
        name: '接口管理',
        component: () => import('@/views/http/api'),
        meta: { title: '接口管理' }
      },
      {
        path: '/http/testcase',
        name: '测试用例',
        component: () => import('@/views/http/testcase'),
        meta: { title: '测试用例' }
      },
      {
        path: '/http/pyshell',
        name: '函数管理',
        component: () => import('@/views/http/pyshell'),
        meta: { title: '函数管理' }
      },
      {
        path: '/http/envconfig',
        name: '环境配置',
        component: () => import('@/views/http/envconfig'),
        meta: { title: '环境配置' }
      },
      {
        path: '/http/plan',
        name: '测试计划',
        component: () => import('@/views/http/testplan'),
        meta: { title: '测试计划' }
      },
      {
        path: '/http/report',
        name: '报告中心',
        component: () => import('@/views/http/report'),
        meta: { title: '报告中心' }
      }

    ]
  },
  {
    path: '/manage',
    component: Layout,
    redirect: '/manage/project',
    name: '管理中心',
    meta: { title: '管理中心' },
    children: [
      {
        path: 'project',
        name: '项目管理',
        component: () => import('@/views/manage/project/index'),
        meta: { title: '项目管理' }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: '系统管理',
    meta: { title: '系统管理' },
    children: [
      {
        path: 'user',
        name: '用户管理',
        component: () => import('@/views/system/user/index'),
        meta: { title: '用户管理' }
      },
      {
        path: 'dict',
        name: '字典管理',
        component: () => import('@/views/system/dict/index'),
        meta: { title: '字典管理' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
