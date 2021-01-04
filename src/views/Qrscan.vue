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
    onScan (decodedString) {
      this.string = decodedString
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
