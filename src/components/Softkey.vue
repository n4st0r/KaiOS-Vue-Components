<template>
  <div class="softkey">
    <h5 class="left">{{ key.left.string }}</h5>
    <h5 class="center">{{ key.center.string }}</h5>
    <h5 class="right">{{ key.right.string }}</h5>
    <!-- v-on:SoftRight="back()" -->
  </div>
</template>

<script>
import store from '@/js/store'

export default {
  name: 'Softkey',
  computed: {
    key () {
      return store.keys
    }
  },
  methods: {
    onKeyDown (event) {
      switch (event.key) {
        case 'ArrowLeft':
        // case 'SoftLeft':
          this.key.left.fn()
          break
        case 'Enter':
          this.key.center.fn()
          break
        // case 'ArrowRight':
        case 'SoftRight':
          this.key.right.fn()
          break
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

<style lang="scss" scoped>
h5 {
  color: black;
  font-size: 14px;
  font-weight: 400;
  margin: auto 0 auto 0;
}
.softkey {
  height: 100%;
  width: 100%;
  max-width: 100%;
  background: white;
  border-top: 2px #cbcbcb solid;
  display: flex;
  flex-shrink: 0;
  white-space: nowrap;
}
.left,
.right {
  // overflow: hidden;
  width: 7.2rem;
  // box-sizing: border-box;
  text-overflow: ellipsis;
}
.left {
  text-align: left;
  margin-left: 0.5rem !important;
}
.center {
  text-align: center;
  text-transform: uppercase;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 7.6rem;
  margin: auto 0.5rem;
  font-weight: 600;
}
.right {
  text-align: right;
  margin-right: 0.5rem !important;
}
</style>
