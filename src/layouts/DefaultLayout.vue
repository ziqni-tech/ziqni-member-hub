<template>
  <div class="default-layout" v-if="!isMobile">
    <div id="nav-block">
      <TheSidebar @logOut="logOut" />
    </div>
    <div class="content">
      <TheHeader />
      <div id="main-block">
        <div v-if="isClientConnected">
          <router-view />
        </div>
      </div>
    </div>
  </div>
  <div v-if="isMobile" id="mobile-layout">
    <div class="mobile-header">
      <button class="btn"><img src="@/assets/icons/user-info/notification.png" alt=""></button>
      <span class="page-name">{{ router.currentRoute.value.name }}</span>
      <ToggleTheme class="btn"/>
    </div>
    <div id="main-block">
      <div v-if="isClientConnected">
        <router-view />
      </div>
    </div>
    <MobileNav />
  </div>
</template>

<script setup>

import { ApiClientStomp, MemberRequest, MembersApiWs } from '@ziqni-tech/member-api-client';
import { useRouter } from 'vue-router';

import TheSidebar from '../components/sidebar/TheSidebar';
import TheHeader from '../components/TheHeader';
import { computed, onMounted, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import MobileNav from '@/components/sidebar/MobileNav';
import ToggleTheme from '@/shared/components/ToggleTheme';
import useMobileDevice from '@/hooks/useMobileDevice';

const router = useRouter();
const store = useStore();

const isClientConnected = computed(() => store.getters.getIsConnectedClient);
const currentMember = reactive({});

const { isMobile } = useMobileDevice();


onMounted(async () => {
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
      padding: 100px 34px 0 20px;
      background-color: $dark-grey;
      overflow: auto;
      height: 100%;

      &::-webkit-scrollbar {
        width: 0;
      }
    }
  }
}
</style>