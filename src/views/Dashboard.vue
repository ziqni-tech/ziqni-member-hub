<template>
  <CContainer>
<!--    Feature Promotions-->
<!--    Current Tournaments-->
<!--    Current Missions-->
    <div class="info-container">
      <MonthlyTournament />
      <div class="charts-container">
        <div class="starts-in-cards">
          <SponsoredByCard />
          <StartsInCard />
        </div>
        <InstantRewardsChancesCard />
      </div>
    </div>
    <div class="cards-container">
      <div v-for="(card) of $options.tournamentCards">
        <TournamentCard :card="card" />
      </div>
    </div>
  </CContainer>
</template>

<script>
import { CContainer } from '@coreui/vue';
import TotalInfo from '../components/TotalInfo';
import TournamentCard from '../components/TournamentCard';
import PieChartCard from '../components/PieChartCard';
import ActivityChartCard from '../components/ActivityChartCard';

import MonthlyTournament from '../components/MonthlyTournament';
import InstantRewardsChancesCard from '../components/InstantRewardsChancesCard'
import SponsoredByCard from '../components/SponsoredByCard';

import kingTournamentIcon from '../assets/icons/king-tournament.svg';
import starTournamentIcon from '../assets/icons/star-tournament.svg';
import winTournamentIcon from '../assets/icons/win-tournament.svg';
import StartsInCard from '../components/StartsInCard';

const tournamentCards = [
  {title: 'King Tournament', icon: kingTournamentIcon, percentComplete: 64, pricePerHour: 32, someCount: 132, bg: 'king-tournament'},
  {title: 'Star Tournament', icon: starTournamentIcon, percentComplete: 54, pricePerHour: 28, someCount: 130, bg: 'star-tournament'},
  {title: 'Win Tournament', icon: winTournamentIcon, percentComplete: 74, pricePerHour: 28, someCount: 130, bg: 'win-tournament'},
]
export default {
  name: 'Dashboard',
  tournamentCards,
  components: {
    StartsInCard,
    SponsoredByCard,
    MonthlyTournament,
    PieChartCard,
    CContainer,
    TotalInfo,
    TournamentCard,
    ActivityChartCard,
    InstantRewardsChancesCard
  }
};
</script>

<style lang="scss">
.container {
  padding: 30px 45px;
  margin: 0;

  .info-container {
    display: flex;

    .charts-container {
      padding: 0 20px;

      .starts-in-cards {
        display: flex;
        padding-bottom: 18px;
      }
    }
  }

  .cards-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-top: 55px;
  }
}
</style>