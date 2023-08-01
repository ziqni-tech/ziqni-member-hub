<template>
  <div class="page-content">
    <AchievementsSection/>
  </div>
</template>

<script setup>
import AchievementsSection from '@/components/achievements/AchievementsSection.vue';
import { onBeforeMount } from 'vue';
import { ApiClientStomp } from '@ziqni-tech/member-api-client';
import { useStore } from 'vuex';

const store = useStore();

onBeforeMount(async () => {
  ApiClientStomp.instance.client.debug = () => {
  };
  await ApiClientStomp.instance.connect({ token: localStorage.getItem('token') });
  await store.dispatch('setIsConnectedClient', true);
});

</script>

<style lang="scss">

</style>