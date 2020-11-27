<template>
  <!-- <qrcode-stream @decode="onDecode"></qrcode-stream> -->
  <VueQrcode value="Hello, World!" :options="{ width: 200 }"></VueQrcode>
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
