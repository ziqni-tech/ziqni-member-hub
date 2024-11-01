<template>
  <div
    id="app-layout"
    v-if="!isMobile"
    :class="{'light-mode': !isDarkMode, 'sidebar-narrow': isSidebarNarrow}"
  >
    <div id="nav-block" :class="{'sidebar-narrow': isSidebarNarrow}">
      <TheSidebar @logOut="logOut"/>
    </div>
    <div class="sidebar-narrow-btn" :class="{'sidebar-narrow': isSidebarNarrow}" @click="toggleSidebar">
      <div class="arrow-box">
        <div class="arrow"></div>
      </div>
    </div>
    <div id="main-block">
      <Dashboard/>
    </div>
    <div id="user-profile-block">
      <UserProfile v-if="isClientConnected && !isNotificationsList" @openNotifications="openNotifications"/>
      <Notifications
        class="notificationsList"
        v-if="isNotificationsList"
        @closeNotifications="closeNotifications"/>
    </div>
  </div>
  <div
    v-if="isMobile && !isProfileInfo"
    id="mobile-layout"
    :class="{'light-mode': !isDarkMode}"
  >
    <div class="mobile-header">
      <div class="icon-btn" @click="openNotifications">
        <NotificationIcon :width="'40'" :height="'40'" :stroke-color="getIconStrokeColor()"/>
      </div>
      <span class="page-name">{{ router.currentRoute.value.name }}</span>
      <div class="icon-btn person-icon" @click="openProfileInfo">
        <PersonIcon :width="'20'" :height="'20'" :stroke-color="getIconStrokeColor()"/>
      </div>
    </div>
    <div id="mobile-layout-main-block">
      <Dashboard/>
    </div>
    <MobileNav :isDarkMode="isDarkMode"/>
  </div>
  <UserProfileMobile
    v-if="isClientConnected"
    @closeProfileInfo="closeProfileInfo"
    @logOut="logOut"
    :class="{ open: isProfileInfo }"
    :isProfileInfo="isProfileInfo"
  />
  <Notifications
    v-if="isMobile"
    @closeNotifications="closeNotifications"
    class="notificationsList-mobile"
    :class="{ open: isNotificationsList }"
  />
</template>

<script setup>
import { ApiClientStomp, FilesApiWs, MemberRequest, MembersApiWs } from '@ziqni-tech/member-api-client';
import { computed, onBeforeMount, ref, watch, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import TheSidebar from '@/components/sidebar/TheSidebar';
import UserProfile from '@/components/user-profile/UserProfile';
import Dashboard from '@/views/Dashboard';
import useMobileDevice from '@/hooks/useMobileDevice';
import MobileNav from '@/components/sidebar/MobileNav.vue';
import UserProfileMobile from '@/components/user-profile/UserProfileMobile.vue';
import NotificationIcon from '@/shared/components/svg-icons/NotificationIcon.vue';
import PersonIcon from '@/shared/components/svg-icons/PersonIcon.vue';
import Notifications from '@/components/notifications/Notifications.vue';
import defaultSiteConfigFile from '@/config/defaultSiteConfigFile.json';

import smallDarkLogo from '@/assets/icons/logo-small-dark.svg';
import smallLightLogo from '@/assets/icons/logo-small-light.svg';
import darkLogo from '@/assets/icons/logo-dark.svg';
import lightLogo from '@/assets/icons/logo-light.svg';
import sunIcon from '@/assets/icons/sun.svg';
import moonIcon from '@/assets/icons/moon.svg';

const localImages = {
  'assets/icons/logo-small-dark.svg': smallDarkLogo,
  'assets/icons/logo-small-light.svg': smallLightLogo,
  'assets/icons/logo-dark.svg': darkLogo,
  'assets/icons/logo-light.svg': lightLogo,
  'assets/icons/sun.svg': sunIcon,
  'assets/icons/moon.svg': moonIcon,
};

const replacePathsWithImports = (config, imageMap) => {
  const replacePath = (path) => imageMap[path] || path;
  const replaceInObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = replacePath(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        replaceInObject(obj[key]);
      }
    }
  };
  const newConfig = JSON.parse(JSON.stringify(config)); // Create a deep copy of the config
  replaceInObject(newConfig);
  return newConfig;
};

