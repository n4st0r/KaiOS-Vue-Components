<template>
    <div>
        <div id="tab-header">
            <label v-for="header in headers" :key="header">{{ header }}</label>
        </div>
        <div class="tab-body">
            <Wallet v-if="tabIndex === 0"/>
            <Transactions v-if="tabIndex === 1"/>
            <Contacts v-if="tabIndex === 2"/>
        </div>
    </div>
</template>

<script>
import Wallet from '@/views/Wallet.vue'
import Transactions from '@/views/Transactions.vue'
import Contacts from '@/views/Contacts.vue'

export default {
  components: {
    Wallet,
    Transactions,
    Contacts
  },
  data () {
    return {
      tabIndex: 0,
      headers: ['Wallet', 'transactions', 'contacts']
    }
  },
  methods: {
    onKeyDown (event) {
      switch (event.key) {
        case 'ArrowLeft':
          this.tabIndex++
          // this.$refs.txList.scrollBy({
          // top: this.$refs.items[0].offsetHeight,
          // left: 0
          // })
          break
        case 'ArrowRight':
          this.tabIndex--
          // this.$refs.txList.scrollBy({
          // top: -this.$refs.items[0].offsetHeight,
          // left: 0
          // })
          break
        default:
          console.log(event.code)
      }
      this.focusInput(this.headers.length)
    },
    focusInput (length) {
      if (this.tabIndex >= length) {
        this.tabIndex = 0
        // this.$refs.txList.scrollTop = 0
      } else if (this.focusIndex < 0) {
        this.tabIndex = (length - 1)
        // this.$refs.txList.scrollTop = this.$refs.txList.scrollHeight
      }
    }
  },
  mounted () {
    document.addEventListener('keydown', this.onKeyDown)
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.onKeyDown)
  }
}
</script>

<style scoped>
#tab-header {
  height: 3rem;
  background-color: white;
}
</style>
