import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Notifications from 'vue-notification'
import VueCryptojs from 'vue-cryptojs'
import VueWorker from 'vue-worker'

Vue.use(Notifications)
Vue.use(VueCryptojs)
Vue.use(VueWorker)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
