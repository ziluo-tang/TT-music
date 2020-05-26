import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: () => import('components/recommend'),
      children: [{
        path: ':id',
        component: () => import('components/disc')
      }]
    },
    {
      path: '/singer',
      name: 'singer',
      component: () => import('components/singer'),
      children: [{
        path: ':id',
        component: () => import('components/singer-detail')
      }]
    },
    {
      path: '/rank',
      name: 'rank',
      component: () => import('components/rank'),
      children: [{
        path: ':id',
        component: () => import('components/rank-music')
      }]
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('components/search'),
      children: [{
        path: ':id',
        component: () => import('components/singer-detail')
      }]
    }
  ]
})
