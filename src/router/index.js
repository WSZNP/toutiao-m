import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/',
    // name: 'layout',//如果父路由有默认子路由，那么它的name没有意义
    component: () => import('@/views/layout'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        meta: {
          keepAlive: true // 该字段表示该页面需要缓存
        },
        component: () => import('@/views/home')
      },
      {
        path: 'qa',
        name: 'qa',
        component: () => import('@/views/qa')
      },
      {
        path: 'video',
        name: 'video',
        component: () => import('@/views/video')
      },
      {
        path: 'my',
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    props: true // 开启props传参，把路由参数映射到组件的props数据中
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile')
  },
  {
    path: '/user/:userId',
    name: 'user',
    props: true,
    component: () => import('@/views/user')
  },
  {
    path: '*',
    component: () => import('@/views/404')
  }
]

const router = new VueRouter({
  routes
})

export default router
