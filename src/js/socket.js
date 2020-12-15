import Vue from 'vue'
// import RippledWsClient from 'rippled-ws-client'
import store from './store.js'
const url = 'wss://testnet.xrpl-labs.com'
// const url = 'wss://xrpl.ws'
let server

const init = () => {
  const address = getPublicAddress()
  if (address !== null && address !== undefined) {
    const account = address
    subscribe(account)
    getAccountInfo(account)
    getAccountTx(account)
  }
}

const connect = () => {
  if (server !== undefined && state() === 1) return server
  return new Promise((resolve, reject) => {
    server = new WebSocket(url)

    server.onopen = () => {
      init()
      resolve(server)
      console.log('ws opened!')
      Vue.notify({
        group: 'foo',
        title: 'Connected',
        type: 'success'
      })
    }

    server.onmessage = (msg) => {
      parseMsg(msg)
    }

    server.onerror = (err) => {
      reject(err)
    }
  })
}

const close = () => {
  return new Promise((resolve, reject) => {
    server.onclose = (msg) => {
      console.log('WebSocket Closed')
      resolve(msg)
    }

    server.onerror = (err) => {
      reject(err)
    }

    server.close()
  })
}

const state = () => {
  switch (server.readyState) {
    case 0:
      return 0
    case 1:
      return 1
    case 2:
      return 2
    case 3:
      return 3
  }
}

const command = (com) => {
  server.send(JSON.stringify(com))
}

var subscriptions = []

const subscribe = (address) => {
  if (subscriptions.includes(address)) return null
  subscriptions.push(address)
  command({
    command: 'subscribe',
    accounts: [address]
  })
  console.log('Subscribe: ' + address)
}

const getAccountInfo = (address) => {
  command({
    command: 'account_info',
    account: address
  })
  console.log('getAccountInfo: ' + address)
}

const getAccountTx = (address) => {
  command({
    command: 'account_tx',
    account: address,
    ledger_index_min: -1,
    ledger_index_max: -1,
    limit: 100,
    forward: false
  })
  console.log('getAccountTx: ' + address)
}

function setAccount (account) {
  store.account = account
}

const getPublicAddress = () => {
  const address = localStorage.public
  if (address !== undefined) {
    return address
  } else {
    return null
  }
}

const clear = () => {
  localStorage.clear()
  store.account = {}
  store.tx = []
}

function addTx (tx) {
  const account = store.account.Account
  const delivered = tx.meta.delivered_amount
  store.tx.unshift(tx)
  if (tx.tx.Account !== account) {
    if (typeof delivered === 'string') {
      Vue.notify({
        group: 'foo',
        type: 'warn',
        title: 'Outgoing Transaction',
        text: `Send ${delivered / 1000000} XRP with a new transaction!`
      })
    } else {
      Vue.notify({
        group: 'foo',
        type: 'warn',
        title: 'Outgoing Transaction',
        text: 'Send a new transaction!'
      })
    }
  } else {
    if (typeof delivered === 'string') {
      Vue.notify({
        group: 'foo',
        type: 'warn',
        title: 'Incoming Transaction',
        text: `Received XRP ${delivered / 1000000} from a new transaction!`
      })
    } else {
      Vue.notify({
        group: 'foo',
        type: 'warn',
        title: 'Incoming Transaction',
        text: 'Received a new transaction!'
      })
    }
  }
}

function setTx (arr) {
  store.tx = arr
}

const parseMsg = (msg) => {
  const obj = JSON.parse(msg.data)
  console.log(obj)

  if (obj.status === 'success') {
    const result = obj.result
    if (typeof result.account_data !== 'undefined') {
      const account = result.account_data
      // TODO
      // this.setAmount(acc.Account, acc.Balance)
      setAccount(account)
    } else if (typeof result.transactions !== 'undefined') {
      const tx = result.transactions
      // const address = res.account
      setTx(tx)
    }
  } else if (obj.status === 'closed' && obj.type === 'transaction') {
    const tx = obj.transaction
    const meta = obj.meta
    if (typeof tx !== 'undefined' && typeof meta !== 'undefined') {
      const transaction = {
        meta: meta,
        tx: tx,
        validated: false
      }
      addTx(transaction)
    }
  } else if (obj.status === 'error' && obj.error === 'actNotFound' && obj.request.command === 'account_info') {
    setAccount(obj)
  }
}

export default {
  connect,
  init,
  close,
  state,
  subscribe,
  getAccountInfo,
  getAccountTx,
  getPublicAddress,
  clear
}
