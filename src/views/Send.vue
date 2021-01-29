<template>
    <div>
        <div v-if="!signing" class="container">
            <label>{{ TransactionType }}</label>
            <div tabindex="-1" class="transaction-item" ref="input0">
                <label>From</label>
                <div class="account">
                    <label class="name">No name</label>
                    <label>{{ Account }}</label>
                </div>
            </div>
            <hr>
            <div tabindex="-1" class="transaction-item" ref="input1">
                <label>To</label>
                <div class="account">
                    <label class="name">{{ destinationName }}</label>
                    <label>{{ Destination }}</label>
                    <div v-if="tag" id="tag">
                        <label>Tag: </label>
                        <input type="number" class="number" :value="tag">
                    </div>
                    <label v-else>No Tag</label>
                </div>
            </div>
            <hr>
            <div tabindex="-1" id="asset" class="prevent" ref="input2">
                <label>Asset</label>
                <label>XRP</label>
                <label>Available: {{ balance / 1000000 }}</label>
            </div>
            <hr>
            <div id="amount">
                <label>Amount</label>
                <input v-model="Amount" class="prevent" id="xrp" type="number" min=".000001" placeholder="Amount" ref="input3">
            </div>
            <hr>
            <div id="memo">
                <label>Memo</label>
                <input v-model="Memo" maxlength="150" placeholder="Public Memo" class="prevent" ref="input4">
            </div>
            <input type="button" value="Send &amp; Sign" @click="signTransaction()" ref="input5">
        </div>
        <Setup v-if="signing" :sign="signing" :transaction="Transaction"/>
    </div>
</template>

<script>
import store from '@/js/store.js'
import socket from '@/js/socket.js'
import Setup from '@/components/Setup.vue'

export default {
  name: 'Send',
  props: ['account', 'tag'],
  components: {
    Setup
  },
  data () {
    return {
      focusIndex: 0,
      signing: false,
      Transaction: {},
      TransactionType: 'Payment',
      Account: null,
      Destination: null,
      DestinationTag: null,
      Amount: null,
      Memo: null
    }
  },
  computed: {
    address () {
      const address = socket.getPublicAddress()
      return address
    },
    destinationName () {
      return socket.getAccountName(this.Destination)
    },
    balance () {
      return socket.getAccountBalance()
    }
  },
  methods: {
    amount (xrp) {
      const drops = xrp * 1000000
      if (drops < 1) this.$notify()
      return Math.round(drops)
    },
    toHex (input) {
      if (!input) return ''
      return Buffer.from(input, 'utf8').toString('hex').toUpperCase()
    },
    signTransaction () {
      const memo = this.toHex(this.Memo)
      const amount = this.amount(this.Amount)
      const transaction = {
        TransactionType: this.TransactionType,
        Account: this.Account,
        Destination: this.Destination,
        Amount: amount
        // Offline signing
        // Fee: 12,
        // Sequence: store.account.Sequence,
        // LastLedgerSequence: null,
      }
      if (memo || memo !== '') transaction.Memos = [{ Memo: { MemoData: memo } }]
      if (this.DestinationTag) transaction.DestinationTag = this.DestinationTag
      this.Transaction = transaction
      this.signing = true
      return null
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
        case 'Enter': {
          switch (this.focusIndex) {
            case 0:
              this.$notify({ group: 'foo', title: 'Multi wallet not implemented yet', type: 'warn' })
              break
            case 1:
              this.$router.push({ name: 'Contacts' })
              break
            case 2:
              this.$notify({ group: 'foo', title: 'IOUs not implemented yet', type: 'warn' })
              break
            case 3:
              // Amount input
              break
            case 4:
              // Memo input
              break
            case 5:
              // this.signTransaction()
          }
          break
        }
      }
    },
    focusInput (length) {
      if (this.focusIndex >= length) {
        this.focusIndex = length - 1
      } else if (this.focusIndex < 0) {
        this.focusIndex = 0
      }
      const input = 'input' + this.focusIndex
      this.$refs[input].focus()
    }
  },
  created () {
    this.Destination = this.account
    this.DestinationTag = this.tag
    this.Account = this.address
    store.keys.center.fn = () => { return null }
    store.keys.right = {
      string: 'del',
      fn: () => {
        switch (this.focusIndex) {
          case 3:
            this.Amount = this.Amount.slice(0, -1)
            break
          case 4:
            this.Memo = this.Memo.slice(0, -1)
            break
        }
      }
    }
  },
  mounted () {
    document.addEventListener('keydown', this.onKeyDown)
    document.getElementsByClassName('prevent').forEach(element => {
      element.addEventListener('keydown', e => {
        if (e.which === 38 || e.which === 40) e.preventDefault()
        // if (e.key === 'SoftRight')
        // console.log(e)
      })
    })
    this.$refs.input0.focus()
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.onKeyDown)
  }
}
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
}
.transaction-item {
    display: flex;
    flex-direction: column;
    font-size: 12px;
}
.account {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.name {
    font-weight: bold;
    margin-right: auto;
}
#tag {
    margin-right: auto;
}
#amount {
    display: flex;
    flex-direction: column;
}
#memo {
    display: flex;
    flex-direction: column;
}
#asset {
    display: flex;
    flex-direction: column;
}
hr {
  color: rgba(77, 79, 102);
  width: 95%;
}
</style>
