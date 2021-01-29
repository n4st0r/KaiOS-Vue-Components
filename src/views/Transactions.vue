<template>
    <div id="transaction-container">
      <div id="top">
        <label v-if="account.Account" class="account">{{ account.Account }}</label>
        <label v-if="account.Balance">Balance: {{ dropstoXRP(account.Balance) }} XRP</label>
        <label v-if="account.error === 'actNotFound'">{{ account.account }}</label>
      </div>
      <hr>
      <div v-if="transactions[0]" id="transaction-list" ref="txList">
        <ListView @enter="info" :items="items"/>
      </div>
      <div v-if="account.error === 'actNotFound'">
        <p>This is an unactivated account, please send at least 20 XRP to this account to activate it!</p>
      </div>
    </div>
</template>

<script>
import store from '@/js/store.js'
import ListView from '@/components/ListView.vue'

export default {
  components: { ListView },
  name: 'Wallet',
  computed: {
    account () {
      return store.account
    },
    transactions () {
      return store.tx
    },
    items () {
      const array = []
      store.tx.forEach(tx => {
        const withdrawl = tx.tx.Account === this.account.Account
        switch (tx.tx.TransactionType) {
          case 'Payment':
            array.push({
              img: 'https://www.flaticon.com/premium-icon/icons/svg/2936/2936758.svg',
              labels: [
                withdrawl ? this.getAccountName(tx.tx.Destination) : this.getAccountName(tx.tx.Account),
                tx.tx.TransactionType
              ],
              amount: {
                value: withdrawl ? '-' + this.dropstoXRP(tx.tx.Amount) : '+' + this.dropstoXRP(tx.meta.delivered_amount)
              }
            })
            break
          case 'TrustSet':
            array.push({
              img: 'https://www.flaticon.com/premium-icon/icons/svg/2936/2936758.svg',
              labels: [
                withdrawl ? this.getIssuerName(tx.tx.LimitAmount) + ' - ' + tx.tx.LimitAmount.currency : this.getAccountName(tx.tx.Account) + ' - ' + tx.tx.LimitAmount.currency,
                tx.tx.TransactionType
              ],
              amount: {}
            })
            break
          default:
            array.push({
              img: 'https://www.flaticon.com/premium-icon/icons/svg/2936/2936758.svg',
              labels: [
                withdrawl ? this.getAccountName(tx.tx.Destination) : this.getAccountName(tx.tx.Account),
                tx.tx.TransactionType
              ],
              amount: {}
            })
            break
        }
      })
      return array
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
    info (index) {
      const tx = store.tx[index]
      this.$router.push({ name: 'transaction', params: { tx: tx } })
    },
    getIssuerName (LimitAmount) {
      for (const issuer in store.curated_assets.details) {
        try {
          if (LimitAmount.issuer === store.curated_assets.details[issuer].currencies[LimitAmount.currency].issuer) return store.curated_assets.details[issuer].name
        } catch (e) {}
      }
      return LimitAmount.issuer
    }
  },
  mounted () {
    store.keys.left = {
      string: 'Back',
      fn: () => this.$router.push('/')
    }
    store.keys.center.fn = () => { return null }
    store.keys.right = {
      string: 'QR',
      fn: () => this.$router.push({ name: 'QRview', params: { string: this.account.Account } })
    }
  }
}
</script>

<style scoped>
#transaction-container {
  display: flex;
  flex-direction: column;
  height: 100%;
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
