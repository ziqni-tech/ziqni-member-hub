<template>
  <div class="header">
    <h1 class="section-title">{{ tournamentItem ? tournamentItem.name : '' }} 😝</h1>
    <img class="share-icon" src="../../assets/icons/share-icon.svg" alt=""/>
  </div>
  <TournamentDetailsCard :tournament="tournamentItem"/>
  <div class="header" v-if="leaderboard">
    <h2 class="section-title">Leaderboard</h2>
    <img class="share-icon" src="../../assets/icons/share-icon.svg" alt=""/>
  </div>
  <div class="tables" v-if="leaderboard">
    <Leaderboard :leaderboard="leaderboard"/>
  </div>
  <NotFoundItems v-else :title="'available competition'" />
</template>

<script setup>
import Leaderboard from '../../components/tournament-leaders/Leaderboard';
import TournamentDetailsCard from '../../components/tournaments/TournamentDetailsCard';
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useGetContests } from '../../hooks/useGetContests';
import { useGetLeaderboard } from '../../hooks/useGetLeaderboard';
import NotFoundItems from '../../components/NotFoundItems';
import { useCompetitions } from '../../hooks/useCompetitions';

const { getCompetitionsHandler, competitions } = useCompetitions();
const { getEntityContests, contests } = useGetContests();
const { getEntityLeaderboard, leaderboard } = useGetLeaderboard();

const route = useRoute();
const ids = [route.params.id];
const statusCode = {
  moreThan: 5,
  lessThan: 100
}

const tournamentItem = ref(null);

getCompetitionsHandler(statusCode, 1, 0, ids);

watchEffect( () => {
  tournamentItem.value = competitions.value[0];
  const competitionId = competitions.value[0]?.id;
  if (competitionId) getEntityContests(competitionId)
})

watchEffect( () => {
  if (contests.value[0]) {
    const contestId = contests.value[0].id;
    getEntityLeaderboard(contestId);
  }
})
</script>

<style lang="scss">
@import '../../assets/scss/utils/vars';

@media screen and (max-width: 1280px){
  .tournament_card {
    width: 100%;
    //height: 310px;
  }
}

.tournament_card {
  max-width: 1030px;
  height: 310px;
}

.banner {
  width: 100%;
}

.header {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  background: none;
  border: none;

  .share-icon {
    height: 30px;
    width: 30px;
    margin-left: 18px;
  }
}

.tables {
  display: flex;
}
</style>