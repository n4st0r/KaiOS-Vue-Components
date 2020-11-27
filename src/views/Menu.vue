<template>
  <div id="menu" ref="menuList">
    <ListItem v-bind:style="{ height: height/4 + 'px' }" v-for="item in items" :key="item" :item="item" ref="items"/>
  </div>
</template>

<script>
import ListItem from '@/components/ListItem.vue'

export default {
  name: 'Menu',
  components: {
    ListItem
  },
  data () {
    return {
      height: 666,
      items: ['QrScanner', 'Generate', 'import1', 'view'],
      focusIndex: 0,
      activeElement: 'ListItem'
    }
  },
  computed: {

  },
  methods: {
    matchHeight () {
      this.height = this.$refs.menuList.clientHeight
    },
    onKeyDown (event) {
      switch (event.key) {
        case 'ArrowDown':
          this.focusIndex++
          break
        case 'ArrowUp':
          this.focusIndex--
          break
        // case 'ArrowRight':
        case 'Enter':
        case 'MicrophoneToggle':
          var target = event.target.defaultValue
          if (this.items.includes(target)) {
            this.$router.push(target)
            this.activeElement = target
          } else {
            console.log(target)
          }
          break
        default:
          console.log(event.code)
      }
      this.focusInput(this.items.length)
    },
    focusInput (length) {
      if (this.focusIndex >= length) {
        this.focusIndex = 0
        this.$refs.menuList.scrollTop = 0
      } else if (this.focusIndex < 0) {
        this.focusIndex = (length - 1)
      }
      // console.log(this.focusIndex)
      this.$refs.items[this.focusIndex].$el.focus()
    },
    down () {
      console.log('down ' + this.focusIndex)
      this.focusIndex = this.focusIndex + 1
    }
  },
  mounted () {
    this.$refs.items[0].$el.focus()
    this.matchHeight()
    document.addEventListener('keydown', this.onKeyDown)
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.onKeyDown)
  }
}
</script>

<style scoped>

  #menu {
    max-height: 100%;
    overflow: auto;
  }
</style>
