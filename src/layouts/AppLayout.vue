<template>
  <div id="app-layout">
    <div id="nav-block">
      <SidebarItems :nav-items="sidebarNav" />
    </div>
    <div id="main-block">
      main block
    </div>
    <div id="user-profile-block">
      user profile
    </div>
  </div>
</template>

<script setup>
import sidebarNav from '../components/sidebar/sidebarNav';
import SidebarItems from '@/components/sidebar/SidebarItems'
import { ApiClientStomp, MemberRequest, MembersApiWs } from '@ziqni-tech/member-api-client';
import { computed, onMounted, reactive, ref, watch, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { useMedia } from '../hooks/useMedia';
import { useRouter } from 'vue-router';


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
    border: 1px solid red;
  }

  #main-block {
    grid-area: main;
    border: 1px solid yellowgreen;
  }

  #user-profile-block {
    grid-area: user-profile;
    border: 1px solid red;
  }
}

.app-spinner {
  height: 100vh;
}
</style>