<template>
  <div class="section">
    <div class="section_header">
      <h2 class="section-title">Feature Promotions</h2>
    </div>
    <div class="info-container">
      <MonthlyTournament />
      <div class="charts-container">
        <div class="starts-in-cards">
          <SponsoredByCard />
          <StartsInCard />
          <StartsInCard />
        </div>
        <InstantRewardsChancesCard />
      </div>
    </div>
  </div>
  <CurrentTournamentsSection />
  <CurrentMissionsSection />
</template>

<script setup>
import MonthlyTournament from '../components/MonthlyTournament';
import InstantRewardsChancesCard from '../components/InstantRewardsChancesCard'
import SponsoredByCard from '../components/SponsoredByCard';

import StartsInCard from '../components/StartsInCard';

import CurrentTournamentsSection from '../components/tournaments/CurrentTournamentsSection';
import CurrentMissionsSection from '../components/missions/CurrentMissionsSection';

</script>

<style lang="scss">
@import '../assets/scss/utils/vars';

.info-container {
  display: flex;
  width: 100%;

  .charts-container {
    padding: 0 20px;

    .starts-in-cards {
      display: flex;
      justify-content: space-between;
      padding-bottom: 18px;
    }
  }
}
@media screen and (max-width: $phoneWidth){
  .info-container {
    flex-wrap: wrap;
    justify-content: center;

    .charts-container {
      padding: 10px 0 0;
      width: 100%;

      .starts-in-cards {
        width: 100%;
      }
    }
  }
}
</style>