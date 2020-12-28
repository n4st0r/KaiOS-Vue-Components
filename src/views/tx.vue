<template>
    <div id="transaction-details" v-if="tx" ref="transaction">
        <label id="transaction-type">{{ tx.tx.TransactionType }}</label>
        <label id="transaction-result" v-bind:class="{ success: tx.meta.TransactionResult === 'tesSUCCESS' }" >{{ result(tx.meta.TransactionResult) }}</label>
        <label id="transaction-time">{{ transactionDate }}</label>
        <div id="transaction-amount">
            <label class="withdrawl" v-if="tx.tx.Account === account.Account">- {{ dropstoXRP(tx.tx.Amount) }}</label>
            <label class="received" v-if="tx.tx.Account !== account.Account">+ {{ dropstoXRP(tx.meta.delivered_amount) }}</label>
            <label class="currency" v-if="typeof tx.meta.delivered_amount === 'object'" >{{ tx.meta.delivered_amount.currency }}</label>
            <label class="currency" v-if="typeof tx.meta.delivered_amount === 'string'">XRP</label>
        </div>
        <div id="transaction-memo" v-if="tx.tx.Memos">
          <label class="header"><img src="https://www.flaticon.com/svg/static/icons/svg/40/40064.svg" width="15px" max-height="15px">Memo</label>
          <label v-if="tx.tx.Memos[0].Memo.MemoType">{{ hextoString(tx.tx.Memos[0].Memo.MemoType) }}: {{ hextoString(tx.tx.Memos[0].Memo.MemoData) }}</label>
          <label v-if="tx.tx.Memos[0].Memo.MemoFormat">Format: {{ hextoString(tx.tx.Memos[0].Memo.MemoFormat) }}</label>
        </div>

        <hr>

        <div id="transfer">

          <label class="header">From</label>
          <div class="account">
            <img src="https://www.flaticon.com/svg/static/icons/svg/214/214362.svg" width="25px" max-height="25px">
            <div class="column">
              <label class="bold">name here</label>
              <label>{{ tx.tx.Account }}</label>
            </div>
          </div>

          <img class="arrow" src="https://www.flaticon.com/svg/static/icons/svg/2223/2223613.svg">
          <label class="header">To</label>
          <div class="account">
            <img src="https://www.flaticon.com/svg/static/icons/svg/214/214362.svg" width="25px" max-height="25px">
            <div class="column">
              <label class="bold">name here</label>
              <label>{{ tx.tx.Destination }}</label>
              <label>{{ tx.tx.DestinationTag }}</label>
            </div>
          </div>
        </div>

        <hr>

        <label class='header'>Transaction id</label>
        <span>{{ tx.tx.hash }}</span>
        <label class='header'>Fees</label>
        <label>{{ dropstoXRP(tx.tx.Fee) }}</label>
        <label class='header'>Status</label>
        <label>Validated = {{ tx.validated }}</label>
    </div>
</template>

<script>
import store from '@/js/store.js'

export default {
  name: 'transaction',
  props: ['tx'],
  computed: {
    account () {
      return store.account
    },
    classObject () {
      // Not in use!
      return {
        success: this.tx.meta.TransactionResult === 'tesSUCCESS',
        failed: this.tx.meta.TransactionResult !== 'tesSUCCESS'
      }
    },
    transactionDate () {
      const epoch = new Date('2000-01-01T00:00:00Z')
      epoch.setUTCSeconds(this.tx.tx.date)
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const time = function () {
        let hour = epoch.getHours().toString()
        let minute = epoch.getMinutes().toString()
        if (hour.length === 1) {
          hour = '0' + hour
        }
        if (minute.length === 1) {
          minute = '0' + minute
        }
        return `${hour}:${minute}`
      }
      const date = days[epoch.getDay()] + ', ' + months[epoch.getMonth()] + ' ' + epoch.getDate() + ', ' + epoch.getFullYear() + ' ' + time()
      return date
    }
  },
  methods: {
    dropstoXRP (drops) {
      const xrp = drops / 1000000
      return xrp
    },
    hextoString (input) {
      if (!input || input === '') return null
      const output = Buffer.from(input, 'hex')
      return output
    },
    result (txResult) {
      switch (txResult) {
        case 'tesSUCCESS':
          return 'Success'
        default:
          return 'Failed'
      }
    }
  },
  created () {
    if (!this.tx) this.$router.push({ name: 'Wallet' })
  },
  mounted () {
    console.log(this.tx)
    if (this.$refs.transaction) this.$refs.transaction.focus()
    store.keys.right = {
      string: 'Add Contact',
      fn: () => this.$router.push({ name: 'Contact', params: { contact: { name: null, accounts: [{ account: this.tx.tx.Account === this.account.Account ? this.tx.tx.Destination : this.tx.tx.Account, tag: this.tx.tx.DestinationTag }] }, add: true } })
    }
  }
}
</script>

<style scoped>
#transaction-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}

#transaction-type {
  font-weight: bold;
  padding-top: 15px;
  padding-bottom: 5px;
}

#transaction-result {
  font-size: 10px;
  padding: 4px 5px;
  border-radius: 5px;
  margin-bottom: 5px;
}

#transaction-result.success {
  background-color: rgb(96, 212, 96);
  color: white;
}
#transaction-result.failed {
  background-color: rgb(212, 96, 96);
  color: white;
}

#transaction-time {
  font-size: 12px;
  font-style: italic;
}

#transaction-amount {
  padding: 10px 15px;
  background-color: rgba(77, 79, 102, 0.1);
  border-radius: 20px;
  margin: 10px 0;
}

#transaction-memo {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
}

#transfer {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.account {
  font-size: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 15px;
  background-color: rgba(77, 79, 102, 0.1);
  border-radius: 20px;
  margin: 10px 0;
  width: 95%;
}

.column {
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  width: 80%;
}
.column label {
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
}

hr {
  color: rgba(77, 79, 102);
  width: 95%;
}

span {
  display: inline-block;
  overflow-wrap: anywhere;
  word-wrap: anywhere;
  word-break: break-all;
  font-size: 13px;
}

.arrow {
  max-width: 25px;
  height: 25px;
  align-self: center;
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

.header {
  font-size: 14px;
  font-weight: bold;
}

.bold {
  font-weight: bold;
}
</style>
