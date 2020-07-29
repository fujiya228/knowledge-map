import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/pages/Home.vue'
import About from '@/pages/About.vue'
import Auth from '@/pages/Auth.vue'
import GraphFree from "@/components/organisms/GraphFree";
import Edit from "@/components/organisms/Edit";
import Layout from "@/layout";

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
    children: [
      {
        path: 'graph-free',
        component: GraphFree,
        name: 'GraphFree'
      }
    ]
  },
  {
    path: '/:node_id([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})',
    component: Layout,
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
    path: '/404',
    name: '404',
    component: () => import('@/pages/404'),
  },
  {
    path: '*',
    name: 'Not Found',
    redirect: '/',
  }
]

if (process.env.NODE_ENV === 'development') {
  routes.unshift({
    name: 'admin',
    path: '/admin',
    component: () => import('@/pages/Admin'),
  })
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router
