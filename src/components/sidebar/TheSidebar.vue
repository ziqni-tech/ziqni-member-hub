<template>
  <div id="sidebar">
    <div class="brand">
      <div class="logo-wrapper">
        <img
            class="logo"
            :src="require(`../../assets/icons/logo-dark.svg`)"
            alt="logo"
        />
      </div>
    </div>
    <SidebarNav :nav-items="sidebarNav" />
    <LogoutItem class="logout" @logOut="logOut" />
  </div>
</template>

<script setup>
import { CSidebar } from '@coreui/vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { computed } from 'vue';

import sidebarNav from './sidebarNav';
import SidebarNav from '@/components/sidebar/SidebarNav.vue';
import LogoutItem from '@/components/sidebar/LogoutItem';

const router = useRouter();
const store = useStore();
const emit = defineEmits(['logOut']);

const isDarkMode = computed(() => store.getters.getTheme);

const logoName = computed(() => {
  return store.getters.getTheme
      ? 'logo-dark'
      : 'logo-light';
});

const logOut = () => emit('logOut');


</script>

<style lang="scss">
@import '../../assets/scss/utils/vars';

#sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  .brand {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px 0 50px;

    .logo-wrapper {
      width: 100px;
      height: 20px;
    }
  }


  .logout {
    margin-top: auto;
    padding: 16px;
  }
}
</style>