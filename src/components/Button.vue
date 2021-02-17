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
    width: calc(100% - 2rem);
    height: 3.6rem;
    margin: 1rem;
    background-color: blue;
    color: white;
    border: none;
}
</style>
