<template>
  <router-view />
</template>

<script setup>
import config from '@/config/siteConfig.json'

document.title = config.title

const favicon = document.querySelector('link[rel="icon"]')
favicon.href = config.favicon
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
  height: 100vh;
  background: $dark-grey;
}
</style>
