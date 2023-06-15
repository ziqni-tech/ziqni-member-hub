<template>
  <div id="sidebar">
    <div class="brand">
      <div class="logo-wrapper">
        <img
            class="logo"
            src="https://a.storyblok.com/f/157554/x/d874de8b74/sign-easter.svg"
            alt="logo"
        />
        <img
            class="logo-name"
            src="https://a.storyblok.com/f/157554/x/ab3b3516a2/blazzio-logo-text.svg"
            alt=""
        >
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
      display: flex;
      align-items: center;

      .logo {
        height: 28px;
        width: 28px;
        margin-right: 15px;
      }

      .logo-name {
        height: 20px;
      }
    }
  }


  .logout {
    margin-top: auto;
    padding: 16px;
  }
}
</style>