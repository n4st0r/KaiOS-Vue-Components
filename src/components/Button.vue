<template>
    <button>{{ text }}</button>
</template>

<script>
export default {
  props: {
    text: String
  }
}
</script>

<style scoped>
button {
    height: 3.6rem;
    margin: 1rem;
    background-color: blue;
    color: white;
    border: none;
}
</style>
