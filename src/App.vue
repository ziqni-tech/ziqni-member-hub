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
@import './assets/scss/_variables.scss';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $sidebar-text-color;
  width: 100%;
  height: 100vh;
}
</style>
