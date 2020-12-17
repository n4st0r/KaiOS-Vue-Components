<template>
  <!-- <qrcode-stream @decode="onDecode"></qrcode-stream> -->
  <VueQrcode :value="destination" :options="{ width: 115 }"></VueQrcode>
</template>

<script>
// import { QrcodeStream } from 'vue-qrcode-reader'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import socket from '@/js/socket.js'

export default {
  name: 'qrscanner',
  components: {
    // QrcodeStream,
    VueQrcode
  },
  data () {
    return {
      destination: 'rDbWJ9C7uExThZYAwV8m6LsZ5YSX3sa6US',
      tag: null,
      amount: 1
    }
  },
  methods: {
    onDecode (decodedString) {
      console.log(decodedString)
    },
    sendTransaction () {
      const seed = 'sXXX'
      const signedTX = socket.signPaymentTransaction(this.destination, this.tag, this.amount, seed)
      console.log(signedTX)
    }
  }
}
</script>
