<template>
    <div>
        <div v-if="!signing" class="container">
            <label>{{ TransactionType }}</label>
            <div tabindex="-1" class="account" ref="input0">
              <label>No name yet</label>
              <label>{{ Account }}</label>
            </div>
            <hr>
            <div tabindex="-1" class="transaction-item" ref="input1">
                <img :src="issuerAvatar">
                <div class="issuer">
                    <label>Issuer</label>
                    <label class="name">{{ issuerName }}</label>
                    <label>{{ LimitAmount.issuer }}</label>
                </div>
            </div>
            <hr>
            <div tabindex="-1" id="asset" ref="input2">
                <label>Currency</label>
                <label>{{ LimitAmount.currency }}</label>
            </div>
            <hr>
            <label>Max Limit: {{ LimitAmount.value }}</label>
            <hr>
            <label>Fee: UNDEFINED!!!</label>
            <hr>
            <input type="button" value="Send &amp; Sign" @click="signTransaction()" ref="input3">
        </div>
        <OptionMenu @select="select" v-if="options" :options="items" />
        <Setup v-if="signing" :sign="signing" :transaction="Transaction" />
    </div>
</template>

<script>
// https://xrpl.org/trustset.html
import Setup from '@/components/Setup.vue'
import socket from '@/js/socket'
import store from '@/js/store'
import OptionMenu from '../components/OptionMenu.vue'
import Vue from 'vue'

export default {
  props: {
    remove: Boolean,
    trustline: Object
  },
  components: {
    Setup,
    OptionMenu
  },
  data () {
    return {
      focusIndex: 0,
      options: false,
      signing: false,
      issuerIndex: 0,
      Transaction: {},
      TransactionType: 'TrustSet',
      Account: null,
      LimitAmount: {
        currency: '',
        issuer: '',
        value: '999999999'
      }
    }
  },
  computed: {
    getIssuerInfo () {
      const account = this.LimitAmount.issuer
      const currency = this.LimitAmount.currency
      for (const issuer in store.curated_assets.details) {
        try {
          if (account === store.curated_assets.details[issuer].currencies[currency].issuer) return store.curated_assets.details[issuer]
        } catch (e) {}
      }
      return null
    },
    issuerAvatar () {
      if (this.trustline) {
        if (this.getIssuerInfo) return this.getIssuerInfo.avatar
        else return 'https://www.flaticon.com/premium-icon/icons/svg/3425/3425009.svg'
      }
      return store.curated_assets.details[this.issuers[this.issuerIndex]].avatar
    },
    issuerName () {
      if (this.trustline) {
        if (this.getIssuerInfo) return this.getIssuerInfo.name
        else return null
      } else return this.issuers[this.issuerIndex]
    },
    items () {
      if (this.focusIndex === 1) return Object.keys(this.details)
      if (this.focusIndex === 2) return Object.keys(this.details[this.issuers[this.issuerIndex]].currencies)
      return null
    },
    issuers () {
      return store.curated_assets.issuers
    },
    details () {
      return store.curated_assets.details
    },
    currencies () {
      return store.curated_assets.currencies
    }
  },
  methods: {
    select (index) {
      console.log(index)
      this.options = false
      if (this.focusIndex === 1) this.issuerIndex = index
      if (this.focusIndex === 2) {
        Vue.set(this.LimitAmount, 'currency', this.currencies[index])
        Vue.set(this.LimitAmount, 'issuer', this.details[this.issuers[this.issuerIndex]].currencies[this.LimitAmount.currency].issuer)
      }
    },
    signTransaction () {
      if (this.remove) this.$notify({ group: 'foo', title: 'Sign to remove TrustLine', type: 'warn' })
      const transaction = {
        TransactionType: this.TransactionType,
        Account: this.Account,
        LimitAmount: {
          currency: this.LimitAmount.currency,
          issuer: this.LimitAmount.issuer,
          value: this.LimitAmount.value
        },
        Flags: '2149711872'
      }
      this.Transaction = transaction
      this.signing = true
    },
    onKeyDown (event) {
      if (this.options) return
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
              this.$notify({ group: 'foo', title: 'Multi wallet not implemented yet', type: 'warn' })
              break
            case 1:
              this.options = true
              break
            case 2:
              this.options = true
          }
          break
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
  mounted () {
    document.addEventListener('keydown', this.onKeyDown)
    this.Account = socket.getPublicAddress()
    this.$refs.input0.focus()
    if (this.remove) {
      this.LimitAmount = {
        issuer: this.trustline.account,
        currency: this.trustline.currency,
        value: '0'
      }
    }
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.onKeyDown)
  }
}
</script>

<style scoped>
.account {
  display: flex;
  flex-direction: column
}
.transaction-item {
  display: flex;
  flex-direction: row;
}
.transaction-item img {
  width: 25px;
  height: 25px;
  object-fit: contain;
  margin: auto 0;
  padding: 0 10px;
}
.issuer {
  display: flex;
  flex-direction: column;
}
#asset {
  display: flex;
  flex-direction: column;
}
</style>
