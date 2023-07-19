<template>
  <div id="app-layout"
       v-if="!isMobile && isDarkMode !== null"
       :class="{'light-mode': !isDarkMode}"
  >
    <div id="nav-block">
      <TheSidebar @logOut="logOut" />
    </div>
    <div id="main-block" >
      <Dashboard />
    </div>
    <div id="user-profile-block">
      <UserProfile v-if="isClientConnected"/>
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
      <button class="btn"><img src="@/assets/icons/user-info/notification.png" alt=""></button>
      <span class="page-name">{{ router.currentRoute.value.name }}</span>
      <button class="btn" @click="openProfileInfo"><img src="@/assets/icons/user-info/user.png" alt=""></button>
    </div>
    <div id="mobile-layout-main-block">
      <Dashboard />
    </div>
    <MobileNav />
  </div>
  <UserProfileMobile
      v-if="isClientConnected"
      @closeProfileInfo="closeProfileInfo"
      @logOut="logOut"
      :class="{ open: isProfileInfo }"
      :isProfileInfo="isProfileInfo"
  />
</template>

<script setup>
import { ApiClientStomp, MemberRequest, MembersApiWs } from '@ziqni-tech/member-api-client';
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import TheSidebar from '@/components/sidebar/TheSidebar';
import UserProfile from '@/components/user-profile/UserProfile';
import Dashboard from '@/views/Dashboard';
import useMobileDevice from '@/hooks/useMobileDevice';
import MobileNav from '@/components/sidebar/MobileNav.vue';
import UserProfileMobile from '@/components/user-profile/UserProfileMobile.vue';
import { CSpinner } from "@coreui/vue";

const router = useRouter();

const store = useStore();
const isReady = ref(false);
const { isMobile } = useMobileDevice();
const message = ref(null);
const isDarkMode = computed(() => store.getters.getTheme);
const isClientConnected = computed(() => store.getters.getIsConnectedClient);
const isProfileInfo = ref(false);

const openProfileInfo = () => {
  isProfileInfo.value = true;
}

const closeProfileInfo = () => {
  isProfileInfo.value = false;
}

onMounted(async () => {
  ApiClientStomp.instance.client.debug = () => {};
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
    background-color: $light-grey;
    position: fixed;
    height: 100%;
    overflow: auto;
    width: 15%;
  }

  #main-block {
    grid-area: main;
    padding: 20px 34px 0 20px;
    background-color: $dark-grey;
    overflow: auto;
    height: 100%;

    &::-webkit-scrollbar {
      width: 0;
    }
  }

  #user-profile-block {
    grid-area: user-profile;
    background-color: $light-grey;
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
</style>