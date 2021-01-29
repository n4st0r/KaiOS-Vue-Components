<template>
    <div id="list" ref="list">
        <div class="list-item" :class="{ focus: index === focusIndex}" :tabindex="index" v-for="(item, index) in items" :key="index" ref="items">
            <img :src="item.img">
            <div class="labels">
                <label v-for="(label, index) in item.labels.slice(0, 3)" :key="index">
                    {{ label }}
                </label>
            </div>
            <div class="amount">
                <img v-if="item.amount" :src="item.amount.img">
                <label v-if="item.amount">{{ item.amount.value }}</label>
            </div>
        </div>
    </div>
</template>

<script>
// items: [
//     {
//         img: 'https://www.flaticon.com/premium-icon/icons/svg/2936/2936758.svg',
//         labels: ['rule 1', 'rule 2', 'rule 3'],
//         amount: {
//             img: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Double-barred_dollar_sign.svg',
//             amount: '1'
//         }
//     }]

export default {
  props: {
    items: Array
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
          this.$refs.list.scrollBy({
            top: this.$refs.items[0].offsetHeight,
            left: 0
          })
          break
        case 'ArrowUp':
          this.focusIndex--
          this.$refs.list.scrollBy({
            top: -this.$refs.items[0].offsetHeight,
            left: 0
          })
          break
        case 'Enter':
          this.$emit('enter', this.focusIndex)
          break
        default:
          // console.log(event.code)
      }
      this.focusInput(this.items.length)
    },
    focusInput (length) {
      if (this.focusIndex >= length) {
        this.focusIndex = 0
        this.$refs.list.scrollTop = 0
      } else if (this.focusIndex < 0) {
        this.focusIndex = (length - 1)
        this.$refs.list.scrollTop = this.$refs.list.scrollHeight
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
#list {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}
.list-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: white;
  padding: 1rem;
}
.list-item.focus {
  background-color: blue;
  outline: none;
  border: none;
  color: white;
}
.list-item img {
  width: 25px;
  height: 25px;
}
.labels {
  display: flex;
  flex-direction: column;
}
.amount {
  margin-left: auto;
  font-weight: 600;
  display: flex;
  align-items: center;
}
.amount img {
  height: 100%;
  width: 1.2rem;
}
</style>
