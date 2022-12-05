<template>
  <CSidebar visible>
    <div class="brand">
      <div class="logo-wrapper">
        <img class="logo" src="../../assets/icons/Logo.svg" alt="logo">
      </div>
    </div>
    <CSidebarNav>
      <SidebarItems :nav-items="sidebarNav" />
    </CSidebarNav>
  </CSidebar>
</template>

<script setup>
import { CSidebar, CSidebarNav } from '@coreui/vue';
import SidebarItems from './SidebarItems';
import sidebarNav from './sidebarNav';

</script>

<style lang="scss">

</style>