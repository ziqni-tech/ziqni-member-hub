<template>
  <CSidebar visible>
    <div class="brand">
      <div class="logo-wrapper">
        <img class="logo" src="../../assets/icons/Logo.svg" alt="logo">
      </div>
    </div>
    <CSidebarNav>
      <SidebarItems :nav-items="$options.sidebarNav" />
    </CSidebarNav>
  </CSidebar>
</template>

<script>
import { CSidebar, CSidebarNav } from '@coreui/vue';
import SidebarItems from './SidebarItems';
import sidebarNav from './sidebarNav';

export default {
  name: 'Sidebar',
  sidebarNav,
  components: {
    SidebarItems,
    CSidebar,
    CSidebarNav
  }
};
</script>

<style lang="scss">

</style>