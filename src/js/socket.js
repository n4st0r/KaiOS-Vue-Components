import Vue from 'vue'
// import RippledWsClient from 'rippled-ws-client'
import store from './store.js'

const url = 'wss://testnet.xrpl-labs.com'
// const url = 'wss://xrpl.ws'
let server

const connect = () => {
  if (server !== undefined && server.readyState === 1) return server
  return new Promise((resolve, reject) => {
    server = new WebSocket(url)

    server.onopen = () => {
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
      Vue.notify({
        group: 'foo',
        title: 'Message',
        type: 'warn',
        text: 'Message from the server'
      })
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

var xrpAccount

var subscriptions = []
const subscribe = (address) => {
  if (subscriptions.includes(address)) return null
  subscriptions.push(address)
  command({
    command: 'subscribe',
    accounts: [address]
  })
}

const getAccountInfo = (address) => {
  command({
    command: 'account_info',
    account: address
  })
  console.log('getAccountInfo')
  return xrpAccount
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
  return null
}

function setAccount (account) {
  store.account = account
  xrpAccount = account
}

function addTx (tx) {
  store.tx.unshift(tx)
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
    var tx = obj.transaction
    if (typeof tx !== 'undefined') {
      addTx(tx)
      // TODO
      if (this.addresses.includes(tx.Account)) {
        // getAccountInfo(tx.Account)
        console.log('send tx')
        // TODO
      } if (this.addresses.includes(tx.Destination)) {
        // getAccountInfo(tx.Destination)
        console.log('received tx')
      }
    }
  }
}

export default {
  connect,
  close,
  state,
  subscribe,
  getAccountInfo,
  getAccountTx
}

// export default new RippledWsClient(url).then(connection => {
//   connection.on('state', state => {
//     console.log(state)
//   })
//   console.log(connection.getState())
// })

// const createConnection = () => {
//   // socket = new WebSocket(url)
//   new RippledWsClient(url).then(connection => {
//     socket = connection
//     console.log(connection.getState())
//   })
// }

// createConnection()

//   socket.onopen = function () {
//     console.log('ws opened!')
//   }

//   socket.onclose = function (msg) {
//     console.log('ws closed')
//     // setTimeout(() => { connect() }, 1000)
//   }

//   socket.onerror = function (err) {
//     console.error('Socket encountered error: ', err.message, 'Closing socket')
//     socket.close()
//   }

// function sleep () {
//   ws.close()
// }

// module.exports = {
//   ws,

// }
