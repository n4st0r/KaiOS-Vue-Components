<template>
    <div>
        <div>
          <label>{{ account.Account }}</label>
          ||
          <label>{{ account.Balance }}</label>
        </div>
        <div>
          <div v-for="(tx, index) in transactions" :key="index">
            <div @click="info(tx)" class="transaction-item">
              <label v-if="tx.tx.Account === account.Account">- {{ tx.tx.Amount }}</label>
              <label v-if="tx.tx.Account !== account.Account">+ {{ tx.meta.delivered_amount }}</label>
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
      marker: undefined
    }
  },
  computed: {
    tx () {
      return socket.getTxList()
    },
    account () {
      return store.account
    },
    transactions () {
      return store.tx
    }
  },
  methods: {
    info (tx) {
      this.$router.push({ name: 'transaction', params: { tx: tx } })
    }
  },
  created () {
    const obj = JSON.parse(localStorage.xrp)
    this.address = obj.account.address
    socket.subscribe(this.address)
    socket.getAccountInfo(this.address)
    socket.getAccountTx(this.address)
  }
}
</script>

<style scoped>
.transaction-item {
 cursor: pointer;
}
.transaction-item label {
  cursor: pointer;
}
</style>
