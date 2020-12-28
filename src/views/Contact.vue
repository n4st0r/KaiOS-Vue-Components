<template>
    <div v-if="contactobj" class=container>
        <fieldset>
            <label>Name:</label>
            <input v-model="contactobj.name" placeholder="Contact Name" ref="input0">
        </fieldset>
        <hr>
        <fieldset>
            <label>Address:</label>
            <input v-model="contactobj.accounts[0].account" placeholder="R Address" ref="input1">
            <input v-model="contactobj.accounts[0].tag" class="number" type="number" placeholder="Destination Tag" ref="input2">
        </fieldset>
        <hr>
        <div id="buttons">
            <input type="button" value="Delete" ref="input3">
            <input type="button" value="Save" ref="input4">
            <input type="button" value="Send" ref="input5">
        </div>
    </div>
</template>

<script>
export default {
  props: ['contact', 'add'],
  data () {
    return {
      focusIndex: 0,
      contactobj: {
        name: null,
        accounts: [
          { account: null, tag: null }
        ]
      }
    }
  },
  methods: {
    deleteContact () {
      this.$notify({ group: 'foo', title: 'TODO Delete contact in DataStore', type: 'warn' })
    },
    setContact () {
      this.$notify({ group: 'foo', title: 'TODO save contact in DataStore', type: 'warn' })
      console.log(this.contactobj)
    },
    onKeyDown (event) {
      switch (event.key) {
        case 'ArrowDown':
          this.focusIndex++
          break
        case 'ArrowUp':
          this.focusIndex--
          break
        case 'Enter': {
          switch (this.focusIndex) {
            case 3:
              this.deleteContact()
              break
            case 4:
              this.setContact()
              break
            case 5:
              this.$router.push({ name: 'Send', params: { account: this.contactobj.accounts[0].account, tag: this.contactobj.accounts[0].tag } })
          }
          break
        }
        default:
          console.log(event.code)
      }
      this.focusInput(Object.keys(this.$refs).length)
    },
    focusInput (length) {
      if (this.focusIndex >= length) {
        this.focusIndex = length - 1
      } else if (this.focusIndex < 0) {
        this.focusIndex = 0
      }
      const input = 'input' + this.focusIndex
      this.$refs[input].focus()
    }
  },
  created () {
    if (!this.contact && !this.add) this.$router.push({ name: 'Contacts' })
    else if (this.contact) this.contactobj = this.contact
  },
  mounted () {
    document.addEventListener('keydown', this.onKeyDown)
    document.getElementsByClassName('number').forEach(element => {
      element.addEventListener('keydown', e => {
        if (e.which === 38 || e.which === 40) e.preventDefault()
      })
    })
    if (this.$refs.input0) this.$refs.input0.focus()
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.onKeyDown)
  }
}
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
}
fieldset {
    display: flex;
    flex-direction: column;
    border: none;
}
fieldset label {
    margin: 6px;
}
fieldset input {
    margin: 6px;
    color: blue;
}
hr {
  color: rgba(77, 79, 102);
  width: 95%;
}
#buttons {
    display: flex;
    flex-direction: row;
    align-self: center;
}
#buttons input {
    margin: 10px;
}
#buttons input:focus {
    color: white;
    background-color: blue;
}
</style>
