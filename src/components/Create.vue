<template>
    <div style="height: 100%">
      <input @click="onEnter()" id="createAccount" type="button" :value="'Create XRP Account'" ref="createBtn">
      <div v-if="obj.account && !isActive" class="container">
        <label>{{ obj.account.address }}</label>
        <div class="row">
          <ol>
            <li v-for="row in obj.secret" :key="row">{{ row }}</li>
          </ol>
          <VueQrcode :value="obj.account.address" :options="{ width: 115 }"></VueQrcode>
        </div>
      </div>
      {{ test }}
    </div>
</template>

<script>
import { Account } from 'xrpl-secret-numbers'
import VueQrcode from '@chenfengyuan/vue-qrcode'

export default {
  name: 'Create',
  components: {
    VueQrcode
  },
  data () {
    return {
      isActive: true,
      obj: {},
      test: null
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
      } else {
        this.$router.push({ name: 'Import', params: { account: this.obj } })
      }
    }
  },
  mounted () {
    if (this.$refs.createBtn !== undefined) this.$refs.createBtn.focus()
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
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
}
</style>
