<template>
    <div style="height: 100%">
      <label v-if="obj.account">{{ obj.account.address }}</label>
        <input v-if="isActive" @click="onEnter()" id="createAccount" type="button" :value="'Create XRP Account :)'" ref="createBtn">
        <ol v-if="!isActive">
            <li v-for="row in obj.secret" :key="row">{{ row }}</li>
        </ol>
    </div>
</template>

<script>
import { Account } from 'xrpl-secret-numbers'

export default {
  name: 'Create',
  data () {
    return {
      isActive: true,
      obj: {},
      xrp: {
        r: '',
        s: '',
        num: []
      }
    }
  },
  methods: {
    createAccount () {
      const account = new Account()
      this.isActive = !this.isActive
      this.obj = account
      console.log(account)
    },
    onEnter () {
      if (Object.keys(this.obj).length === 0) {
        this.createAccount()
      }
    },
    press (event) {
      if (event.key === 'MicrophoneToggle' || event.key === 'Enter') this.onEnter()
    }
  },
  mounted () {
    // document.addEventListener('keypress', this.press)
    if (this.$refs.createBtn !== undefined) this.$refs.createBtn.focus()
    if (localStorage.xrp !== undefined) this.obj = JSON.parse(localStorage.xrp)
    if (localStorage.xrp) {
      this.isActive = false
      this.xrp = localStorage.xrp
    } else {
      this.isActive = true
    }
  },
  beforeDestroy () {
    // document.removeEventListener('keypress', this.press)
  },
  watch: {
    obj (newXRP) {
      localStorage.xrp = JSON.stringify(newXRP)
    }
  }
}
</script>

<style scoped>
input:focus {
  background-color: blue;
  color: white;
  outline: none;
  border: none;
}
ol {
    margin: 0;
    padding-top: 10px;
}
label {
  font-size: 12px;
}
</style>
