<template>
  <div id="sidebar">
    <div class="brand">
      <div class="logo-wrapper">
        <img
            v-if="logoName"
            class="logo"
            :class="{'small-logo': isSidebarNarrow}"
            :src="logoName"
            alt="logo"
        />
      </div>
    </div>
    <SidebarNav
        v-if="configFile && sidebarNav.length"
        :nav-items="sidebarNav"
        :isDarkMode="isDarkMode"
        :isSidebarNarrow="isSidebarNarrow"
    />
    <LogoutItem
        class="logout"
        :class="{'sidebar-narrow': isSidebarNarrow}"
        :isDarkMode="isDarkMode"
        :isSidebarNarrow="isSidebarNarrow"
        @logOut="logOut"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { computed, onMounted, ref, watch } from 'vue';

import getSidebarNav from '@/components/sidebar/sidebarNav';

import SidebarNav from '@/components/sidebar/SidebarNav.vue';
import LogoutItem from '@/components/sidebar/LogoutItem';

const router = useRouter();
const store = useStore();
const emit = defineEmits(['logOut']);
const isDarkMode = computed(() => store.getters.getTheme);
const isSidebarNarrow = computed(() => store.getters.getIsSidebarNarrow)

import Dashboard from './svg-icons/Dashboard';
import Tournaments from './svg-icons/Tournaments';
import Missions from './svg-icons/Missions';
import Messages from './svg-icons/Messages';
import Achievements from './svg-icons/Achievements';
import Awards from './svg-icons/Awards';

import jsonData from '@/config/siteConfig.json';

const icons = {
  dashboard: Dashboard,
  tournaments: Tournaments,
  achievements: Achievements,
  awards: Awards,
  messages: Messages,
  missions: Missions
}

const favicon = document.querySelector('link[rel="icon"]')
// const configFile = computed(() => store.getters.getConfigFile);
const configFile = ref(jsonData);

const sidebarNav = ref([])

const logoName = ref('')

watch(configFile, (val) => {
  favicon.href = store.getters.getConfigFile.favicon
  sidebarNav.value = getSidebarNav(val)
  if (isSidebarNarrow.value) {
    logoName.value = isDarkMode.value ? val.logos.dark.small : val.logos.light.small;
  } else {
    logoName.value = isDarkMode.value ? val.logos.dark.icon : val.logos.light.icon;
  }
})

watch(isDarkMode, (val) => {
  if (isSidebarNarrow.value) {
    logoName.value = val ? configFile.value.logos.dark.small : configFile.value.logos.light.small;
  } else {
    logoName.value = val ? configFile.value.logos.dark.icon : configFile.value.logos.light.icon;
  }
})

watch(isSidebarNarrow, (value) => {
  if (value) {
    logoName.value = isDarkMode.value ? configFile.value.logos.dark.small : configFile.value.logos.light.small;
  } else {
    logoName.value = isDarkMode.value ? configFile.value.logos.dark.icon : configFile.value.logos.light.icon;
  }
})


onMounted(() => {
  if (!sidebarNav.value.length && configFile.value) {
    sidebarNav.value = getSidebarNav(configFile.value);
  }
  if (!logoName.value.length && configFile.value) {
    if (isSidebarNarrow.value) {
      logoName.value = isDarkMode.value ? configFile.value.logos.dark.small : configFile.value.logos.light.small;
    } else {
      logoName.value = isDarkMode.value ? configFile.value.logos.dark.icon : configFile.value.logos.light.icon;
    }
  }
})

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

      .logo.small-logo {
        height: 50px;
        width: 100px;
        margin: auto;
      }

      .logo-name {
        height: 20px;
      }
    }
  }


  .logout {
    margin-top: auto;
    padding: 16px 16px 25px 25px;

    &.sidebar-narrow {
      padding: 16px 0 25px;

    }
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
          width: 100px;
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
          width: 90px;
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