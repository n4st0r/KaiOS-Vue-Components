<template>
    <div class="container">
        <h1>XUMM for KaiOs Setup</h1>
        <p>Welcome to the XUMM app for KaiOs We see that it is your first time setting this app up. You will be asked to Create a new XRP account or Import an excisting one</p>
        <!-- <p>Click enter to either import or create an account before proceding</p> -->
        <OptionMenu @close="optionsActive = false" @select="onSelect" v-if="optionsActive" :options="options"/>
        <Button text="Start" />
    </div>
</template>

<script>
import store from '@/js/store'
import OptionMenu from '@/components/OptionMenu.vue'
import Button from '@/components/Button.vue'

export default {
  components: { OptionMenu, Button },
  data () {
    return {
      optionsActive: false,
      options: Array
    }
  },
  mounted () {
    this.options = [{ text: 'Import', fn: () => this.$router.push('/Import') }, { text: 'Create', fn: () => this.$router.push('/Generate') }]
    store.keys = {
      left: {
        string: '',
        fn: () => { return null }
      },
      center: {
        string: 'Start',
        fn: () => {
          this.optionsActive = true
        }
      },
      right: {
        string: '',
        fn: () => { return null }
      }
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
h1 {
    margin: 0;
}
p {
    margin: 0;
}
</style>
