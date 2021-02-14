<template>
  <div id="app">
    <Header title="XUMM" style="height: 2.8rem"/>
    <Setup @success="session = true" v-if="!session && init" style="height: calc(100% - (2.8rem + 3rem))"/>
    <router-view v-if="session || !init" style="height: calc(100% - (2.8rem + 3rem))"/>
    <Softkey style="height: 3rem"/>
    <notifications group="foo" width="80%" position="bottom center" :max="1"/>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Softkey from '@/components/Softkey.vue'
import Setup from '@/components/Setup.vue'

import socket from '@/js/socket.js'
import dataStore from '@/js/dataStore.worker.js'

export default {
  components: {
    Header,
    Softkey,
    Setup
  },
  data () {
    return {
      init: false,
      session: false
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
          // Todo change to false in production
          this.session = false
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
  async beforeCreate () {
    const list = await dataStore.getAccounts()
    if (list.length < 1) {
      this.$router.push({ name: 'Init' })
    } else {
      this.init = true
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
  html, body, #root {
    font-family: "Open Sans", sans-serif;
    margin: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #E1E2E1 !important;
    height: 100%;
    font-size: 10px;
  }
  #app {
    height: 100%
  }
  input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
</style>
