/* eslint-disable */

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
  accountList: [],
  account: {},
  tx: [],
  contacts: {
    // rXXXXXXXXXXX: {
    //   account: 'rXXXXXXXXXXX',
    //   name: 'Ted',
    //   tag: ''
    // },
    // rh5juM8LsHPw5doRJopaihzqn2pJnRVBNr: {
    //   account: 'rh5juM8LsHPw5doRJopaihzqn2pJnRVBNr',
    //   name: 'Antonio',
    //   tag: 123456
    // }
  },
  curated_assets: {
    'issuers': [
      'Bitstamp',
      'GateHub'
    ],
    'currencies': [
      'USD',
      'EUR',
      'BTC',
      'ETH'
    ],
    'details': {
      'Bitstamp': {
        'id': 185,
        'name': 'Bitstamp',
        'domain': 'bitstamp.net',
        'avatar': 'https://nd4d3do.dlvr.cloud/ex-bitstamp.png',
        'currencies': {
          'USD': {
            'id': 178,
            'issuer_id': 185,
            'issuer': 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
            'currency': 'USD',
            'name': 'US Dollar',
            'avatar': 'https://nd4d3do.dlvr.cloud/fiat-dollar.png'
          }
        }
      },
      'GateHub': {
        'id': 182,
        'name': 'GateHub',
        'domain': 'gatehub.net',
        'avatar': 'https://nd4d3do.dlvr.cloud/ex-gatehub.png',
        'currencies': {
          'EUR': {
            'id': 169,
            'issuer_id': 182,
            'issuer': 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
            'currency': 'EUR',
            'name': 'Euro',
            'avatar': 'https://nd4d3do.dlvr.cloud/fiat-euro.png'
          },
          'USD': {
            'id': 170,
            'issuer_id': 182,
            'issuer': 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
            'currency': 'USD',
            'name': 'US Dollar',
            'avatar': 'https://nd4d3do.dlvr.cloud/fiat-dollar.png'
          },
          'BTC': {
            'id': 172,
            'issuer_id': 182,
            'issuer': 'rchGBxcD1A1C2tdxF6papQYZ8kjRKMYcL',
            'currency': 'BTC',
            'name': 'Bitcoin',
            'avatar': 'https://nd4d3do.dlvr.cloud/crypto-btc.png'
          },
          'ETH': {
            'id': 174,
            'issuer_id': 182,
            'issuer': 'rcA8X3TVMST1n3CJeAdGk1RdRCHii7N2h',
            'currency': 'ETH',
            'name': 'Ethereum',
            'avatar': 'https://nd4d3do.dlvr.cloud/crypto-eth.png'
          }
        }
      }
    }
  } 
})

export default store
