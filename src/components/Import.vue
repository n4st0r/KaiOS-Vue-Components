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
                  @click="next()">
          <input type="button" @click="newAccount()" value="Save" :disabled="!ready" ref="save">
        </div>
      </div>
    </div>
</template>

<script>
import { Account } from 'xrpl-secret-numbers'

export default {
  name: 'Import',
  data () {
    return {
      num: ['', '', '', '', '', '', '', ''],
      focus: 0,
      ready: false
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
      const account = new Account(this.secret)
      localStorage.xrp = JSON.stringify(account)
      console.log(account)
    },
    next () {
      Utils.checkChecksum(position: number, value: number)
      if (this.focus === 7) {
        this.num.forEach((element, index) => {
          if (element.length !== 6) {
            this.focus = index
          }
        })
        this.ready = true
        this.$refs.save.focus()
      } else if (this.num[this.focus].length === 6) this.focus++
    },
    onKeyDown (event) {
      switch (event.key) {
        // case 'SoftLeft':
        //   this.$router.go(-1)
        //   break
        case 'Enter':
          this.next()
          break
        // case 'SoftRight':
        //   this.$notify({
        //     group: 'foo',
        //     title: 'Important message',
        //     text: 'Hello user!'
        //   })
        //   break
        default:
          this.eve = event.key
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
label {
  width: 60px;
}
input {
  width: 60px;
  max-height: 14px;
}
</style>
