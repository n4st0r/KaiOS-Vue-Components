<template>
    <div id="body">
        <div v-if="!busy" class="container">
            <label v-if="incorrect && !setup">Please try again. {{pin.length - count}} Tries left.</label>
            <label v-if="incorrect && setup">The pin code didn't match. Try again.</label>
            <label>Please enter your PIN</label>
            <div id="bullets">
                <div v-bind:class="{ bullet: true, fill: pin[count].length >= index }" v-for="index in 6" :key="index"></div>
            </div>
        </div>
        <div class="container" v-else>
          <Spinner />
        </div>
    </div>
</template>

<script>
import store from '@/js/store'
import socket from '@/js/socket.js'
import Vue from 'vue'
import Spinner from './Spinner.vue'

import dataStore from '@/js/dataStore.worker.js'

// props[account = account object, setup = bolean]
export default {
  components: { Spinner },
  name: 'setup',
  props: ['account', 'setup', 'transaction', 'sign'],
  data () {
    return {
      pin: ['', '', '', '', '', ''],
      count: 0,
      incorrect: false,
      busy: false
    }
  },
  methods: {
    fail () {
      window.navigator.vibrate(200)
      dataStore.wrongPin()
      if (dataStore.getPinTries() === this.pin.length) this.deleteAccount()
      this.$notify({ group: 'foo', title: 'Please try again!', type: 'error' })
      this.incorrect = true
      setTimeout(() => this.count++, 500)
    },
    onKeyDown (event) {
      switch (event.key) {
        case 'Enter':
          break
        case 'SoftRight':
          Vue.set(this.pin, this.count, '')
          break
      }
      if (!isNaN(event.key)) {
        const push = this.pin[this.count] + event.key.toString()
        Vue.set(this.pin, this.count, push)
        if (this.pin[this.count].length === 6) this.next()
      }
    },
    async next () {
      if (this.account !== undefined && this.setup) {
        if (this.count === 1) {
          if (this.pin[0] === this.pin[1]) {
            const address = this.account.account.address
            const secret = this.encrypt(this.account.account.familySeed, this.pin[0])
            dataStore.addAccount(secret, address)
            this.$notify({ group: 'foo', title: 'Created an Account!', type: 'success' })
            socket.init()
            setTimeout(() => this.$router.push('/'), 2000)
          } else {
            this.$notify({ group: 'foo', title: 'No match', type: 'error' })
            this.incorrect = true
            setTimeout(() => {
              this.count = 0
              Vue.set(this.pin, 0, '')
              Vue.set(this.pin, 1, '')
            }, 500)
          }
          return null
        }
      } else {
        let seed
        try {
          const secret = await dataStore.getAccountSecret()
          console.log(secret)
          seed = this.decrypt(secret, this.pin[this.count])
          if (dataStore.getPinTries()) dataStore.resetPinCount()
        } catch (e) {
          console.log('Error deriving public address')
          console.log(e)
          return this.fail()
        }
        if (this.sign) {
          try {
            this.busy = true
            const signedTX = await socket.signTransaction(this.transaction, seed)
            // Offline transaction
            // socket.submitTransaction(signedTX.tx_blob)
            console.log(signedTX)
            this.$notify({ group: 'foo', title: 'Signed a TX', type: 'success' })
            this.$router.push('/')
          } catch (e) {
            console.log(e)
            this.$notify({ group: 'foo', title: 'Error signing the Transaction', type: 'error' })
            this.$router.go(-1)
          }
        } else {
          console.log(this.sign)
          this.$notify({ group: 'foo', title: 'Unlocked!', type: 'success' })
        }
        return this.$emit('success')
      }
      setTimeout(() => this.count++, 500)
    },
    decrypt (input, secret) {
      return dataStore.decrypt(input, secret)
    },
    encrypt (input, secret) {
      return dataStore.encrypt(input, secret)
      // https://gist.github.com/WietseWind/fd8b0b9e888f58a747e18b31636ad423
    },
    deleteAccount () {
      dataStore.clearAllData()
      socket.clear()
    }
  },
  mounted () {
    store.keys.right = {
      string: 'del',
      fn: () => Vue.set(this.pin, this.count, this.pin[this.count].slice(0, -1))
    }
    if (!this.setup) {
      const tries = dataStore.getPinTries()
      if (tries && tries >= 1) {
        this.count = tries
        this.incorrect = true
      }
    }
    document.addEventListener('keydown', this.onKeyDown)
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.onKeyDown)
  }
}
</script>

<style scoped>
#body {
    display: flex;
    align-items: center;
    height: 100%;
}
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
}
#bullets {
    display: flex;
    flex-direction: row;
}

.bullet {
    border: 2px solid grey;
    border-radius: 20px;
    margin: 10px;
    height: 12px;
    width: 12px;
    display: flex;
    align-items: center;
}
.bullet.fill {
    background-color: grey;
}

.hole {
    border-radius: 20px;
    background-color: blue;
    width: 60%;
    height: 60%;
    margin: 0 auto;
}
</style>