const modifiedDefaultConfig = replacePathsWithImports(defaultSiteConfigFile, localImages);

const router = useRouter();

const store = useStore();
const isReady = ref(false);
const { isMobile } = useMobileDevice();
const message = ref(null);
const isDarkMode = computed(() => store.getters.getTheme);
const isClientConnected = computed(() => store.getters.getIsConnectedClient);
const isProfileInfo = ref(false);
const isNotificationsList = ref(false);

const getIconStrokeColor = () => {
  return isDarkMode.value ? '#FFFFFF' : '#080D12';
};

const openProfileInfo = () => {
  isProfileInfo.value = true;
};

const closeProfileInfo = () => {
  isProfileInfo.value = false;
};

const openNotifications = () => {
  isNotificationsList.value = true;
};

const closeNotifications = () => {
  isNotificationsList.value = false;
};

onBeforeMount(async () => {
  const token = localStorage.getItem('token');

  ApiClientStomp.instance.client.debug = () => {
  };
  await ApiClientStomp.instance.connect({ token: localStorage.getItem('token') });
  await store.dispatch('setIsConnectedClient', true);
  await getSiteConfigFile();
});

const getSiteConfigFile = async () => {
  const urlParams = new URLSearchParams(window.location.search);

  const appConfigFileId = urlParams.get('appConfigFileId');
  const repositoryId = urlParams.get('repositoryId');

  if (appConfigFileId && repositoryId) {
    try {
      const fileApiWsClient = new FilesApiWs(ApiClientStomp.instance);

      const fileRequest = {
        ids: [appConfigFileId],
        limit: 20,
        skip: 0,
        repositoryId: repositoryId
      };


      await fileApiWsClient.getFiles(fileRequest, async (res) => {
        const configFile = await res.data.find(item => item.name === 'siteConfig.json');

        await fetch(configFile.uri)
          .then((data) => {
            return data.json();
          })
          .then((data) => {
            store.dispatch('setConfigFile', data);
          })
          .catch((err) => console.log('file config err', err));
      });
    } catch (err) {
      setTimeout(async () => {
        await getSiteConfigFile();
      }, 1000);
    }
  } else {
    await store.dispatch('setConfigFile', modifiedDefaultConfig);
  }
};


const getMemberRequest = async () => {
  const memberRequest = MemberRequest.constructFromObject(
    {
      'includeFields': [],
      'includeCustomFields': [],
      'includeMetaDataFields': []
    },
    null);

  const memberApiWsClient = new MembersApiWs(ApiClientStomp.instance);

  memberApiWsClient.getMember(memberRequest, async (data) => {
    await store.dispatch('setMemberAction', data.data);
    isReady.value = true;
  });
};

watch(isClientConnected, (value) => {
  if (value) getMemberRequest();
});

const logOut = async () => {
  await ApiClientStomp.instance.disconnect();
  localStorage.removeItem('token');
  await router.push({ path: '/login' });
};

watchEffect(() => {
  // if (message.value) console.warn('MESSAGE', message.value);
});

const isSidebarNarrow = ref(false);
const isSidebarNarrowValue = computed(() => store.getters.getIsSidebarNarrow);

onBeforeMount(() => {
  if (isSidebarNarrowValue.value) {
    isSidebarNarrow.value = isSidebarNarrowValue.value;
  }
});
const toggleSidebar = () => {
  isSidebarNarrow.value = !isSidebarNarrow.value;
  store.dispatch('setIsSidebarNarrow', isSidebarNarrow.value);
};
</script>

