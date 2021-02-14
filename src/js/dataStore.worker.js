// .worker.js
import Vue from 'vue'
import localforage from 'localforage'
// import store from '@/js/store.js'
import socket from '@/js/socket.js'
import store from './store'

const getAccount = async (account) => {
  try {
    let obj = await localforage.getItem(account)
    obj = JSON.parse(obj)
    return obj
  } catch (e) {
    console.log(e)
  }
}

const getAccounts = async () => {
  const array = []
  await localforage.iterate((obj, key, number) => {
    obj = JSON.parse(obj)
    if (obj.type === 'account') array.push(key)
  })
  console.log(array)
  return array
  // return new Promise((resolve, reject) => {
  //   navigator.getDataStores('accounts').then(stores => {
  //     console.log(stores)
  //     stores[0].getLength().then(length => {
  //       console.log(length)
  //     })
  //     resolve()
  //   }).catch(e => reject(e))
  // })
}

const addAccount = async (secret, key) => {
  // account = secret | key = r address
  const obj = {
    type: 'account',
    public: key,
    secret: secret,
    name: 'My Account'
  }
  try {
    await localforage.setItem(key, JSON.stringify(obj))
    await setAccountActive(key, secret)
    return true
  } catch (e) {
    return e
  }
  // return new Promise((resolve, reject) => {
  //   navigator.getDataStores('accounts').then(stores => {
  //     stores[0].add(account, id).then(id => {
  //       resolve(id)
  //     })
  //   }).catch(e => {
  //     reject(e)
  //   })
  // })
}

const setAccountActive = async (account, secret) => {
  if (secret) {
    return new Promise((resolve, reject) => {
      localStorage.public = account
      localStorage.secret = secret
      socket.init(account)
      resolve()
    })
  } else {
    return new Promise((resolve, reject) => {
      localStorage.public = account
      socket.init(account)
      resolve()
    })
  }
}

const getAccountSecret = async () => {
  const obj = await getAccount(localStorage.public)
  return obj.secret
}

const decrypt = (input, secret) => {
  console.log(`Input: ${input}, secret: ${secret}`)
  const key = Vue.CryptoJS.PBKDF2(secret, Vue.CryptoJS.enc.Hex.parse(input.substr(0, 32)) /* Salt */, { keySize: 256 / 32, iterations: 100 })
  const output = Vue.CryptoJS.AES.decrypt(input.substring(64) /* encrypted */, key, { iv: Vue.CryptoJS.enc.Hex.parse(input.substr(32, 32)) /* iv */, padding: Vue.CryptoJS.pad.Pkcs7, mode: Vue.CryptoJS.mode.CBC }).toString(Vue.CryptoJS.enc.Utf8)
  if (!output) throw new Error('The secret did not unlock the string')
  return output
}

const encrypt = (input, secret) => {
  console.log(`Input: ${input}, secret: ${secret}`)
  const salt = Vue.CryptoJS.lib.WordArray.random(128 / 8)
  const iv = Vue.CryptoJS.lib.WordArray.random(128 / 8)
  const encrypted = Vue.CryptoJS.AES.encrypt(input, Vue.CryptoJS.PBKDF2(secret, salt, { keySize: 256 / 32, iterations: 100 }) /* key */, { iv: iv, padding: Vue.CryptoJS.pad.Pkcs7, mode: Vue.CryptoJS.mode.CBC })
  const output = salt.toString() + iv.toString() + encrypted.toString()
  return output
}

const clearAllData = async () => {
  localStorage.removeItem('public')
  localStorage.removeItem('secret')
}

const getPinTries = async () => {
  return localStorage.tries
}

const wrongPin = async () => {
  if (await getPinTries()) return localStorage.tries++
  else localStorage.tries = 1
}

const resetPinCount = async () => {
  return localStorage.removeItem('tries')
}

const deleteAccount = async (account) => {
  try {
    await localforage.removeItem(account)
    if (localStorage.public === account) location.reload()
    else 

    Vue.notify({ group: 'foo', type: 'success', title: 'Success', text: 'Deleting an account' })
  } catch (e) {
    Vue.notify({ group: 'foo', type: 'error', title: 'Getting an error', text: 'when deleting' })
  }
}

// const setContact = async () => {

// }

// const deleteContact = async () => {

// }

// const getContacts = async () => {

// }

export default {
  getAccount,
  getAccounts,
  setAccountActive,
  resetPinCount,
  clearAllData,
  wrongPin,
  addAccount,
  getPinTries,
  decrypt,
  encrypt,
  deleteAccount,
  getAccountSecret
}
