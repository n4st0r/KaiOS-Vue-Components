import Vue from 'vue'
import RippledWsClient from 'rippled-ws-client'
import RippledWsClientSign from 'rippled-ws-client-sign'
import store from './store.js'
// const url = 'wss://s.devnet.rippletest.net:51233'
const url = 'wss://testnet.xrpl-labs.com'
// const url = 'wss://xrpl.ws'
let server

const init = () => {
  const address = getPublicAddress()
  if (address !== null && address !== undefined) {
    const account = address
    subscribe(account)
    setAccountInfo(account)
    setAccountTx(account)
  }
}

const connect = () => {
  // if (server !== undefined && state() === 1) return server
  if (server !== undefined && server.getState().online) return server
  return new Promise((resolve, reject) => {
    new RippledWsClient(url).then(connection => {
      server = connection
      console.log('ws opened!')
      Vue.notify({
        group: 'foo',
        title: 'Connected',
        type: 'success'
      })

      init()

      server.on('transaction', tx => addTx(tx))

      resolve(connection)
    }).catch(error => {
      reject(error)
      console.log('Error connection to Websocket')
    })
  })
}

const close = () => {
  return new Promise((resolve, reject) => {
    server.close().then(msg => {
      resolve(msg)
    }).catch(e => reject(e))
  })
}

const state = () => {
  return server.getState().online
}

const command = (com) => {
  console.log(`Command: ${com.command}`)
  return new Promise((resolve, reject) => {
    server.send(com).then(msg => {
      resolve(msg)
    }).catch(e => reject(e))
  })
}

var subscriptions = []

const subscribe = (address) => {
  if (subscriptions.includes(address)) return null
  subscriptions.push(address)
  command({
    command: 'subscribe',
    accounts: [address]
  })
}

const setAccountTx = async (account) => {
  const msg = await command({
    command: 'account_tx',
    account: account,
    ledger_index_min: -1,
    ledger_index_max: -1,
    limit: 100,
    forward: false
  })
  store.tx = msg.transactions
}

const setAccountInfo = async (account) => {
  const msg = await command({
    command: 'account_info',
    account: account
  })
  if (msg.account_data) store.account = msg.account_data
  else store.account = msg
}

const getPublicAddress = () => {
  const address = localStorage.public
  if (address !== undefined) {
    return address
  } else {
    return null
  }
}

const getAccountBalance = () => {
  return store.account.Balance
}

const getSecretKey = () => {
  const secret = localStorage.secret
  if (secret !== undefined) {
    return secret
  } else {
    return null
  }
}

const signTransaction = (transaction, seed) => {
  console.log(transaction)
  console.log(seed)
  return new Promise((resolve, reject) => {
    new RippledWsClientSign(transaction, seed, server).then(signedTX => {
      resolve(signedTX)
    }).catch(error => {
      console.log(error)
      reject(error)
    })
  })
}

const clear = () => {
  localStorage.clear()
  store.account = {}
  store.tx = []
  console.log('Cleared all! FUNDS ARE SAFE!')
  Vue.notify({ group: 'foo', type: 'warn', title: 'FUNDS ARE SAFE!', text: 'Cleared all!' })
}

const clone = (obj) => Object.assign({}, obj)
const renameKey = (object, key, newKey) => {
  const clonedObj = clone(object)
  const targetKey = clonedObj[key]

  delete clonedObj[key]
  clonedObj[newKey] = targetKey
  return clonedObj
}

const addTx = (tx) => {
  console.log('Received a TX')
  console.log(tx)
  const account = store.account.Account
  const delivered = tx.meta.delivered_amount

  tx = renameKey(tx, 'transaction', 'tx')
  store.tx.unshift(tx)
  if (tx.Account !== account) {
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

// const parseMsg = (msg) => {
//   const obj = msg
//   // const obj = JSON.parse(msg.data)
//   console.log(obj)

//   if (obj.status === 'success') {
//     const result = obj.result
//     if (typeof result.account_data !== 'undefined') {
//       const account = result.account_data
//       // TODO
//       // this.setAmount(acc.Account, acc.Balance)
//       setAccount(account)
//     } else if (typeof result.transactions !== 'undefined') {
//       const tx = result.transactions
//       // const address = res.account
//       setTx(tx)
//     }
//   } else if (obj.status === 'closed' && obj.type === 'transaction') {
//     const tx = obj.transaction
//     const meta = obj.meta
//     if (typeof tx !== 'undefined' && typeof meta !== 'undefined') {
//       const transaction = {
//         meta: meta,
//         tx: tx,
//         validated: false
//       }
//       addTx(transaction)
//     }
//   } else if (obj.status === 'error' && obj.error === 'actNotFound' && obj.request.command === 'account_info') {
//     setAccount(obj)
//   }
// }

export default {
  connect,
  init,
  close,
  state,
  subscribe,
  setAccountInfo,
  setAccountTx,
  getPublicAddress,
  clear,
  getSecretKey,
  signTransaction,
  getAccountBalance
}
