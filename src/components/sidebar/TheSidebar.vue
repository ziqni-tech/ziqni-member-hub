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
    <BlazzioNavigation :nav-items="blazzioNav" />
    <SidebarNav :nav-items="sidebarNav" />
    <LogoutItem class="logout" @logOut="logOut" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { computed } from 'vue';

import sidebarNav from './sidebarNav';
import blazzioNav from './blazzioNav';
import SidebarNav from '@/components/sidebar/SidebarNav.vue';
import BlazzioNavigation from '@/components/sidebar/BlazzioNavigation';
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
        height: 20px;
        width: 100px;
        margin-right: 15px;
      }

      .logo-name {
        height: 20px;
      }
    }
  }


  .logout {
    margin-top: auto;
    padding: 16px 16px 25px;
  }
}

@media screen and (max-width: 1024px) {
  #sidebar {

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
          height: 24px;
          width: 24px;
          margin-right: 10px;
        }

        .logo-name {
          height: 18px;
        }
      }
    }


    .logout {
      margin-top: auto;
      padding: 16px;
    }
  }
}

@media screen and (max-width: 890px) {
  #sidebar {

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
          height: 20px;
          width: 20px;
          margin-right: 8px;
        }

        .logo-name {
          height: 15px;
        }
      }
    }


    .logout {
      margin-top: auto;
      padding: 16px;
    }
  }
}
</style>