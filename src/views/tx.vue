<template>
    <div id="transaction-details">
        <label id="transaction-type">{{ tx.tx.TransactionType }}</label>
        <label id="transaction-result" v-bind:class="{ success: tx.meta.TransactionResult === 'tesSUCCESS' }" >{{ result(tx.meta.TransactionResult) }}</label>
        <label id="transaction-time">{{ transactionDate }}</label>
        <div id="transaction-amount">
            <label class="withdrawl" v-if="tx.tx.Account === account.Account">- {{ tx.tx.Amount }}</label>
            <label class="received" v-if="tx.tx.Account !== account.Account">+ {{ tx.meta.delivered_amount }}</label>
            <label class="currency" v-if="typeof tx.meta.delivered_amount === 'object'" >{{ tx.meta.delivered_amount.currency }}</label>
            <label class="currency" v-if="typeof tx.meta.delivered_amount === 'string'">XRP</label>
        </div>
        If memo show
        <hr>
        from -> to
        <hr>
        transaction details
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
        success: this.tx.meta.TransactionResult === 'tesSUCCESS'
      }
    },
    transactionDate () {
      const epoch = new Date('2000-01-01T00:00:00Z')
      epoch.setUTCSeconds(this.tx.tx.date)
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const date = days[epoch.getDay()] + ', ' + months[epoch.getMonth()] + ' ' + epoch.getDay() + ', ' + epoch.getFullYear() + ' ' + epoch.getHours() + ':' + epoch.getMinutes()
      return date
    }
  },
  methods: {
    result (txResult) {
      switch (txResult) {
        case 'tesSUCCESS':
          return 'Success'
        default:
          return 'Failed'
      }
    }
  },
  mounted () {
    console.log(this.tx)
  }
}
</script>

<style scoped>
#transaction-details {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#transaction-type {
  font-weight: bold;
  padding-top: 40px;
  padding-bottom: 10px;
}

#transaction-result {
  font-size: 10px;
  padding: 4px 5px;
  border-radius: 5px;
  margin-bottom: 10px;
}

#transaction-result.success {
  background-color: rgb(96, 212, 96);
  color: white;
}

#transaction-amount {
  padding: 20px 25px;
  background-color: rgba(77, 79, 102, 0.1);
  border-radius: 26px;
}

hr {
    color: rgba(77, 79, 102);
    width: 95%;
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
</style>
