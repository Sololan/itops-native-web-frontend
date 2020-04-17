import Vue from 'vue'
import Router from 'vue-router'
import HttpUtil from '@/providers/utils/http-util'
import OrgService from '@/providers/services/uc/orgs-service'
import NoticeUtil from '@/providers/utils/notice-util'
import store from '@/store'
import {Mutations} from '@/providers/models/enums'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/main'
    },
    {
      path: '/login',
      component: () => import('@/views/common/login/login.vue'),
      beforeEnter: (to, from, next) => {
        const redirect = to.query.redirect
        // 授权码判断，组织数大于零允许进入登录页
        OrgService.getOrgTotal()
        .then((total) => total > 0 ? next() : next({path: '/license', query: {redirect}}))
        .catch(() => NoticeUtil.showAlert('请求异常，请刷新页面重试'))
      }
    },
    {
      path: '/main',
      meta: {requiresAuth: true, innerLoading: true},
      component: () => import('@/views/common/main/main.vue'),
      children: [
        {
          path: '/',
          redirect: 'home'
        },
        {
          path: 'home',
          component: () => import('@/views/home/home.vue')
        },
        {
          path: 'warning',
          component: () => import('@/views/warning/warning.vue')
        },
        {
          path: 'auth',
          component: () => import('@/views/auth/auth.vue')
        },
        {
          path: 'info',
          component: () => import('@/views/info/info.vue')
        },
        {
          path: 'monitor',
          component: () => import('@/views/monitor/monitor.vue')
        },
        {
          path: 'setting/dict',
          component: () => import('@/views/dict/dict.vue')
        },
        {
          path: 'setting/equipment',
          component: () => import('@/views/setting/equipment/equipment.vue')
        },
        {
          path: 'setting/supplier',
          component: () => import('@/views/setting/supplier/supplier.vue')
        },
        {
          path: 'setting/user',
          component: () => import('@/views/setting/user/user.vue')
        },
        {
          path: 'statistics/quantity',
          component: () => import('@/views/statistics/quantity/quantity.vue')
        },
        {
          path: 'statistics/rate',
          component: () => import('@/views/statistics/rate/rate.vue')
        }
      ]
    },
    {
      path: '/empty',
      component: () => import('@/views/common/error/error.vue')
    },
    {
      path: '/license',
      component: () => import('@/views/common/license/license.vue')
    },
    {
      path: '*',
      component: () => import('@/views/common/error/error.vue')
    }
  ]
})

router.beforeEach(((to, from, next) => {
  NoticeUtil.hideLoading(true)
  const innerLoading = to.matched.some((record) => record.meta.innerLoading)
  store.commit(Mutations.SetLoadingFullScreen, !innerLoading)

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    HttpUtil.checkAuth(to.fullPath).then(
        // 认证成功
        (path) => (path === to.fullPath ? next() : next({path})),
        // 认证失败
        () => next({path: '/login', query: {redirect: to.fullPath}})
    )
  } else {
    next()
  }
}))

export default router
