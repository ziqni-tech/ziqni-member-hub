<template>
  <div class="page-header">
    <div v-if="isMobile" class="page-header__mobile-logo">
      <img src="../../assets/icons/m-logo.png" alt="">
    </div>
    <div class="page-header__user-data">
      <UserProfile :name="member?.name" />
      <Welcome v-if="!isMobile" :name="member?.name" />
      <UserProgress />
      <UserEnergy :energy-value="1200" :increment-energy-value="5" />
      <Notifications :number-of-notifications="5" />
      <GameModeSwitch v-if="!isMobile" />
    </div>
  </div>
</template>

<script setup>
import UserProfile from './UserProfile';
import Welcome from './Welcome';
import UserProgress from './UserProgress';
import UserEnergy from './UserEnergy';
import Notifications from './Notifications';
import GameModeSwitch from './GameModeSwitch';

import { useMedia } from '../../hooks/useMedia';

const props = defineProps({ member: Object });
const isMobile = useMedia('(max-width: 1280px)');
const member = props.member.value;

</script>

<style lang="scss">

</style>