<template>
    <div class="wrapper">
        <div class="container">
            <VueQrcode :value="string" :options="{ width: 115 }"></VueQrcode>
        </div>
        {{ string }}
    </div>
</template>

<script>
import VueQrcode from '@chenfengyuan/vue-qrcode'

export default {
  props: ['string'],
  components: {
    VueQrcode
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto 0;
}
</style>
