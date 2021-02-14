import Vue from 'vue'
import VueRouter from 'vue-router'

// import Menu from '../views/Menu.vue'
// import QR from '../views/Qrscan.vue'
// import Create from '../components/Create.vue'
// import Import from '../components/Import.vue'
// import Wallet from '../views/Wallet.vue'
// import Accounts from '../views/Accounts.vue'
// import tx from '../views/tx.vue'
// import Setup from '../components/Setup.vue'
// import Contacts from '../views/Contacts.vue'

// import Tabs from '../views/Tabs.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/Home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "Home" */'../views/Tabs.vue')
  },
  {
    path: '/',
    name: 'Menu',
    component: () => import(/* webpackChunkName: "Menu" */'../views/Menu.vue')
  },
  {
    path: '/QrScanner',
    name: 'QR',
    component: () => import(/* webpackChunkName: "QRScanner" */'../views/Qrscan.vue')
  },
  {
    path: '/Init',
    name: 'Init',
    component: () => import(/* webpackChunkName: "Init" */'../views/Init.vue')
  },
  {
    path: '/Setup',
    name: 'Setup',
    component: () => import(/* webpackChunkName: "Setup" */'../components/Setup.vue'),
    props: true
  },
  {
    path: '/Generate',
    name: 'Generate',
    component: () => import(/* webpackChunkName: "Generate" */'../components/Create.vue')
  },
  {
    path: '/Import',
    name: 'Import',
    component: () => import(/* webpackChunkName: "Import" */'../components/Import.vue'),
    props: true
  },
  {
    path: '/Wallet',
    name: 'Wallet',
    component: () => import(/* webpackChunkName: "Wallet" */'../views/Wallet.vue')
  },
  {
    path: '/Accounts',
    name: 'Accounts',
    component: () => import(/* webpackChunkName: "Accounts" */'../views/Accounts.vue')
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
    component: () => import(/* webpackChunkName: "transactions" */ '../views/tx.vue'),
    props: true
  },
  {
    path: '/Contacts',
    name: 'Contacts',
    component: () => import(/* webpackChunkName: "Contacts" */'../views/Contacts.vue')
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
  },
  {
    path: '/Trustlines',
    name: 'Trustlines',
    component: () => import(/* webpackChunkName: "Trustlines" */ '../views/Trustlines.vue')
  },
  {
    path: '/TrustSet',
    name: 'TrustSet',
    component: () => import(/* webpackChunkName: "TrustSet" */ '../views/TrustSet.vue'),
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
