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
@import '../../assets/scss/variables';

.sidebar {
  height: 100%;
  min-width: 280px;

  .brand {
    padding: 39px 0 22px 57px;
    background: $bg-primary-white;

    .logo-wrapper {
      width: 124px;
      height: 31px;
      object-fit: cover;
      overflow: hidden;
      .logo {
        width: 100%;
        height: 100%;
      }
    }
  }

  .sidebar-nav {
    background: $bg-primary-white;
    padding-top: 60px;
  }
}
</style>