<style lang="scss">
@import 'src/assets/scss/_variables';

html, body {
  height: 100vh;
  margin: 0;
  overflow: hidden;
}

#app {
  height: 100%;
  overflow: hidden;
}

#app-layout {
  display: grid;
  grid-template-columns: 15% 1fr 20%;
  grid-template-rows: 100%;
  grid-template-areas: "nav main user-profile";
  height: 100%;
  margin: 0;

  &.sidebar-narrow {
    grid-template-columns: 4.5% 1fr 20%;
  }

  .sidebar-narrow-btn {
    opacity: 0;
    cursor: pointer;
    background: #0F1921;
    height: 25px;
    width: 25px;
    text-align: center;
    transform: translateX(3px) rotate(45deg);
    left: 14.2%;
    top: 59px;
    border-radius: 5px;
    border: 3px solid #0F1921;
    transition: 0.3s;
    //z-index: 100;
    position: absolute;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;

    .arrow-box {
      width: 100%;
      height: 100%;
      background: #8B96BE;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3px;

      .arrow {
        width: 100%;
        height: 100%;
        border-bottom-left-radius: 5px;
        border-left: 3px solid #FDFDFF;
        border-bottom: 3px solid #FDFDFF;
      }

      .arrow {
        width: 100%;
        height: 100%;
        border-bottom-left-radius: 5px;
        border-left: 3px solid #FDFDFF;
        border-bottom: 3px solid #FDFDFF;
      }
    }

    &.sidebar-narrow {
      left: 3.7%;

      .arrow-box {

        .arrow {
          width: 100%;
          height: 100%;
          border-bottom-left-radius: 5px;
          border-left: none;
          border-bottom: none;
          border-right: 3px solid #FDFDFF;
          border-top: 3px solid #FDFDFF;
        }
      }
    }

    &:hover {
      opacity: 1;
    }

    &__visible {
      opacity: 1;
    }
  }

  #nav-block:hover + .sidebar-narrow-btn {
    opacity: 1;
  }

  #nav-block {
    grid-area: nav;
    background-color: $secondary-bg-DM;
    position: fixed;
    height: 100%;
    overflow: auto;
    width: 15%;
    padding: 0 12px;
  }

  #nav-block.sidebar-narrow {
    width: 4.5%;
    padding: 0 5px;
  }

  #main-block {
    grid-area: main;
    padding: 0 34px 0 20px;
    background-color: $main-bg-DM;
    height: 100%;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0;
    }
  }

  #user-profile-block {
    grid-area: user-profile;
    background-color: $secondary-bg-DM;
    position: fixed;
    right: 0;
    height: 100%;
    overflow: auto;
    width: 20%;
  }

  &.light-mode {
    overflow: hidden;
    .sidebar-narrow-btn {
      background: #FFFFFF;
      border: 3px solid #FFFFFF;

      .arrow-box {
        background: #B9CEDF;
      }

      &.sidebar-narrow {
        .arrow-box {
          .arrow {
            border-right: 3px solid #FFFFFF;
            border-top: 3px solid #FFFFFF;
          }
        }
      }

    }

    #nav-block {
      background-color: $bg-secondary-LM;
    }

    #main-block {
      background-color: $bg-body-LM;

      &::-webkit-scrollbar {
        width: 0;
      }
    }

    #user-profile-block {
      background-color: $bg-secondary-LM;
    }
  }
}

.user-profile {
  position: fixed;
  top: 0;
  right: -100%;
  width: 100%;
  height: 100%;
  transition: right 0.3s ease-in-out;
}

.user-profile.open {
  right: 0;
}

.app-spinner {
  height: 100vh;
}

.notificationsList-mobile {
  position: fixed;
  top: 0;
  right: -100%;
  z-index: 11;
  transition: right 0.3s ease-in-out;
}

.notificationsList-mobile.open {
  right: 0;
}
</style>
