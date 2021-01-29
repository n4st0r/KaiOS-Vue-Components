<template>
    <div id="transaction-container">
      <div tabindex="-1" id="top" ref="input0">
        <label v-if="account.Account" class="account">{{ account.Account }}</label>
        <label v-if="account.Balance">Balance: {{ dropstoXRP(account.Balance) }} XRP</label>
        <label v-if="account.error === 'actNotFound'">{{ account.account }}</label>
      </div>
      <hr>
      <VueQrcode tabindex="-1" id="qr-code" v-if="account.account" :value="account.account" :options="{ width: 115 }" ref="input1" />
      <div v-if="account.error === 'actNotFound'">
        <p>This is an unactivated account, please send at least 20 XRP to this account to activate it!</p>
      </div>
      <VueQrcode tabindex="-1" id="qr-code" v-if="account.Account" :value="account.Account" :options="{ width: 115 }" ref="input1" />
      <Button tabindex="-1" :text="'Trustlines'" ref="input2" @click="$router.push({ name: 'Trustlines' })" />
    </div>
</template>

<script>
import Button from '@/components/Button.vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import store from '@/js/store.js'

export default {
  name: 'Wallet',
  components: {
    VueQrcode,
    Button
  },
  data () {
    return {
      focusIndex: 0
    }
  },
  computed: {
    account () {
      return store.account
    }
  },
  methods: {
    getAccountName (account) {
      const contact = store.contacts[account]
      if (contact) return contact.name
      else return account
    },
    dropstoXRP (drops) {
      const xrp = drops / 1000000
      return xrp
    },
    onKeyDown (event) {
      switch (event.key) {
        case 'ArrowDown':
          this.focusIndex++
          this.focusInput(Object.keys(this.$refs).length)
          break
        case 'ArrowUp':
          this.focusIndex--
          this.focusInput(Object.keys(this.$refs).length)
          break
        case 'Enter':
          switch (this.focusIndex) {
            case 0:
              this.$router.push({ name: 'Accounts' })
              break
            case 1:
              this.$router.push({ name: 'QRview', params: { string: this.account.Account } })
              break
            case 2:
              this.$router.push({ name: 'Trustlines' })
          }
          break
        default:
          console.log(event.code)
      }
    },
    focusInput (length) {
      if (this.focusIndex >= length) {
        this.focusIndex = length - 1
      } else if (this.focusIndex < 0) {
        this.focusIndex = 0
      }
      const input = 'input' + this.focusIndex
      console.log(input)
      if (this.focusIndex === 0) return this.$refs[input].focus()
      this.$refs[input].$el.focus()
    }
  },
  mounted () {
    store.keys.left = {
      string: 'Back',
      fn: () => this.$router.push('/')
    }
    store.keys.center.fn = () => { return null }
    store.keys.right = {
      string: 'Scan QR',
      fn: () => this.$router.push({ name: 'QR ' })
    }
    document.addEventListener('keydown', this.onKeyDown)
    this.$refs.input0.focus()
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.onKeyDown)
  }
}
</script>

<style scoped>
#transaction-container {
  display: flex;
  flex-direction: column;
}
#top {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.account {
  font-size: 13px;
}
#transaction-list {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}
#qr-code {
  margin: 0 auto;
}
#transaction-items {
  /* display: flex; */
}
.transaction-item {
  display: flex;
  cursor: pointer;
  width: 100%;
  font-size: 14px;
  align-items: center;
}
.transaction-item.focus {
  background-color: blue;
  outline: none;
  border: none;
  color: white;
}
.transaction-item img {
  width: 25px;
  height: 25px;
}
#transaction-text {
  display: flex;
  flex-direction: column;
  width: 50%;
}
.transaction-account {
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
}
.transaction-amount {
  font-size: 14px;
  margin-left: auto;
  max-width: 300px;
  padding: 0 5px;
}
.transaction-item.focus .received {
  color: white;
}
.transaction-item.focus .withdrawl {
  color: white;
}
.transaction-item label {
  cursor: pointer;
}
.currency {
  padding-left: 5px;
}
.withdrawl {
  color: red;
}
.received {
  color: green;
}
hr {
  color: rgba(77, 79, 102);
  width: 95%;
}
p {
  margin: 0;
}
</style>
