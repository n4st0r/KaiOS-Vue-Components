<template>
    <div class="tab-conatiner">
        <div id="tab-header">
            <h3 :class="{ selected: tabIndex === index }" v-for="(header, index) in headers" :key="header">{{ header }}</h3>
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
      headers: ['Wallet', 'Transactions', 'Contacts', 'Options']
    }
  },
  methods: {
    onKeyDown (event) {
      switch (event.key) {
        case 'ArrowLeft':
          this.tabIndex--
          // this.$refs.txList.scrollBy({
          // top: this.$refs.items[0].offsetHeight,
          // left: 0
          // })
          break
        case 'ArrowRight':
          this.tabIndex++
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
      } else if (this.tabIndex < 0) {
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
.tab-container {
  display: flex;
  flex-direction: column;
}
.selected {
  font-weight: 600;
  border-bottom: 2px blueviolet solid;
  /* position: relative; */
  /* top: 2px; */
}
#tab-header {
  height: 3rem;
  background-color: white;
  overflow-x: hidden;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
}
h3 {
  font-size: 14px;
  font-weight: 400;
  padding: 0 0.5rem;
  margin-left: 0.5rem;
}
.tab-body {
  background-color: white;
  height: calc(100% - 3rem);
}
</style>
