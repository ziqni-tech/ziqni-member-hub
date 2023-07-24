<template>
  <div
      class="default-layout"
      v-if="!isMobile"
      :class="{'light-mode': !isDarkMode}"
  >
    <div id="nav-block">
      <TheSidebar @logOut="logOut" />
    </div>
    <div class="content">
      <TheHeader />
      <div id="main-block">
        <div v-if="isClientConnected" class="main-block_content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
  <div
      v-if="isMobile"
      id="mobile-layout"
      :class="{'light-mode': !isDarkMode}"
  >
    <div class="mobile-header">
      <button
          class="go-back-btn"
          @click="$router.go(-1)"
          v-if="isGoBackBtn"
      >
        <ArrowLeft :strokeColor="getIconStrokeColor()" />
      </button>
      <div v-if="!isGoBackBtn" class="icon-btn">
        <NotificationIcon :width="'40'" :height="'40'" :stroke-color="getIconStrokeColor()" />
      </div>
      <span class="page-name">{{ router.currentRoute.value.name }}</span>
      <div class="icon-btn person-icon" @click="openProfileInfo">
        <PersonIcon :width="'20'" :height="'20'" :stroke-color="getIconStrokeColor()" />
      </div>
    </div>
    <div id="mobile-layout-main-block">
      <div v-if="isClientConnected">
        <router-view />
      </div>
    </div>
    <MobileNav :isDarkMode="isDarkMode" />
    <UserProfileMobile
        v-if="isClientConnected"
        @closeProfileInfo="closeProfileInfo"
        @logOut="logOut"
        :class="{ open: isProfileInfo }"
        :isProfileInfo="isProfileInfo"
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

const router = useRouter();
const store = useStore();

const isDarkMode = computed(() => store.getters.getTheme);

const isClientConnected = computed(() => store.getters.getIsConnectedClient);
const currentMember = reactive({});

const { isMobile } = useMobileDevice();

const isGoBackBtn = computed(() => {
  const pathLength = router.currentRoute.value.path.split('/').length;

  return !!(router.currentRoute.value.params.id || pathLength > 2);
});

const isProfileInfo = ref(false);

const getIconStrokeColor = () => {
  return isDarkMode.value ? '#FFFFFF' : '#080D12'
};


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
  height: 100vh;

  #nav-block {
    grid-area: nav;
    background-color: $light-grey;
    position: fixed;
    height: 100%;
    overflow: auto;
    width: 15%;
  }

  .content {
    grid-area: main;

    #main-block {
      padding: 74px 0 0 20px;
      background-color: $dark-grey;
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
</style>