<template>
  <h1 class="section-title">Loyality Level</h1>
  <LoyalityCard />
  <div class="loyality-charts">
    <LoyalityLevelChartsCard :member="member" />
  </div>
</template>

<script setup>
import LoyalityCard from '../components/loyality-level/LoyalityCard';
import LoyalityLevelChartsCard from '../components/loyality-level/LoyalityLevelChartsCard';
import { useStore } from 'vuex';

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