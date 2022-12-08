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
    <button @click="logOut" class="log-out-btn">Log Out</button>
  </CSidebar>
</template>

<script setup>
import { CSidebar, CSidebarNav } from '@coreui/vue';
import SidebarItems from './SidebarItems';
import sidebarNav from './sidebarNav';
import { useRouter } from 'vue-router';
const router = useRouter();
const emit = defineEmits(['logOut'])

const logOut = () => emit('logOut')

</script>

<style lang="scss">
@import '../../assets/scss/utils/vars';
.log-out-btn {
  padding: 20px 50px;
  text-align: start;
  background-color: white;
  outline: none;
  border: none;
  color: $txt-secondary;

  &:hover {
    color: $txt-primary ;
  }
}
</style>