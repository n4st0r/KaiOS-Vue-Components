<template>
    <div id="options-menu">
      <div class="wrapper"></div>
        <div class="header">
            <label>options</label>
        </div>
        <div id="options-container" ref="optionList">
            <div v-for="(option, index) in options" :key="index" :class="{ focus: index === focusIndex}" ref="items">
                {{ option }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    options: Array
  },
  data () {
    return {
      focusIndex: 0
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
    top: 0;
    left: 0;
    right: 0;
    bottom: 3rem;
}
.wrapper {
  background-color: rgba(0, 0, 0, 0.7);
  height: 70%;
}
.header {
   background-color: grey;
}
#options-container {
  background-color: white;
  height: calc(100% - 3rem);
}
.focus {
    background-color: blue;
    color: white;
}
</style>
