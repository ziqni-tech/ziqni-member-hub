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
@import '../assets/scss/utils/vars';
.loyality-charts {
  padding-top: 75px;

  @media screen and (max-width: $phoneWidth) {
    padding-top: 40px;
  }
}
</style>