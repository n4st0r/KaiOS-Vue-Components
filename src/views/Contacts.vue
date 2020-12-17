<template>
    <div>
        <label>Contacts</label>
        <div v-if="contacts" id="contacts-list" ref="contactList">
            <div v-for="(contact, index) in contacts" :key="index" id="contact-items">
                <div :class="{ focus: index === focusIndex}" :tabindex="index" @click="info(tx)" class="transaction-item"  ref="items">
                <img src="https://www.flaticon.com/premium-icon/icons/svg/2936/2936758.svg">
                <div id="transaction-text">
                    <label class="transaction-account" v-if="tx.tx.Account === account.Account">{{ tx.tx.Destination }}</label>
                </div>
                <div class="transaction-amount">
                        <label class="withdrawl" v-if="tx.tx.Account === account.Account">- {{ dropstoXRP(tx.tx.Amount) }}</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import socket from '@/js/socket.js'

export default {
  name: 'contacts',
  data () {
    return {
      focusIndex: 0
    }
  },
}
</script>

<style scoped>
#contacts-list {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}
</style>