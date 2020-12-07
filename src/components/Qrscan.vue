<template>
  <!-- <qrcode-stream @decode="onDecode"></qrcode-stream> -->
  <VueQrcode value="rDbWJ9C7uExThZYAwV8m6LsZ5YSX3sa6US" :options="{ width: 115 }"></VueQrcode>
</template>

<script>
// import { QrcodeStream } from 'vue-qrcode-reader'
import VueQrcode from '@chenfengyuan/vue-qrcode'

export default {
  name: 'qrscanner',
  components: {
    // QrcodeStream,
    VueQrcode
  },
  methods: {
    onDecode (decodedString) {
      console.log(decodedString)
    }
  }
}
</script>
