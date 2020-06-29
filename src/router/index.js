import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/pages/Home.vue'
import About from '@/pages/About.vue'
import Auth from '@/pages/Auth.vue'
import GraphFree from "@/components/organisms/GraphFree";
import Edit from "@/components/organisms/Edit";
import Layout from "@/layout";
import store from "@/store"

Vue.use(VueRouter)

const routes = [
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/',
    component: Layout,
    redirect: 'graph-free',
    meta: { requireAuth: true },
    children: [
      {
        path: 'graph-free',
        component: GraphFree,
        name: 'GraphFree'
      }
    ]
  },
  {
    path: '/:path([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})',
    component: Layout,
    meta: { requireAuth: true },
    children: [
      {
        path: '',
        component: Edit,
        name: 'Edit'
      }
    ]
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '*',
    name: 'Not Found',
    redirect: '/',
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const user = store.state.auth.user
  const isLoggedIn = store.state.auth.isLoggedIn
  // console.log('route to', to)
  // console.log('user', user)
  // console.log('isLoggedIn', isLoggedIn)
  if (to.matched.some(record => record.meta.requireAuth)) {
    // 認証情報の確認
    if (isLoggedIn && user) {
      // console.log('router.beforeEach: auth OK')
      next()
    } else {
      // 認証できていない
      // console.log('router.beforeEach: auth NO')
      next({
        path: '/auth',
        query: {
          next: to.fullPath,
        },
      })
    }
  } else if (isLoggedIn && to.path === '/auth') {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router
