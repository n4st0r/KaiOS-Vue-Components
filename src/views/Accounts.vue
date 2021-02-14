<template>
    <div>
        <p v-if="!items[0]">You have no trustlines!</p>
        <ListView @enter="enter" :items="items" />
        <OptionMenu @close="optionsActive = false" @select="onSelect" v-if="optionsActive" :options="options"/>
    </div>
</template>

<script>
import store from '@/js/store'
import ListView from '@/components/ListView.vue'
import dataStore from '@/js/dataStore.worker.js'
import OptionMenu from '../components/OptionMenu.vue'

export default {
  components: { ListView, OptionMenu },
  data () {
    return {
      optionsActive: false,
      options: Array,
      focusIndex: Number
    }
  },
  computed: {
    items () {
      const arr = []
      store.accountList.forEach(acc => {
        const obj = {
          img: 'https://www.flaticon.com/svg/vstatic/svg/60/60484.svg?token=exp=1612445563~hmac=0ff1076d3fd3f99527e1baf07014cdfa',
          labels: ['name', acc]
        }
        arr.push(obj)
      })
      return arr
    }
  },
  methods: {
    async setAccountList () {
      const arr = await dataStore.getAccounts()
      store.accountList = arr
    },
    enter (index) {
      if (!this.optionsActive) {
        this.options = [{ text: 'Set as Active', fn: () => dataStore.setAccountActive(store.accountList[index]) }, { text: 'Remove Account', fn: () => dataStore.deleteAccount(store.accountList[index]) }]
      }
      this.focusIndex = index
      this.optionsActive = true
    },
    onSelect (index) {
      this.optionsActive = false
      // if () {
      // }
      // switch (index) {
      //   case 0:
      //     break
      //   case 1:
      //     break
      // }
    }
  },
  mounted () {
    this.setAccountList()
    store.keys.left = {
      string: 'Back',
      fn: () => {
        return this.$router.go(-1)
      }
    }
    store.keys.right = {
      string: 'Add',
      fn: () => {
        this.options = [{ text: 'Import Account', fn: () => this.$router.push('Import') }, { text: 'Create Account', fn: () => this.$router.push('Generate') }]
        this.optionsActive = true
        return null
      }
    }
  }
}
</script>

<style scoped>
</style>
