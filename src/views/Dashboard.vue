<template>
  <div class="section">
    <div class="section_header">
      <h2 class="section-title">Feature Promotions</h2>
    </div>
    <div class="info-container">
      <div class="charts-container">
        <div class="starts-in-cards">

        </div>
        <div class="instant-rewards-chances-card-wrapper">

        </div>
      </div>
    </div>
  </div>
  <CurrentTournamentsSection :is-dashboard="true" />
  <CurrentMissionsSection :is-dashboard="true" />
</template>

<script setup>


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
@media screen and (max-width: 850px) {
  .info-container {
    flex-wrap: wrap;
    justify-content: center;

    .charts-container {
      padding: 10px 0 0;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .starts-in-cards {
        width: 90%;
        padding-bottom: 10px;
      }
      .instant-rewards-chances-card-wrapper {
        width: 90%;
      }
    }
  }
}
@media screen and (max-width: $phoneWidth) {
  .info-container {
    flex-wrap: wrap;
    justify-content: center;

    .charts-container {
      padding: 10px 0 0;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .starts-in-cards {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .instant-rewards-chances-card-wrapper {
        width: 100%;
      }
    }
  }
}
</style>