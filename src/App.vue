<template>
  <router-view />
</template>

<script setup>

</script>

<style lang="scss">
@import '@coreui/coreui/dist/css/coreui.min.css';
@import './assets/scss/_variables.scss';

#app {
  font-family: $mainFont;
  -webkit-font-smoothing: $mainFont;
  -moz-osx-font-smoothing: $mainFont;
  text-align: center;
  color: $sidebar-text-color;
  width: 100%;
  height: 100%;
  background: $dark-grey;
}
</style>
