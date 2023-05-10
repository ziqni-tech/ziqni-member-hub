<template>
  <div id="app-layout">
    <div id="nav-block">
      <TheSidebar @logOut="logOut" />
    </div>
    <div id="main-block">
      <router-view/>
    </div>
    <div id="user-profile-block">
      <UserProfile />
    </div>
  </div>
</template>

<script setup>
import { ApiClientStomp, MemberRequest, MembersApiWs } from '@ziqni-tech/member-api-client';
import { computed, onMounted, reactive, ref, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { useMedia } from '../hooks/useMedia';
import { useRouter } from 'vue-router';
import TheSidebar from '../components/sidebar/TheSidebar';
import UserProfile from '../components/user-profile/UserProfile';

const store = useStore();
const router = useRouter();
const isReady = ref(false);
const isMobile = useMedia('(max-width: 1280px)');
const currentMember = reactive({});
const message = ref(null);

const isDarkMode = computed(() => store.getters.getTheme);

onMounted(async () => {
  await ApiClientStomp.instance.connect({ token: localStorage.getItem('token') });

  const memberRequest = MemberRequest.constructFromObject(
    {
      'includeFields': [],
      'includeCustomFields': [],
      'includeMetaDataFields': []
    },
    null);

  const memberApiWsClient = new MembersApiWs(ApiClientStomp.instance);

  memberApiWsClient.getMember(memberRequest, async (data) => {
    console.warn('MEMBER', data.data);
    currentMember.value = await data.data;
    await store.dispatch('setMemberAction', data.data);
    isReady.value = true;
  });

  ApiClientStomp.instance.sendSys('', {}, (data, headers) => {
    if (data.hasOwnProperty('leaderboardEntries')) {
      store.dispatch('setLeaderboardAction', data.leaderboardEntries)
    } else {
      message.value = data;
      // store.dispatch('setNotificationAction', data);
    }
  });
});

const logOut = async () => {
  await ApiClientStomp.instance.disconnect();
  localStorage.removeItem('token');
  await router.push({ path: '/login' });
};

watchEffect(() => {
  if (message.value) console.warn('MESSAGE', message.value);
})
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
}

.app-spinner {
  height: 100vh;
}
</style>