<template>
    <!-- <div id="item" ref="menuItem" tabindex="0">
        <div id="text">
            <a v-bind:style="{'height': height + 'px'}">{{ name }}</a>
        </div>
    </div> -->
    <!-- <button id="item" ref="menuItem" tabindex="0">{{ name }}</button> -->
    <input id="item" ref="menuItem" type="button" :value="name">
</template>

<script>
export default {
  props: ['item'],
  data () {
    return {
      name: this.item,
      height: null
    }
  },
  methods: {
    matchHeight () {
      this.height = this.$refs.menuItem.clientHeight
    }
  },
  mounted () {
    this.matchHeight()
  }
}
</script>

<style scoped>
#item {
    height: 100%;
    width: 100%;
    text-align: left;
    font-size: 20px;
    outline: none;
    border: none;
}

#item:focus {
  background-color: blue;
  color: white;
  outline: none;
  border: none;
}
</style>
