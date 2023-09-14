<template>
  <div
      class="default-layout"
      v-if="!isMobile"
      :class="{'light-mode': !isDarkMode}"
  >
    <div id="nav-block">
      <TheSidebar @logOut="logOut"/>
    </div>
    <div class="content">
      <TheHeader @openNotifications="openNotifications"/>
      <div id="main-block">
        <div v-if="isClientConnected" class="main-block_content">
          <router-view/>
        </div>
        <Notifications
            @closeNotifications="closeNotifications"
            class="notificationsList"
            :class="{ open: isNotificationsList }"
        />
      </div>
    </div>
  </div>
  <div
      v-if="isMobile"
      id="mobile-layout"
      :class="{'light-mode': !isDarkMode}"
  >
    <div class="mobile-header">
      <div
          class="go-back-btn"
          @click="$router.go(-1)"
          v-if="isGoBackBtn"
      >
        <ArrowLeft :width="'40'" :height="'40'" :stroke-color="getIconStrokeColor()"/>
      </div>
      <div v-if="!isGoBackBtn" class="icon-btn" @click="openNotifications">
        <NotificationIcon :width="'40'" :height="'40'" :stroke-color="getIconStrokeColor()"/>
      </div>
      <img src="@/assets/icons/taveo-logo.svg" alt="">
      <div class="icon-btn person-icon" @click="openProfileInfo">
        <PersonIcon :width="'20'" :height="'20'" :stroke-color="getIconStrokeColor()"/>
      </div>
    </div>
    <div id="mobile-layout-main-block">
      <div v-if="isClientConnected" :style="{height: '100%', width: '100%', padding: 0, margin: 0}">
        <router-view/>
      </div>
    </div>
    <MobileNav :isDarkMode="isDarkMode"/>
    <UserProfileMobile
        v-if="isClientConnected"
        @closeProfileInfo="closeProfileInfo"
        @logOut="logOut"
        :class="{ open: isProfileInfo }"
        :isProfileInfo="isProfileInfo"
    />
    <Notifications
        @closeNotifications="closeNotifications"
        class="notificationsList-mobile"
        :class="{ open: isNotificationsList }"
    />
  </div>
</template>

<script setup>

import { ApiClientStomp, MemberRequest, MembersApiWs } from '@ziqni-tech/member-api-client';
import { useRouter } from 'vue-router';

import TheSidebar from '../components/sidebar/TheSidebar';
import TheHeader from '../components/TheHeader';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';
import MobileNav from '@/components/sidebar/MobileNav';
import useMobileDevice from '@/hooks/useMobileDevice';
import UserProfileMobile from '@/components/user-profile/UserProfileMobile.vue';
import NotificationIcon from '@/shared/components/svg-icons/NotificationIcon.vue';
import PersonIcon from '@/shared/components/svg-icons/PersonIcon.vue';
import ArrowLeft from '@/shared/components/svg-icons/ArrowLeft.vue';
import splitCamelCaseToWords from '../utils/splitCamelCaseToWords';
import Notifications from '@/components/notifications/Notifications.vue';

const router = useRouter();
const store = useStore();

const isDarkMode = computed(() => store.getters.getTheme);
const isClientConnected = computed(() => store.getters.getIsConnectedClient);
const currentMember = reactive({});
const isNotificationsList = ref(false);

const { isMobile } = useMobileDevice();

const isGoBackBtn = computed(() => {
  const pathLength = router.currentRoute.value.path.split('/').length;

  return !!(router.currentRoute.value.params.id || pathLength > 2);
});

const isProfileInfo = ref(false);

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

onMounted(async () => {
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
    currentMember.value = await data.data;
    await store.dispatch('setMemberAction', data.data);
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
</script>

<style lang="scss" scoped>
@import 'src/assets/scss/_variables';

.default-layout {
  display: grid;
  grid-template-columns: 15% 85%;
  grid-template-areas: "nav main";
  height: 100%;

  #nav-block {
    grid-area: nav;
    background-color: $secondary-bg-DM;
    position: fixed;
    height: 100%;
    overflow: auto;
    width: 15%;
  }

  .content {
    grid-area: main;

    #main-block {
      padding: 74px 0 0 20px;
      background-color: $main-bg-DM;
      overflow: hidden;
      height: 100%;
      position: relative;

      .main-block_content {
        position: absolute;
        top: 73px;
        left: 0;
        width: 100%;
        height: calc(100% - 80px);
      }

      .notificationsList {
        max-width: 270px;
        position: fixed;
        top: 0;
        right: -270px;
        z-index: 10;
        transition: right 0.3s ease-in-out;
      }

      .notificationsList.open {
        right: 0;
      }

      &::-webkit-scrollbar {
        width: 0;
      }
    }
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