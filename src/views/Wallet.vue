<template>
    <div id="transaction-container">
      <div id="top">
        <label v-if="account.Account" class="account">{{ account.Account }}</label>
        <label v-if="account.Balance">Balance: {{ dropstoXRP(account.Balance) }} XRP</label>
        <label v-if="account.error === 'actNotFound'">{{ account.account }}</label>
      </div>
      <hr>
      <div v-if="transactions[0]" id="transaction-list" ref="txList">
        <div v-for="(tx, index) in transactions" :key="index" id="transaction-items">
          <div :class="{ focus: index === focusIndex}" :tabindex="index" @click="info(tx)" class="transaction-item"  ref="items">
            <img src="https://www.flaticon.com/premium-icon/icons/svg/2936/2936758.svg">
            <div id="transaction-text">
              <label class="transaction-account" v-if="tx.tx.Account === account.Account">{{ getAccountName(tx.tx.Destination) }}</label>
              <label class="transaction-account" v-if="tx.tx.Account !== account.Account">{{ getAccountName(tx.tx.Account) }}</label>
              <label>{{ tx.tx.TransactionType }}</label>
            </div>
            <div class="transaction-amount">
              <label class="withdrawl" v-if="tx.tx.Account === account.Account">- {{ dropstoXRP(tx.tx.Amount) }}</label>
              <label class="received" v-if="tx.tx.Account !== account.Account">+ {{ dropstoXRP(tx.meta.delivered_amount) }}</label>
              <label class="currency" v-if="typeof tx.meta.delivered_amount === 'object'" >{{ tx.meta.delivered_amount.currency }}</label>
              <label class="currency" v-if="typeof tx.meta.delivered_amount === 'string'">XRP</label>
            </div>
          </div>
        </div>
      </div>
      <div v-if="account.error === 'actNotFound'">
        <p>This is an unactivated account, please send at least 20 XRP to this account to activate it!</p>
      </div>
    </div>
</template>

<script>
import store from '@/js/store.js'

export default {
  name: 'Wallet',
  data () {
    return {
      marker: undefined,
      focusIndex: 0
    }
  },
  computed: {
    account () {
      return store.account
    },
    transactions () {
      return store.tx
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
    info (tx) {
      this.$router.push({ name: 'transaction', params: { tx: tx } })
    },
    onKeyDown (event) {
      switch (event.key) {
        case 'ArrowDown':
          this.focusIndex++
          this.$refs.txList.scrollBy({
            top: this.$refs.items[0].offsetHeight,
            left: 0
          })
          break
        case 'ArrowUp':
          this.focusIndex--
          this.$refs.txList.scrollBy({
            top: -this.$refs.items[0].offsetHeight,
            left: 0
          })
          break
        case 'Enter':
          this.info(this.transactions[this.focusIndex])
          break
        default:
          console.log(event.code)
      }
      this.focusInput(this.transactions.length)
    },
    focusInput (length) {
      if (this.focusIndex >= length) {
        this.focusIndex = 0
        this.$refs.txList.scrollTop = 0
      } else if (this.focusIndex < 0) {
        this.focusIndex = (length - 1)
        this.$refs.txList.scrollTop = this.$refs.txList.scrollHeight
      }
    }
  },
  mounted () {
    store.keys.left = {
      string: 'Back',
      fn: () => this.$router.push('/')
    }
    document.addEventListener('keydown', this.onKeyDown)
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
</style>
