<template>
  <div class="app-layout">
    <Sidebar />
    <div class="right-part">
      <Navbar />
      <div class="content">
        <slot />
      </div>

    </div>
  </div>
</template>

<script>
import Navbar from '../components/header/TheHeader';
import Sidebar from '../components/TheSidebar';

export default {
  name: 'AppLayout',
  components: {
    Sidebar,
    Navbar
  }
}
</script>

<style lang="scss">
@import 'src/assets/scss/variables';
.app-layout {
  display: flex;
  width: 100%;
  height: 100vh;

  .right-part {
    display: flex;
    flex-direction: column;
    width: 100%;

    .content {
      width: 100%;
      height: 100%;
      background: $bg-primary-light-purplish-blue;
    }
  }
}
</style>