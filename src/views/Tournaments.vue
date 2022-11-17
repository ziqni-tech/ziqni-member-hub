<template>
  <div class="page-container">
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">Feature Tournaments</h2>
        <ActionsBlock />
      </div>
      <div class="tournament-cards">
        <TournamentCard class="tournament-card" />
        <TournamentCard />
        <TournamentCard />
      </div>
    </div>
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">Current Tournaments</h2>
        <ActionsBlock />
      </div>
      <div class="tournament-cards">
        <TournamentCard class="tournament-card" />
        <TournamentCard />
        <TournamentCard />
        <TournamentCard />
        <TournamentCard />
        <TournamentCard />
        <TournamentCard />
        <TournamentCard />
        <TournamentCard />
        <TournamentCard />
        <TournamentCard />
        <TournamentCard />
        <TournamentCard />
        <TournamentCard />
      </div>
    </div>
  </div>
</template>

<script>
import { CContainer } from '@coreui/vue';
import ActionsBlock from '../shared/components/actions-block/ActionsBlock';
import TournamentCard from '../components/tournaments/TournamentCard';

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
    ActionsBlock,
    TournamentCard
  }
};
</script>

<style lang="scss">
.page-container {
  padding: 21px 42px;

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

    .tournament-cards, .missions-cards {
      width: 100%;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      overflow: hidden;
      overflow-x: scroll;

      .tournament-card {
        margin-right: 30px;
      }
      &::-webkit-scrollbar {
        height: 7px;
        width: 7px;
        background-color: #f0f0f0;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background-color: #8a8a8a;
      }
    }
  }
}
</style>