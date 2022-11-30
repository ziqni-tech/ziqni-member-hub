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

<script>
import { CContainer } from '@coreui/vue';
import TotalInfo from '../components/TotalInfo';
import TournamentCard from '../components/tournaments/TournamentCard';
import PieChartCard from '../components/PieChartCard';
import ActivityChartCard from '../components/ActivityChartCard';

import MonthlyTournament from '../components/MonthlyTournament';
import InstantRewardsChancesCard from '../components/InstantRewardsChancesCard'
import SponsoredByCard from '../components/SponsoredByCard';

import StartsInCard from '../components/StartsInCard';
import ActionsBlock from '../shared/components/actions-block/ActionsBlock';
import CurrentTournamentsSection from '../components/tournaments/CurrentTournamentsSection';
import CurrentMissionsSection from '../components/missions/CurrentMissionsSection';

export default {
  name: 'Dashboard',
  components: {
    CurrentMissionsSection,
    CurrentTournamentsSection,
    ActionsBlock,
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
.tournament-cards, .missions-cards {
  width: 100%;
  display: flex;
  align-items: center;

  .tournament-card {
    margin-right: 30px;
  }

  .missions-card {
    margin-right: 30px;
  }
}

.info-container {
  display: flex;

  .charts-container {
    padding: 0 20px;

    .starts-in-cards {
      display: flex;
      justify-content: space-between;
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
</style>