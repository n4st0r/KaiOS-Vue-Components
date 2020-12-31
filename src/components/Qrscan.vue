<template>
  <!-- <qrcode-stream @decode="onDecode"></qrcode-stream> -->
  <div>
    <QrcodeScanner
      :qrbox="250"
      :fps="10"
      style="width: 500px;"
      @result="onScan"
    />
  </div>
</template>

<script>
// import { QrcodeStream } from 'vue-qrcode-reader'
// import socket from '@/js/socket.js'
import store from '@/js/store'
import QrcodeScanner from '@/components/QrcodeScanner.vue'

export default {
  name: 'qrscanner',
  components: {
    // QrcodeStream,
    QrcodeScanner
  },
  data () {
    return {
    }
  },
  methods: {
    onScan (decodedString) {
      console.log(decodedString)
    }
  },
  created () {
    store.keys.left = {
      string: 'Back',
      fn: () => this.$router.push('/')
    }
  }
}
</script>
