<template>
  <div
      id="app-layout"
      v-if="!isMobile && isDarkMode !== null"
      :class="{'light-mode': !isDarkMode}"
  >
    <div id="nav-block">
      <TheSidebar @logOut="logOut"/>
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
    <div class="spinner-wrapper-global" v-if="isDarkMode === null">
      <CSpinner grow size="sm"/>
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
import { ApiClientStomp, MemberRequest, MembersApiWs } from '@ziqni-tech/member-api-client';
import { computed, onBeforeMount, onMounted, ref, watch, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import TheSidebar from '@/components/sidebar/TheSidebar';
import UserProfile from '@/components/user-profile/UserProfile';
import Dashboard from '@/views/Dashboard';
import useMobileDevice from '@/hooks/useMobileDevice';
import MobileNav from '@/components/sidebar/MobileNav.vue';
import UserProfileMobile from '@/components/user-profile/UserProfileMobile.vue';
import { CSpinner } from '@coreui/vue';
import NotificationIcon from '@/shared/components/svg-icons/NotificationIcon.vue';
import PersonIcon from '@/shared/components/svg-icons/PersonIcon.vue';
import Notifications from '@/components/notifications/Notifications.vue';

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
  ApiClientStomp.instance.client.debug = () => {
  };
  await ApiClientStomp.instance.connect({ token: localStorage.getItem('token') });
  await store.dispatch('setIsConnectedClient', true);
});

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
</script>

<style lang="scss">
@import 'src/assets/scss/_variables';

html, body {
  height: 100%;
  margin: 0;
}

#app {
  height: 100%;
}

#app-layout {
  display: grid;
  grid-template-columns: 15% 1fr 20%;
  grid-template-rows: 1fr;
  grid-template-areas: "nav main user-profile";
  height: 100%;
  margin: 0;

  #nav-block {
    grid-area: nav;
    background-color: $secondary-bg-DM;
    position: fixed;
    height: 100%;
    overflow: auto;
    width: 15%;
  }

  #main-block {
    grid-area: main;
    padding: 20px 34px 0 20px;
    background-color: $main-bg-DM;
    height: 100%;

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