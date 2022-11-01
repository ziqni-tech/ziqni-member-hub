<template>
  <div class="page-container">
    <TournamentsContainer :is-featured-missions="true" :cards="$options.missionCards" />
    <TournamentsContainer :is-current-missions="true" :cards="$options.missionCards" />
  </div>
</template>

<script>
import { CContainer } from '@coreui/vue';
import TournamentsContainer from '../components/tournaments/TournamentsContainer';

const missionCards = [
  {title: 'King mission',  percentComplete: 64, pricePerHour: 32, someCount: 132, bg: 'king-tournament'},
  {title: 'Star mission',  percentComplete: 54, pricePerHour: 28, someCount: 130, bg: 'star-tournament'},
  {title: 'Win mission',  percentComplete: 74, pricePerHour: 28, someCount: 130, bg: 'win-tournament'},
]

export default {
  name: 'Missions',
  missionCards,
  components: {
    CContainer,
    TournamentsContainer
  }
};
</script>

<style lang="scss">
.page-container {
  padding: 21px 42px;
}
</style>