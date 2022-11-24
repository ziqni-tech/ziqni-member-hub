<template>
  <CContainer>
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
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">Current Missions</h2>
        <ActionsBlock />
      </div>
      <div class="missions-cards">
        <MissionCard class="missions-card" />
        <MissionCard class="missions-card" />
        <MissionCard class="missions-card" />
      </div>
    </div>
  </CContainer>
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
import MissionCard from '../components/MissionCard';
import ActionsBlock from '../shared/components/actions-block/ActionsBlock';
import CurrentTournamentsSection from '../components/tournaments/CurrentTournamentsSection';

export default {
  name: 'Dashboard',
  components: {
    CurrentTournamentsSection,
    ActionsBlock,
    MissionCard,
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
  padding: 19px 45px;
  margin: 0;

  .section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .section-header {
      width: inherit;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 50px 45px 30px 0;
    }
  }

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

  .section-title {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 33px;
    color: #737478;
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
}
</style>