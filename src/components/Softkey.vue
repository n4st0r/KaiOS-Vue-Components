<template>
  <div class="softkey">
    <label class="left">{{ softkeys.left }}</label>
    <label class="center">{{ eve }}</label>
    <label class="right" v-on:SoftRight="back()">{{ softkeys.right }}</label>
  </div>
</template>

<script>
export default {
  name: 'Softkey',
  props: {
    softkeys: {
      left: String,
      center: String,
      Right: String
    }
  },
  data () {
    return {
      eve: 'Null'
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
      console.log('back')
    },
    enter (event) {
      switch (this.$route.name) {
        case 'Generate':
          // var target = event.target.defaultValue
          console.log(event)
          break
      }
    },
    onKeyDown (event) {
      switch (event.key) {
        case 'SoftLeft':
          this.$router.go(-1)
          break
        case 'Enter':
        case 'MicrophoneToggle':
          this.enter(event)
          break
        case 'SoftRight':
          this.$notify({
            group: 'foo',
            title: 'Important message',
            text: 'Hello user!'
          })
          break
        default:
          this.eve = event.key
      }
    },
    onVisibilityChange (event) {
      console.log(document.visibilityState)
    }
  },
  mounted () {
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('visibilitychange', this.onVisibilityChange)
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.onKeyDown)
    document.addEventListener('visibilitychange', this.onVisibilityChange)
  }
}
</script>

<style lang="scss" scoped>
  .softkey {
    height: 100%;
    width: 100%;
    max-width: 100%;
    background: white;
    border-top: 2px #cbcbcb solid;
    display: flex;
    flex-shrink: 0;
    white-space: nowrap;
    padding: 0 5px;
    font-weight: 700;
    box-sizing: border-box;
    line-height: 26px;
    margin-top: auto;
    // position: absolute;
    // bottom: 0;
  }

  .left,
  .right {
    font-weight: 600;
    font-size: 14px;
    color: #242424;
    overflow: hidden;
    width: 100%;
    letter-spacing: -0.5px;
    box-sizing: border-box;
    text-overflow: ellipsis;
  }

  .left {
    text-align: left;
    padding-right: 5px;
  }

  .center {
    color: #242424;
    /* text-transform: uppercase; */
    font-size: 18px;
    text-align: center;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 200%;
  }

  .right {
    text-align: right;
    padding-left: 5px;
  }
</style>
