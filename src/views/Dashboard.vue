<template>
  <CContainer>
    <div class="info-container">
      <TotalInfo />
      <div class="charts-container">
        <PieChartCard />
      </div>
    </div>
    <TournamentCards :cards="$options.tournamentCards" />
  </CContainer>
</template>

<script>
import { CContainer } from '@coreui/vue'
import TotalInfo from '../components/TotalInfo';
import TournamentCards from '../components/TournamentCards';
import PieChartCard from '../components/PieChartCard';

import kingTournamentIcon from '../assets/icons/king-tournament.svg';
import starTournamentIcon from '../assets/icons/star-tournament.svg';
import winTournamentIcon from '../assets/icons/win-tournament.svg';

const tournamentCards = [
  {title: 'King Tournament', icon: kingTournamentIcon, percentComplete: 64, pricePerHour: 32, someCount: 132, bg: 'king-tournament'},
  {title: 'Star Tournament', icon: starTournamentIcon, percentComplete: 54, pricePerHour: 28, someCount: 130, bg: 'star-tournament'},
  {title: 'Win Tournament', icon: winTournamentIcon, percentComplete: 74, pricePerHour: 28, someCount: 130, bg: 'win-tournament'},
]
export default {
  name: 'Dashboard',
  tournamentCards,
  components: {
    PieChartCard,
    CContainer,
    TotalInfo,
    TournamentCards
  }
};
</script>

<style lang="scss">
.container {
  padding: 30px 45px;

  .info-container {
    display: flex;

    .charts-container {
      padding: 0 20px;
    }
  }
}
</style>