<template>
    <div id="body">
        <div id="container">
            <label v-if="incorrect && !setup">Please try again. {{pin.length - count}} Tries left.</label>
            <label v-if="incorrect && setup">The pin code didn't match. Try again.</label>
            <label>Please enter your PIN</label>
            <div id="bullets">
                <div v-bind:class="{ bullet: true, fill: pin[count].length >= index }" v-for="index in 6" :key="index"></div>
            </div>
        </div>
        <!-- <input v-model="pin[count]" type="number" hidden> -->
    </div>
</template>

<script>
import socket from '@/js/socket.js'
import Vue from 'vue'

// props[account = account object, setup = bolean]
export default {
  name: 'setup',
  props: ['account', 'setup'],
  data () {
    return {
      pin: ['', '', '', '', '', ''],
      count: 0,
      incorrect: false
    }
  },
  methods: {
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
    next () {
      if (this.account !== undefined && this.setup) {
        if (this.count === 1) {
          if (this.pin[0] === this.pin[1]) {
            const address = this.account.account.address
            const secret = this.encrypt(this.account.account.familySeed, this.pin[0])
            socket.clear()
            localStorage.public = address
            localStorage.secret = secret
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
        if (this.count === this.pin.length) this.deleteAccount()
        try {
          this.decrypt(socket.getSecretKey(), this.pin[this.count])
          this.$notify({ group: 'foo', title: 'Unlocked!', type: 'success' })
          return setTimeout(() => this.$router.go(-1), 100)
        } catch (e) {
          console.log('Error deriving public address')
          console.log(e)
          this.incorrect = true
          this.$notify({ group: 'foo', title: 'Please try again!', type: 'error' })
        }
      }
      setTimeout(() => this.count++, 500)
      // if setup
      // if (failed)
      // ifcount === 6 delete account else this.count ++
    },
    decrypt (input, secret) {
      console.log(`Input: ${input}, secret: ${secret}`)
      const key = this.$CryptoJS.PBKDF2(secret, this.$CryptoJS.enc.Hex.parse(input.substr(0, 32)) /* Salt */, { keySize: 256 / 32, iterations: 100 })
      const output = this.$CryptoJS.AES.decrypt(input.substring(64) /* encrypted */, key, { iv: this.$CryptoJS.enc.Hex.parse(input.substr(32, 32)) /* iv */, padding: this.$CryptoJS.pad.Pkcs7, mode: this.$CryptoJS.mode.CBC }).toString(this.$CryptoJS.enc.Utf8)
      if (!output) throw new Error('The secret did not unlock the string')
      return output
    },
    encrypt (input, secret) {
      // https://gist.github.com/WietseWind/fd8b0b9e888f58a747e18b31636ad423
      console.log(`Input: ${input}, secret: ${secret}`)
      const salt = this.$CryptoJS.lib.WordArray.random(128 / 8)
      const iv = this.$CryptoJS.lib.WordArray.random(128 / 8)
      const encrypted = this.$CryptoJS.AES.encrypt(input, this.$CryptoJS.PBKDF2(secret, salt, { keySize: 256 / 32, iterations: 100 }) /* key */, { iv: iv, padding: this.$CryptoJS.pad.Pkcs7, mode: this.$CryptoJS.mode.CBC })
      const output = salt.toString() + iv.toString() + encrypted.toString()
      return output
    },
    deleteAccount () {
      localStorage.removeItem('public')
      localStorage.removeItem('secret')
      socket.clear()
    }
  },
  mounted () {
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
}
#container {
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
    height: 16px;
    width: 16px;
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
