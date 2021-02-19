<template>
    <div class="container">
        <label>Contacts</label>
        <div v-if="contacts" id="contacts-list" ref="contactList">
            <ListView @enter="info" :items="items"/>
        </div>
    </div>
</template>

<script>
import store from '@/js/store.js'
import dataStore from '@/js/dataStore.worker.js'
import ListView from '../components/ListView.vue'

export default {
  components: { ListView },
  name: 'contacts',
  data () {
    return {
      focusIndex: 0
    }
  },
  computed: {
    contacts () {
      return store.contacts
    },
    items () {
      const array = []
      for (const account in store.contacts) {
        const contact = store.contacts[account]
        array.push({
          img: 'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg',
          labels: [
            contact.name,
            account
          ]
        })
      }
      return array
    }
  },
  methods: {
    info (index) {
      this.$router.push({ name: 'Contact', params: { contact: this.contacts[Object.keys(this.contacts)[index]] } })
    },
    add () {
      this.$router.push({ name: 'Contact', params: { add: true } })
    },
    setContact () {
      return null
    }
  },
  mounted () {
    store.keys.left = {
      string: 'Back',
      fn: () => this.$router.push('/')
    }
    store.keys.center.fn = () => { return null }
    store.keys.right = {
      string: 'Add',
      fn: () => this.$router.push({ name: 'Contact', params: { add: true } })
    }
    dataStore.getContacts()
  }
}
</script>

<style scoped>
#contacts-list {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  width: 100%;
}
img {
    height: 25px;
    width: 25px;
}
.contact-item {
  display: flex;
  cursor: pointer;
  width: 100%;
  font-size: 14px;
  align-items: center;
}
.contact-item.focus {
  background-color: blue;
  outline: none;
  border: none;
  color: white;
}
.contact-item img {
  width: 25px;
  height: 25px;
}
.contact-text {
  display: flex;
  flex-direction: column;
  width: 50%;
}
.contact-account {
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
}
.contact-amount {
  font-size: 14px;
  margin-left: auto;
  max-width: 300px;
  padding: 0 5px;
}
</style>
