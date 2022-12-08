<template>
  <router-view />
</template>

<script>
import AppLayout from './layouts/AppLayout';

export default {
  name: 'App',
  components: {
    AppLayout,
  }
}
</script>

<style lang="scss">
@import '@coreui/coreui/dist/css/coreui.min.css';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
