<template>
  <div>
    <section id="cam-container">
      <video ref="cam-view"></video>
      <canvas ref="cam-frame" hidden></canvas>
    </section>
  </div>
</template>

<script>
export default {
  methods: {
    onScanSuccess (qrCodeMessage) {
      this.$notify({ group: 'foo', title: 'Scanned a QR Code', text: qrCodeMessage, type: 'success' })
      navigator.vibrate(200)
      this.$emit('result', qrCodeMessage)
    },
    capture () {
      const canvas = this.$refs['cam-frame']
      const video = this.$refs['cam-view']
      const canvasContext = canvas.getContext('2d')

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight
        canvas.width = video.videoWidth
        canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height)
        const code = window.jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' })
        if (code) {
          this.onScanSuccess(code.data)
        }
      }
    }
  },
  mounted () {
    const video = this.$refs['cam-view']

    setInterval(this.capture, 200)

    navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'environment' } }).then(stream => {
      video.srcObject = stream
      video.setAttribute('playsinline', true)
      video.play()
    })
  }
}
</script>
