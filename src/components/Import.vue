<template>
    <div>
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
    </div>
</template>

<script>
import Vue from 'vue'
import { Account, Utils } from 'xrpl-secret-numbers'
import socket from '@/js/socket.js'

export default {
  name: 'Import',
  data () {
    return {
      num: ['', '', '', '', '', '', '', ''],
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
        localStorage.xrp = JSON.stringify(account)
        console.log(account)
        socket.init()
        this.$notify({
          group: 'foo',
          title: 'Imported an XRP Account',
          type: 'success'
        })
        this.$router.push('/')
      } catch (e) {}
    },
    next () {
      const index = this.focus
      if (this.num[index].length < 6) return
      this.error = false
      if (!Utils.checkChecksum(index, this.num[index])) {
        this.$notify({
          group: 'foo',
          title: 'Invalid numbers',
          type: 'error'
        })
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
