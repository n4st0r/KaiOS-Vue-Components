import Vue from 'vue'
import router from '../router'

const store = Vue.observable({
  keys: {
    left: {
      string: 'Back',
      fn: () => router.go(-1)
    },
    center: {
      string: 'Enter',
      fn: () => { return null }
    },
    right: {
      string: 'toggle',
      fn: () => { return null }
    }
  },
  account: {},
  tx: [],
  contacts: [
    {
      id: 'id',
      name: 'Santa',
      accounts: [
        { account: 'rh5juM8LsHPw5doRJopaihzqn2pJnRVBNr', tag: 89416 }
      ]
    },
    {
      id: 'id1',
      name: 'Rudolph',
      accounts: [
        { account: 'rh5juM8LsHPw5doRJopaihzqn2pJnRVBNr', tag: 89416 }
      ]
    },
    {
      id: 'id2',
      name: 'Antonio',
      accounts: [
        { account: 'rh5juM8LsHPw5doRJopaihzqn2pJnRVBNr' }
      ]
    }
  ]
})

export default store
