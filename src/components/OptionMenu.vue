<template>
    <div id="options-menu" :style="listHeight">
      <div class="wrapper"></div>
      <div class="header">
          <label>options</label>
      </div>
      <div id="options-container" ref="optionList">
          <div v-for="(option, index) in options" :key="index" class="item" :class="{ focus: index === focusIndex}" ref="items">
              {{ option }}
          </div>
      </div>
    </div>
</template>

<script>
import store from '@/js/store'

export default {
  props: {
    options: Array
  },
  data () {
    return {
      focusIndex: 0
    }
  },
  computed: {
    listHeight () {
      const height = this.options.length > 3 ? 3 * 4.8 : this.options.length * 4.8
      return { bottom: `${height + 3}rem` }
    }
  },
  methods: {
    onKeyDown (event) {
      switch (event.key) {
        case 'ArrowDown':
          this.focusIndex++
          this.$refs.optionList.scrollBy({
            top: this.$refs.items[0].offsetHeight,
            left: 0
          })
          break
        case 'ArrowUp':
          this.focusIndex--
          this.$refs.optionList.scrollBy({
            top: -this.$refs.items[0].offsetHeight,
            left: 0
          })
          break
        case 'Enter':
          this.$emit('select', this.focusIndex)
          break
      }
      this.focusInput(this.options.length)
    },
    focusInput (length) {
      if (this.focusIndex >= length) {
        this.focusIndex = 0
        this.$refs.optionList.scrollTop = 0
      } else if (this.focusIndex < 0) {
        this.focusIndex = (length - 1)
        this.$refs.optionList.scrollTop = this.$refs.optionList.scrollHeight
      }
    }
  },
  mounted () {
    document.addEventListener('keydown', this.onKeyDown)
    store.keys.left = {
      string: 'Back',
      fn: () => this.$router.go(-1)
    }
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.onKeyDown)
  }
}
</script>

<style scoped>
#options-menu {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 2;
    right: 0;
}
.wrapper {
  background-color: rgba(0, 0, 0, 0.7);
  height: 100%;
}
.header {
   background-color: grey;
}
#options-container {
  background-color: white;
  max-height: calc(14.4rem);
  overflow-y: auto;
}
.item {
  height: 4.8rem;
  font-size: 17px;
  padding: 0 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.focus {
    background-color: blue;
    color: white;
}
</style>
