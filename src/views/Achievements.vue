<template>
  <AchievementsSection />
</template>

<script setup>
import { useStore } from 'vuex';
import AchievementsSection from '../components/achievements/AchievementsSection';

const store = useStore();
const member = store.getters.getMember;

</script>

<style lang="scss">

</style>