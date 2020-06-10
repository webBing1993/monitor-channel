import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/index'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: HelloWorld
    },
    {
      path: '/keyChannel',
      name: 'keyChannel',
      component: resolve => require(['../components/keyChannel/index.vue'],resolve),
      children: [
        {
          path: '/keyChannel',
          component: resolve => require(['../components/keyChannel/homeIndex.vue'],resolve),
        },
        {
          path: '/keyChannel/home',
          name: 'home',
          component: resolve => require(['../components/keyChannel/home.vue'],resolve),
        },
        {
          path: '/whiteList',
          component: resolve => require(['../components/keyChannel/whiteList.vue'],resolve),
        },
        {
          path: '/hotelStatus',
          component: resolve => require(['../components/keyChannel/hotelStatus.vue'],resolve),
        },
        {
          path: '/recode',
          component: resolve => require(['../components/keyChannel/recode.vue'],resolve),
        }
      ]
    },
    {
      path: '/statistics',
      name: '/statistics',
      component: resolve => require(['../components/keyChannel/statistics.vue'],resolve),
    },
    {
      path: '/passwordUpdate',
      name: '/passwordUpdate',
      component: resolve => require(['../components/keyChannel/passwordUpdate.vue'],resolve),
    }
  ]
})
