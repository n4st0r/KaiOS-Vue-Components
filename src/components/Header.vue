<template>
  <header class="header">
    <h1>{{ title }}</h1>
  </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 2.8rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #0029FF;
  padding: 3px 1rem;
}

h1 {
  font-size: 17px;
  font-weight: 400;
  color: #ffffff;
  width: 100%;
  text-align: center;
  /* text-transform: uppercase; */
}
</style>
