<template>
    <div id="transaction-container">
        <div id="top">
          <label class="account">{{ account.Account }}</label>
          <label>Balance: {{ dropstoXRP(account.Balance) }} XRP</label>
        </div>
        <hr>
        <div id="transaction-list" ref="txList">
          <div v-for="(tx, index) in transactions" :key="index" id="transaction-items">
            <div :tabindex="index" @click="info(tx)" class="transaction-item"  ref="items">
              <img src="https://www.flaticon.com/premium-icon/icons/svg/2936/2936758.svg">
              <div id="transaction-text">
                <label class="transaction-account" v-if="tx.tx.Account === account.Account">{{ tx.tx.Destination }}</label>
                <label class="transaction-account" v-if="tx.tx.Account !== account.Account">{{ tx.tx.Account }}</label>
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
    </div>
</template>

<script>
import socket from '@/js/socket.js'
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
  watch: {
    transactions (list) {
      this.$refs.items[0].focus()
    }
  },
  methods: {
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
          break
        case 'ArrowUp':
          this.focusIndex--
          break
        case 'Enter':
          this.info(this.transactions[this.focusIndex])
          // var target = event.target.defaultValue
          // if (this.items.includes(target)) {
          //   info (target)
          // } else {
          //   console.log(target)
          // }
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
      }
      // console.log(this.focusIndex)
      this.$refs.items[this.focusIndex].focus()
    }
  },
  created () {
    const obj = JSON.parse(localStorage.xrp)
    this.address = obj.account.address
    socket.subscribe(this.address)
    socket.getAccountInfo(this.address)
    socket.getAccountTx(this.address)
  },
  mounted () {
    this.$refs.items[0].focus()
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
.transaction-item:focus {
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
.transaction-item:focus .received {
  color: white;
}
.transaction-item:focus .withdrawl {
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
