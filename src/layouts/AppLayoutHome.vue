<template>
  <div>
    <Navbar />
    <slot />
  </div>
</template>

<script>
import Navbar from '../components/header/Header';

export default {
  name: 'AppLayoutHome',
  components: {
    Navbar
  }
}
</script>

<style lang="scss">

</style>