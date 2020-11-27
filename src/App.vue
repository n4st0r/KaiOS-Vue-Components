<template>
  <div id="app">
    <Header title="XUMM" style="height: 35px"/>
    <router-view style="height: calc(100% - (35px + 30px))"/>
    <Softkey :softkeys="softkeys" style="height: 30px"/>
    <notifications group="foo" width="80%" position="bottom center" :max="1"/>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Softkey from '@/components/Softkey.vue'

export default {
  components: {
    Header,
    Softkey
  },
  data () {
    return {
      softkeys: {
        left: 'back',
        center: 'enter',
        right: 'null'
      }
    }
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
  }
  #app {
    height: 100%
  }
</style>
