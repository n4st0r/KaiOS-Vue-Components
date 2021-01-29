<template>
    <div>
        <ListView :items="items" />
    </div>
</template>

<script>
import store from '@/js/store'
import ListView from '@/components/ListView.vue'

export default {
  components: { ListView },
  computed: {
    items () {
      return store.accountList
    }
  }
}
</script>

<style scoped>
</style>
