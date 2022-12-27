<template>
  <div class="app-layout" v-if="isReady">
    <Sidebar v-if="!isMobile" @logOut="logOut" />
    <MobileSidebar v-else/>
    <div class="right-part">
      <Navbar v-if="currentMember" :member="currentMember" />
      <div class="page-content">
        <router-view/>
      </div>
    </div>
    <Alert :message="message" />
  </div>
  <div class="spinner-wrapper" v-else>
    <CSpinner class="spinner" color="secondary"/>
  </div>
</template>

<script setup>
import { CSpinner } from '@coreui/vue';
import Navbar from '../components/header/TheHeader';
import Sidebar from '../components/sidebar/TheSidebar';
import { ApiClientStomp, MemberRequest, MembersApiWs } from '@ziqni-tech/member-api-client';
import MobileSidebar from '../components/sidebar/MobileSidebar';
import { onMounted, reactive, ref, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { useMedia } from '../hooks/useMedia';
import { useRouter } from 'vue-router';
import Alert from '../components/Alert';

const store = useStore();
const router = useRouter();
const isReady = ref(false);
const isMobile = useMedia('(max-width: 1280px)');
const currentMember = reactive({});
const message = ref(null)

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

  ApiClientStomp.instance.sendSys('', {}, (json, headers) => {
    console.warn('sendSys headers:', headers);
    console.warn('sendSys json:', json);
    message.value = json;
    store.dispatch('setNotificationAction', json)
  });
});

const logOut = async () => {
  await ApiClientStomp.instance.disconnect();
  localStorage.removeItem('token');
  await router.push({ path: '/login' });
};

watchEffect(() => {
  if (message) console.warn('MESSAGE', message.value);
})
</script>

<style lang="scss">
.app-layout {
  display: flex;
  width: 100%;
  height: 100vh;

  .right-part {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
}
</style>