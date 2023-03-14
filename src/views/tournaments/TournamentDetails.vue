<template>
  <Loader v-if="!currentTournament" :title="'Loading'" />
  <div v-else>
    <div class="header">
      <h1 class="section-title">{{ currentTournament.name }}</h1>
      <img class="share-icon" src="../../assets/icons/share-icon.svg" alt="" />
    </div>
    <TournamentDetailsCard
        :tournament="currentTournament"
        @joinTournament="joinTournament"
        @leaveTournament="leaveTournament"
    />
    <div class="header" v-if="leaderboard">
      <h2 class="section-title">Leaderboard</h2>
      <img class="share-icon" src="../../assets/icons/share-icon.svg" alt="" />
    </div>
    <div class="tables" v-if="leaderboardIsLoaded && leaderboardEntries">
      <Leaderboard :leaderboard="leaderboardEntries" />
    </div>
    <NotFoundItems v-else :title="'active members'" />
  </div>

</template>

<script setup>
import Leaderboard from '../../components/tournament-leaders/Leaderboard';
import TournamentDetailsCard from '../../components/tournaments/TournamentDetailsCard';
import { onUnmounted, ref, watchEffect, watch, onBeforeMount, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useGetContests } from '../../hooks/useGetContests';
import { useGetLeaderboard } from '../../hooks/useGetLeaderboard';
import NotFoundItems from '../../components/NotFoundItems';
import { useCompetitions } from '../../hooks/useCompetitions';
import { useStore } from 'vuex';
import Loader from '../../components/Loader';
import {
  ApiClientStomp,
  LeaderboardApiWs,
  ManageOptinRequest,
  OptInApiWs,
  OptInStatesRequest
} from '@ziqni-tech/member-api-client';

const { getCompetitionsHandler, tournamentsResponse } = useCompetitions();
const { getEntityContests, contests } = useGetContests();
const { getEntityLeaderboard, leaderboard } = useGetLeaderboard();

const route = useRoute();
const ids = [route.params.id];
const statusCode = {
  moreThan: 5,
  lessThan: 100
};

const store = useStore();
const tournamentItem = ref(null);
const isLoaded = ref(false)
const leaderboardIsLoaded = computed(() => store.getters.getLeaderboardIsLoaded);
const leaderboardEntries = computed(() => store.getters.getLeaderboardEntries);
const currentTournament = computed(() => store.getters.getCurrentTournament);

const tournamentRequestData = {
  statusCode,
  limit: 1,
  skip: 0,
  ids
};
onBeforeMount(() => {
  getCompetitionsHandler(tournamentRequestData);
  getOptInStatus()
});

watch(tournamentsResponse, (currentValue, oldValue) => {
  if (currentValue) {
    isLoaded.value = true;
    tournamentItem.value = currentValue.data[0];
    const competitionId = currentValue.data[0]?.id;
    getEntityContests(competitionId);
  }
})

watchEffect(() => {
  if (contests.value[0]) {
    const contestId = contests.value[0].id;
    getEntityLeaderboard(contestId);
  }
});

const unsubscribeEntityLeaderboard = async () => {
  const contestId = contests.value[0]?.id;
  const apiLeaderboardWsClient = new LeaderboardApiWs(ApiClientStomp.instance);
  const leaderboardSubscriptionRequest = {
    action: 'Unsubscribe',
    entityId: contestId,
    leaderboardFilter: {
      ranksAboveToInclude: 10,
      ranksBelowToInclude: 10,
      topRanksToInclude: 1
    }
  };
  await store.dispatch('leaderboardRequest');

  await apiLeaderboardWsClient.subscribeToLeaderboard(leaderboardSubscriptionRequest, (res) => {
    console.log('Unsubscribe EntityLeaderboard', res);
  });
};

const getOptInStatus = async () => {
  const optInApiWsClient = new OptInApiWs(ApiClientStomp.instance);

  const optInStateRequest = OptInStatesRequest.constructFromObject({
    optinStatesFilter: {
      entityTypes: ['Competition'],
      ids: ids,
      statusCodes: {
        gt: -5,
        lt: 40
      },
      skip: 0,
      limit: 10
    }
  }, null);

  await optInApiWsClient.optInStates(optInStateRequest, res => {
    console.warn('OPT-IN RES', res);
    if (res.data.length) {
      const status = res.data[0].status;
      const percentage = res.data[0].percentageComplete;

      tournamentItem.value.entrantStatus = status ? status : '';
      tournamentItem.value.percentageComplete = percentage ? percentage : 0;
    } else {
      tournamentItem.value.percentageComplete = 0;
      tournamentItem.value.entrantStatus = '';
    }

    store.dispatch('setCurrentTournamentAction', tournamentItem.value);
  });
};

const joinTournament= async () => {
  const optInApiWsClient = new OptInApiWs(ApiClientStomp.instance);

  const optInRequest = ManageOptinRequest.constructFromObject({
    entityId: route.params.id,
    entityType: 'Competition',
    action: 'join'
  }, null);

  await optInApiWsClient.manageOptin(optInRequest, (res) => {
    console.warn('JOIN RES', res.data);
    if (res.data) {
      const message = `You successfully joined the ${tournamentItem.value.name} tournament`;
      store.dispatch('setAlertMessage', message);

      const status = res.data[0].status;
      const percentage = res.data[0].percentageComplete;
      tournamentItem.value.entrantStatus = status;
      tournamentItem.value.percentageComplete = percentage ? percentage : 0;

      store.dispatch('setCurrentTournamentAction', tournamentItem.value);
    }
  })
}

const leaveTournament= async () => {
  const optInApiWsClient = new OptInApiWs(ApiClientStomp.instance);

  const optInRequest = ManageOptinRequest.constructFromObject({
    entityId: route.params.id,
    entityType: 'Competition',
    action: 'leave'
  }, null);

  await optInApiWsClient.manageOptin(optInRequest, (res) => {
    console.warn('LEAVE RES', res.data);
    if (res.data) {
      const message = `You successfully leaved the ${tournamentItem.value.name} tournament`;
      store.dispatch('setAlertMessage', message);

      const status = res.data[0].status;
      const percentage = res.data[0].percentageComplete;
      tournamentItem.value.entrantStatus = status;
      tournamentItem.value.percentageComplete = percentage ? percentage : 0;

      store.dispatch('setCurrentTournamentAction', tournamentItem.value);
    }
  })
}

onUnmounted(() => unsubscribeEntityLeaderboard());

</script>

<style lang="scss" scoped>
@import '../../assets/scss/utils/vars';

@media screen and (max-width: 1280px) {
  .tournament_card {
    width: 100%;
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