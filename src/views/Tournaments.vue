<template>
  <div class="page-container">
    <TournamentsContainer :is-featured-tournaments="true" :cards="$options.tournamentCards" />
    <TournamentsContainer :is-current-tournaments="true" :cards="$options.tournamentCards" />
  </div>
</template>

<script>
import { CContainer } from '@coreui/vue';
import TournamentsContainer from '../components/tournaments/TournamentsContainer';

const tournamentCards = [
  {title: 'King Tournament', percentComplete: 64, pricePerHour: 32, someCount: 132, bg: 'king-tournament'},
  {title: 'Star Tournament', percentComplete: 54, pricePerHour: 28, someCount: 130, bg: 'star-tournament'},
  {title: 'Win Tournament', percentComplete: 74, pricePerHour: 28, someCount: 130, bg: 'win-tournament'},
]

export default {
  name: 'Tournaments',
  tournamentCards,
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