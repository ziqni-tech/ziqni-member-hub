<template>
  <InstantWinsSection />
  <AchievementsSection v-if="isClientConnected" :is-dashboard="true" />
  <CurrentTournamentsSection v-if="isClientConnected" :is-dashboard="true" />
</template>

<script setup>
import CurrentTournamentsSection from '../components/tournaments/CurrentTournamentsSection';
import InstantWinsSection from '../components/instant-wins/InstantWinsSection';
import AchievementsSection from '../components/achievements/AchievementsSection';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const isClientConnected = computed(() => store.getters.getIsConnectedClient)
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