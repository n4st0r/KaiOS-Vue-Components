<template>
    <div>
        <label>Contacts</label>
        <div v-if="contacts" id="contacts-list" ref="contactList">
            <div v-for="(contact, index) in contacts" :key="index" id="contact-items">
                <div :class="{ focus: index === focusIndex}" :tabindex="index" @click="info(contact)" class="contact-item"  ref="items">
                <img src="https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg">
                <div class="contact-text">
                    <label class="contact-account">{{ contact.name }}</label>
                </div>
                <div class="contact-amount">
                        <label class="withdrawl">{{ contact.accounts[0].account }}</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import socket from '@/js/socket.js'
import store from '@/js/store.js'

export default {
  name: 'contacts',
  data () {
    return {
      focusIndex: 0
    }
  },
  computed: {
    contacts () {
      return store.contacts.sort((a, b) => a.name.localeCompare(b.name))
    }
  },
  methods: {
    info (contact) {
      this.$router.push({ name: 'Contact', params: { contact: contact } })
    },
    add () {
      this.$router.push({ name: 'Contact', params: { add: true } })
    },
    setContact () {
      return null
    },
    getContacts () {
    },
    onKeyDown (event) {
      switch (event.key) {
        case 'ArrowDown':
          this.focusIndex++
          this.$refs.contactList.scrollBy({
            top: this.$refs.items[0].offsetHeight,
            left: 0
          })
          break
        case 'ArrowUp':
          this.focusIndex--
          this.$refs.contactList.scrollBy({
            top: -this.$refs.items[0].offsetHeight,
            left: 0
          })
          break
        case 'Enter':
          this.info(this.contacts[this.focusIndex])
          break
        case 'SoftRight':
        case 'ArrowRight':
          this.add()
          break
      }
      this.focusInput(this.contacts.length)
    },
    focusInput (length) {
      if (this.focusIndex >= length) {
        this.focusIndex = 0
        this.$refs.contactList.scrollTop = 0
      } else if (this.focusIndex < 0) {
        this.focusIndex = (length - 1)
        this.$refs.contactList.scrollTop = this.$refs.contactList.scrollHeight
      }
    }
  },
  mounted () {
    document.addEventListener('keydown', this.onKeyDown)
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.onKeyDown)
  }
}
</script>

<style scoped>
#contacts-list {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
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
