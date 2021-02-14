<template>
  <!-- <qrcode-stream @decode="onDecode"></qrcode-stream> -->
  <div class="container">
    <QrcodeScanner
      :qrbox="250"
      :fps="10"
      @result="onScan"
    />
  </div>
</template>

<script>
import store from '@/js/store'
import QrcodeScanner from '@/components/QrcodeScanner.vue'
import { StringTypeDetector, StringDecoder } from 'xumm-string-decode'

export default {
  name: 'qrscanner',
  components: {
    QrcodeScanner
  },
  data () {
    return {
    }
  },
  methods: {
    onScan (string) {
      console.log('scanning')

      const detected = new StringTypeDetector(string)
      console.log(detected.getTypeName())
      const decoded = new StringDecoder(detected)
      console.log(decoded.getXrplDestination())
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
  mounted () {
    store.keys.left = {
      string: 'Back',
      fn: () => this.$router.push('/')
    }
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
