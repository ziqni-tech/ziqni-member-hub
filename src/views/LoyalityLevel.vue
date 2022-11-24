<template>
  <CContainer>
    <h1 class="page-title">Loyality Level</h1>
    <LoyalityCard />
    <div class="loyality-charts">
      <LoyalityLevelChartsCard />
    </div>
  </CContainer>

</template>

<script>
import { CContainer } from '@coreui/vue';
import LoyalityCard from '../components/loyality-level/LoyalityCard';
import LoyalityLevelChartsCard from '../components/loyality-level/LoyalityLevelChartsCard';

export default {
  name: 'LoyalityLevel',
  components: {
    LoyalityLevelChartsCard,
    CContainer,
    LoyalityCard
  }
};
</script>

<style lang="scss">
.page-title {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  line-height: 33px;
  color: #737478;
  text-align: start;
}
.loyality-charts {
  padding-top: 75px;
}
</style>