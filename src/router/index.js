import Vue from 'vue'
import VueRouter from 'vue-router'

import Menu from '../views/Menu.vue'
import QR from '../components/Qrscan.vue'
import Create from '../components/Create.vue'
import Import from '../components/Import.vue'
import Wallet from '../views/Wallet.vue'
import tx from '../views/tx.vue'
import Setup from '../components/Setup.vue'
import Contacts from '../views/Contacts.vue'

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
    path: '/Setup',
    name: 'Setup',
    component: Setup,
    props: true
  },
  {
    path: '/Generate',
    name: 'Generate',
    component: Create
  },
  {
    path: '/Import',
    name: 'Import',
    component: Import,
    props: true
  },
  {
    path: '/Wallet',
    name: 'Wallet',
    component: Wallet
  },
  {
    path: '/QR',
    name: 'QRview',
    component: () => import(/* webpackChunkName: "QRview" */ '../views/QRview.vue'),
    props: true
  },
  {
    path: '/transaction',
    name: 'transaction',
    component: tx,
    props: true
  },
  {
    path: '/Contacts',
    name: 'Contacts',
    component: Contacts
  },
  {
    path: '/Contact',
    name: 'Contact',
    component: () => import(/* webpackChunkName: "contact" */ '../views/Contact.vue'),
    props: true
  },
  {
    path: '/Send',
    name: 'Send',
    component: () => import(/* webpackChuckName: "Send" */ '../views/Send.vue'),
    props: true
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
