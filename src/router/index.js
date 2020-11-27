import Vue from 'vue'
import VueRouter from 'vue-router'

import Menu from '../views/Menu.vue'
import QR from '../components/Qrscan.vue'
import Create from '../components/Create.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Menu',
    component: Menu
  },
  {
    path: '/QrScanner',
    name: 'QR',
    component: QR
  },
  {
    path: '/Generate',
    name: 'Generate',
    component: Create
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
