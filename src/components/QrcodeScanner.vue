<template>
    <div id="qr-code-full-region"></div>
</template>

<script src="https://unpkg.com/html5-qrcode/minified/html5-qrcode.min.js"></script>

<script>
export default {
  props: {
    qrbox: {
      type: Number,
      default: 250
    },
    fps: {
      type: Number,
      default: 10
    },
  },
  mounted () {
    const config = {
      fps: this.fps,
      qrbox: this.qrbox,
    };
    const html5QrcodeScanner = new Html5QrcodeScanner('qr-code-full-region', config);
    html5QrcodeScanner.render(this.onScanSuccess);
  },
  methods: {
    onScanSuccess (qrCodeMessage) {
      this.$emit('result', qrCodeMessage);
    }
  }
}
</script>
