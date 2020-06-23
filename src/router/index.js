import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/pages/Home.vue'
import About from '@/components/pages/About.vue'
import Auth from '@/components/pages/Auth.vue'
import FreeGraph from "@/components/pages/FreeGraph";
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
    name: 'FreeGraph',
    component: FreeGraph,
    meta: {
      requireAuth: true
    }
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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.state.auth.isLoggedIn
  const user = store.state.auth.user
  // console.log('route to', to)
  if (to.matched.some(record => record.meta.requireAuth)) {
    // 認証情報の確認
    if (isLoggedIn && user) {
      console.log('router.beforeEach: auth OK')
      next()
    } else {
      // 認証できていない
      console.log('router.beforeEach: auth NO')
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
