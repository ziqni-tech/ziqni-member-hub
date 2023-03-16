<template>
  <div class="page-header" :class="isDarkMode ? 'header-dark-mode': 'header-light-mode'">
    <div v-if="isMobile" class="page-header__mobile-logo">
      <img src="../../assets/icons/m-logo.png" alt="">
    </div>
    <div class="page-header__user-data">
      <UserProfile :name="member?.name"/>
      <Welcome v-if="!isMobile" :name="member?.name"/>
      <UserProgress/>
      <UserEnergy :energy-value="1200" :increment-energy-value="5"/>
      <Notifications :number-of-notifications="notificationsCount"/>
      <DarkModeSwitch />
    </div>
  </div>
</template>

<script setup>
import UserProfile from './UserProfile';
import Welcome from './Welcome';
import UserProgress from './UserProgress';
import UserEnergy from './UserEnergy';
import Notifications from './Notifications';
import DarkModeSwitch from './DarkModeSwitch';

import { useMedia } from '../../hooks/useMedia';
import { useStore } from 'vuex';
import { computed, ref, watchEffect } from 'vue';

const props = defineProps({ member: Object });
const isMobile = useMedia('(max-width: 1280px)');
const member = props.member.value;
const store = useStore();
const notificationsCount = ref(0);

const isDarkMode = computed(() => store.getters.getTheme);

watchEffect(() => {
  const notifications = store.getters.getNotifications;
  notificationsCount.value = notifications.length;
});

</script>

<style lang="scss">

</style>