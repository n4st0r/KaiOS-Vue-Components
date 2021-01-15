<template>
  <!-- <qrcode-stream @decode="onDecode"></qrcode-stream> -->
  <div class="container">
    <!-- <QrcodeScanner
      :qrbox="250"
      :fps="10"
      @result="onScan"
    /> -->
    {{ string }}
  </div>
</template>

<script>
import store from '@/js/store'
// import QrcodeScanner from '@/components/QrcodeScanner.vue'
// import StringTypeDetector from 'xumm-string-decode'
// const xsd = window.require('xumm-string-decode')

export default {
  name: 'qrscanner',
  components: {
    // QrcodeScanner
  },
  data () {
    return {
      string: 'null'
    }
  },
  methods: {
    onScan (string) {
      // const xsd = require('xumm-string-decode')
      // const someString = 'https://ripple.com//send?to=rPdvC6ccq8hCdPKSPJkPmyZ4Mi1oG2FFkT&amount=30&dt=123'
      // const detected = new StringTypeDetector(someString)
      // this.string = detected

      // const detected = new xsd.StringTypeDetector('rwietsevLFg8XSmG3bEZzFein1g8RBqWDZ')
      // const detectedType = xsd.StringType[detected.getType()]

      // console.log({ detectedType })

      // const decoded = new xsd.StringDecoder(detected)
      // const parsedResult = decoded['get' + detectedType]()
      // this.string = parsedResult.to
      // console.log(parsedResult.to)
    }
  },
  created () {
    store.keys.left = {
      string: 'Back',
      fn: () => this.$router.push('/')
    }
    this.onScan(null)
  }
}
</script>

<style scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
