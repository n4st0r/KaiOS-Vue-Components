<template>
    <div class="container">
      <label v-if="account">{{ account.account.address }}</label>
      <label v-else>Enter your secret numbers</label>
      <div class="row">
        <ol>
            <li v-for="(row, index) in num" :key="index">{{ row }}</li>
        </ol>
        <div>
      <!--                   type="number" -->
          <input  v-model="num[focus]"
                  oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                  placeholder="XXXXXX"
                  maxlength="6"
                  ref="importInput"
                  @click="next()"
                  id="input-secret"
                  v-bind:class="{ error: error, success: ready }"
                  class="prevent">
          <input id="save-button" type="button" @click="newAccount()" value="Save" :disabled="!ready" ref="save">
        </div>
      </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { Account, Utils } from 'xrpl-secret-numbers'
import store from '@/js/store'

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
    async newAccount () {
      try {
        const account = new Account(this.secret)
        this.$router.push({ name: 'Setup', params: { account: account, setup: true } })
        console.log(account)
      } catch (e) {
        console.log(e)
      }
    },
    next () {
      const index = this.focus
      if (this.num[index].length < 6) {
        return this.$notify({ group: 'foo', title: 'Each row has 6 numbers', type: 'error' })
      }
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
      if (event.which === 8) {
        event.preventDefault()
      }

      if (Number.isInteger(parseInt(event.key))) {
        if (this.num[this.focus].length < 6) {
          Vue.set(this.num, this.focus, this.num[this.focus] + event.key)
        }
      }

      switch (event.key) {
        case 'Enter':
          this.next()
          break
        case 'Backspace': {
          event.preventDefault()
          const newValue = this.num[this.focus].slice(0, -1)
          Vue.set(this.num, this.focus, newValue)
          break
        }
      }
    }
  },
  mounted () {
    // TODO DELTE ME! Only for test purposes
    // this.num = this.account.secret
    // document.getElementsByClassName('prevent').forEach(element => {
    //   element.addEventListener('keydown', e => {
    //     if (e.which === 38 || e.which === 40) {
    //       e.preventDefault()
    //     }
    //   })
    // })

    store.keys.left = {
      string: 'Back',
      fn: () => this.$router.go(-1)
    }
    // this.$refs.importInput.focus()
    document.addEventListener('keydown', this.onKeyDown)

    store.keys.right.string = 'delete'
    store.keys.right.fn = () => {
      var newValue = this.num[this.focus].slice(0, -1)
      Vue.set(this.num, this.focus, newValue)
    }
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.onKeyDown)
  }
}
</script>

<style scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}
.row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
li {
  width: 60px;
}
label {
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
