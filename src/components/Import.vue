<template>
    <div>
      <label v-if="account">{{ account.account.address }}</label>
      <div class="container">
        <ol>
            <li v-for="(row, index) in num" :key="index">{{ row }}</li>
        </ol>
        <div class="container">
          <input  v-model="num[focus]"
                  oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                  placeholder="XXXXXX"
                  maxlength="6"
                  type="number"
                  ref="importInput"
                  @click="next()"
                  id="input-secret"
                  v-bind:class="{ error: error, success: ready}">
          <input id="save-button" type="button" @click="newAccount()" value="Save" :disabled="!ready" ref="save">
        </div>
      </div>
      {{ account }}
    </div>
</template>

<script>
import Vue from 'vue'
import { Account, Utils } from 'xrpl-secret-numbers'

export default {
  name: 'Import',
  props: ['account'],
  data () {
    return {
      num: ['492175', '359220', '287100', '426011', '235590', '073746', '495630', '099443'],
      // num: ['', '', '', '', '', '', '', ''],
      focus: 0,
      ready: false,
      error: false
    }
  },
  computed: {
    secret () {
      var secretnumber
      this.num.forEach(element => {
        secretnumber = secretnumber + element + ''
      })
      return secretnumber
    }
  },
  methods: {
    newAccount () {
      try {
        const account = new Account(this.secret)
        this.$router.push({ name: 'Setup', params: { account: account, setup: true } })
        console.log(account)
      } catch (e) {}
    },
    next () {
      const index = this.focus
      if (this.num[index].length < 6) return
      this.error = false
      if (!Utils.checkChecksum(index, this.num[index])) {
        this.$notify({ group: 'foo', title: 'Invalid numbers', type: 'error' })
        this.error = true
        return false
      }
      if (this.account !== undefined && this.num[index] !== this.account.secret[index]) {
        this.$notify({ group: 'foo', title: 'Numbers do not match', type: 'error' })
        this.error = true
        return false
      }
      if (index === 7) {
        this.num.forEach((element, i) => {
          if (element.length !== 6) {
            this.focus = i
            this.error = true
          }
        })
        this.ready = true
        this.$refs.save.focus()
      } else if (this.num[this.focus].length === 6) this.focus++
    },
    onKeyDown (event) {
      switch (event.key) {
        case 'Enter':
          this.next()
          break
        case 'SoftRight':
          var newValue = this.num[this.focus].slice(0, -1)
          Vue.set(this.num, this.focus, newValue)
          break
      }
    }
  },
  mounted () {
    // TODO DELTE ME! Only for test purposes
    // this.num = this.account.secret

    this.$refs.importInput.focus()
    document.addEventListener('keydown', this.onKeyDown)
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.onKeyDown)
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
li {
  width: 60px;
}
label {
  width: 60px;
}
#input-secret {
  width: 60px;
  max-height: 14px;
  outline-color: blue;
}
#input-secret.error {
  outline-color: red !important;
}
#input-secret.success {
  outline-color: green !important;
}
#save-button:focus {
  color: white;
  background-color: blue;
}
</style>
