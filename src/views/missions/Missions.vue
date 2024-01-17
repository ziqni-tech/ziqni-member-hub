<template>
  <div class="missions">
    <CurrentMissionsSection/>
  </div>
</template>

<script setup>
import CurrentMissionsSection from '../../components/missions/CurrentMissionsSection';
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

<style scoped lang="scss">
.missions {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding: 0 20px;

  &::-webkit-scrollbar {
    width: 0;
  }
}

@media screen and (max-width: 820px) {
  .missions {
    padding: 0;
  }
}
</style>