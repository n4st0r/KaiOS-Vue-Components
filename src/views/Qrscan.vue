<template>
  <!-- <qrcode-stream @decode="onDecode"></qrcode-stream> -->
  <div class="container">
    <QrcodeScanner
      :qrbox="250"
      :fps="10"
      @result="onScan"
    />
    {{ string }}
  </div>
</template>

<script>
import store from '@/js/store'
import QrcodeScanner from '@/components/QrcodeScanner.vue'
import StringTypeDetector from 'xumm-string-decode'

export default {
  name: 'qrscanner',
  components: {
    QrcodeScanner
  },
  data () {
    return {
      string: 'null'
    }
  },
  methods: {
    onScan (string) {
      const someString = 'https://ripple.com//send?to=rPdvC6ccq8hCdPKSPJkPmyZ4Mi1oG2FFkT&amount=30&dt=123'
      const detected = new StringTypeDetector(someString)
      this.string = detected
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

<style scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
