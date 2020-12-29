<template>
  <div id="app">
    <Header title="XUMM" style="height: 35px"/>
    <Setup @success="session = true" v-if="!session" style="height: calc(100% - (35px + 30px))"/>
    <router-view v-if="session" style="height: calc(100% - (35px + 30px))"/>
    <Softkey style="height: 30px"/>
    <notifications group="foo" width="80%" position="bottom center" :max="1"/>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Softkey from '@/components/Softkey.vue'
import Setup from '@/components/Setup.vue'

import socket from '@/js/socket.js'
// import socket from '@/js/socket-1.js'
// import store from '@/js/store.js'

export default {
  components: {
    Header,
    Softkey,
    Setup
  },
  data () {
    return {
      init: false,
      session: true
    }
  },
  methods: {
    async connect () {
      console.log('Connecting to ws...')
      const ws = await socket.connect()
      console.log(ws)
    },
    async close () {
      const ws = await socket.close()
      console.log(ws)
    },
    onVisibilityChange (event) {
      const state = document.visibilityState
      switch (state) {
        case 'hidden':
          this.close()
          this.session = true
          // this.$router.push({ name: 'Setup' })
          break
        case 'visible': {
          // if (socket.state() === 3) this.connect()
          const isOnline = socket.state()
          if (!isOnline) this.connect()
          break
        }
      }
    }
  },
  mounted () {
    document.addEventListener('visibilitychange', this.onVisibilityChange)
    this.connect()
  },
  beforeDestroy () {
    document.addEventListener('visibilitychange', this.onVisibilityChange)
    this.close()
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
  html, body, #root {
    font-family: 'Montserrat', sans-serif;
    margin: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #E1E2E1 !important;
    height: 100%;
  }
  #app {
    height: 100%
  }
  input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
</style>
