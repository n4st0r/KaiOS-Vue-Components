<template>
    <div>
      <p v-if="!lines">You have no trustlines!</p>
      <ListView @enter="enter" :items="items" />
      <OptionMenu @select="select" v-if="options" :options="['Delete Trustline']"/>
    </div>
</template>

<script>
import store from '@/js/store'
import OptionMenu from '../components/OptionMenu.vue'
import ListView from '../components/ListView.vue'

export default {
  components: {
    OptionMenu,
    ListView
  },
  data () {
    return {
      options: false,
      focusIndex: Number
    }
  },
  computed: {
    lines () {
      return store.account.lines
    },
    items () {
      const array = []
      store.account.lines.forEach(line => {
        if (this.getIssuerInfo(line.account, line.currency)) {
          array.push({
            img: this.getIssuerInfo(line.account, line.currency).avatar,
            labels: [
              this.getIssuerInfo(line.account, line.currency).currencies[line.currency].name,
              this.getIssuerInfo(line.account, line.currency).name
            ],
            amount: {
              img: this.getIssuerInfo(line.account, line.currency).currencies[line.currency].avatar,
              value: line.balance
            }
          })
        } else {
          array.push({
            img: 'https://www.flaticon.com/premium-icon/icons/svg/3425/3425009.svg',
            labels: [
              line.currency,
              line.account
            ],
            amount: {
              value: line.balance
            }
          })
        }
      })
      return array
    }
  },
  methods: {
    enter (index) {
      this.focusIndex = index
      this.options = true
    },
    select (index) {
      this.options = false
      console.log(index)
      if (index === 0) {
        return this.$router.push({ name: 'TrustSet', params: { remove: true, trustline: store.account.lines[this.focusIndex] } })
      }
      return null
    },
    getIssuerInfo (account, currency) {
      for (const issuer in store.curated_assets.details) {
        try {
          if (account === store.curated_assets.details[issuer].currencies[currency].issuer) return store.curated_assets.details[issuer]
        } catch (e) {}
      }
      return null
    }
  },
  mounted () {
    store.keys.left = {
      string: 'Back',
      fn: () => {
        return this.$router.go(-1)
      }
    }
    store.keys.right = {
      string: 'Set Trustline',
      fn: () => {
        return this.$router.push({ name: 'TrustSet' })
      }
    }
  }
}
</script>

<style scoped>
.trustline {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: white;
  padding: 1rem;
}
.trustline img {
  width: 25px;
  height: 25px;
  object-fit: contain;
  margin: auto 0;
  padding: 0 10px;
}
.issuer {
  display: flex;
  flex-direction: column;
}
.balance {
  margin-left: auto;
  font-weight: 600;
  display: flex;
  align-items: center;
}
.balance img {
  width: 1.2rem;
}
</style>
