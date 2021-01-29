// .worker.js
const addAccount = async (account) => {
  console.log('Test')
  // return new Promise((resolve, reject) => {
  //   console.log(navigator)
  //   navigator.getDataStores('accounts').then(stores => {
  //     console.log(account)
  //     console.log(stores)
  //     resolve()
  //   })
  //   reject()
  //   // navigator.getDataStores('accounts').then(stores => {
  //   //     stores[0].getLength().then(storeLength => {
  //   //         if(storeLength === 0) {}
  //   //     })
  //   // })
  // })
}

const setAccount = async (secret, address) => {
  return new Promise((resolve, reject) => {
    localStorage.public = address
    localStorage.secret = secret
    resolve()
  })
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

// const setContact = async () => {

// }

// const deleteContact = async () => {

// }

// const getContacts = async () => {

// }

export default {
  resetPinCount,
  setAccount,
  clearAllData,
  wrongPin,
  addAccount,
  getPinTries
}
