import Vue from 'vue'
import RippledWsClient from 'rippled-ws-client'
// import RippledWsClientSign from 'rippled-ws-client-sign'
// // import RippleKeypairs from 'ripple-keypairs'
import store from './store.js'
// // const url = 'wss://s.devnet.rippletest.net:51233'
const url = 'wss://testnet.xrpl-labs.com'
// // const url = 'wss://xrpl.ws'
let server

const init = () => {
  // console.log(navigator)
  // console.log(navigator.getDeviceStorage())
  const address = getPublicAddress()
  if (address !== null && address !== undefined) {
    const account = address
    subscribe(account)
    setAccountInfo(account)
    setAccountTx(account)
    setAccountLines(account)
  }
}

const connect = () => {
  if (server !== undefined && server.getState().online) return server
  return new Promise((resolve, reject) => {
    new RippledWsClient(url, { NoUserAgent: true }).then(connection => {
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

// const setAccounts = () => {
//   const data = ['', '']
//   data.forEach(secret => {
//     const keys = RippleKeypairs.deriveKeypair(secret)
//     if (keys.privateKey) store.accounts.push()
//   })
//   store.accounts.push()
// }

const setAccountInfo = async (account) => {
  account = 'rDXJt3qZ62HtfTv728Vbuoq9BdAihYJZZd'
  const msg = await command({
    command: 'account_info',
    strict: true,
    ledger_index: 'current',
    account: account,
    queue: true
  })
  console.log(msg)
  if (msg.account_data) store.account = msg.account_data
  else store.account = msg
}

const setAccountLines = async (account) => {
  const msg = await command({
    command: 'account_lines',
    account: account,
    ledger_index: 'validated'
  })
  console.log(msg)
  Vue.set(store.account, 'lines', msg.lines)
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

const getAccountName = (account) => {
  if (store.account.Account === account) return 'My Wallet'
  else {
    const contact = store.contacts[account]
    if (contact) return contact.name
    else return null
  }
}

const getIssuerName = (account) => {
  for (const issuerName in store.curated_assets.details) {
    try {
      const currencies = store.curated_assets.details[issuerName].currencies
      for (const currency in currencies) {
        if (account === currencies[currency].issuer) return store.curated_assets.details[issuerName].name
      }
    } catch (e) {}
  }
  return 'Issuer'
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
  return new Promise((resolve, reject) => {
    resolve()
    // new RippledWsClientSign(transaction, seed, server).then(signedTX => {
    //   resolve(signedTX)
    // }).catch(error => {
    //   console.log(error)
    //   reject(error)
    // })
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
  window.navigator.vibrate(200)
  console.log('Received a TX')
  console.log(tx)
  const account = store.account.Account
  const delivered = tx.meta.delivered_amount

  tx = renameKey(tx, 'transaction', 'tx')
  store.tx.unshift(tx)
  if (tx.tx.Account === account) {
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
        text: `Received ${delivered / 1000000} XRP from a new transaction!`
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
  getAccountBalance,
  getAccountName,
  getIssuerName
}
