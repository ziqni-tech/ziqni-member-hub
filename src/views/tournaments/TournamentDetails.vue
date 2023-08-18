<template>
  <Loader v-if="!currentTournament" :title="'Loading'" />
  <div v-else  class="tournament-details" :class="{'light-mode': !isDarkMode}">
    <div class="leaderboard-section">
      <div class="leaderboard-section_header">
        <h1 class="section-title">{{ contest.name }}</h1>
      </div>
      <div class="leaderboard-table" v-if="leaderboardEntries">
        <Leaderboard
            :leaders="leaderboardEntries"
            :prize="contest && contest.rewardValue ? contest.rewardValue : 0"
            :isDarkMode="isDarkMode"
        />
      </div>
    </div>
    <div class="details">
      <TournamentDetailsCard
        v-if="isLoaded"
        :tournament="contest"
        @joinTournament="joinTournament"
        @leaveTournament="leaveTournament"
        :isDarkMode="isDarkMode"
      />
    </div>
  </div>

</template>

<script setup>
import Leaderboard from '../../components/tournaments/LeaderboardTable.vue';
import TournamentDetailsCard from '../../components/tournaments/TournamentDetailsCard';
import { onUnmounted, ref, onMounted, computed, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Loader from '../../components/Loader';
import {
  ApiClientStomp, CompetitionRequest, CompetitionsApiWs, ContestRequest, ContestsApiWs, EntityRequest, FilesApiWs,
  LeaderboardApiWs,
  ManageOptinRequest,
  OptInApiWs,
  OptInStatesRequest, RewardsApiWs
} from '@ziqni-tech/member-api-client';

const router = useRouter()

const route = useRoute();
const ids = [route.params.id];
const statusCode = {
  moreThan: 5,
  lessThan: 100
};

const store = useStore();
const contests = ref(null);
const contest = ref(null);
const isLoaded = ref(false)
const leaderboardEntries = ref([]);
const tournaments = ref(null)
const currentTournament = ref(null);
const isDarkMode = computed(() => store.getters.getTheme);
const tournamentRequestData = {
  statusCode,
  limit: 1,
  skip: 0,
  ids
};

onBeforeMount(async () => {
  ApiClientStomp.instance.client.debug = () => {};
  await ApiClientStomp.instance.connect({ token: localStorage.getItem('token') });
  await store.dispatch('setIsConnectedClient', true);
});

const defLeaders = [];
for (let i = 0; i < 14; i++) {
  const rank = i + 1;
  defLeaders.push({
    'rank': rank,
    'score': 0,
    'bestScores': [],
    'members': [
      {
        'name': '--',
        'memberId': '--',
        'memberRefId': '--',
        'rankChangeFrom': null,
        'rankChangeType': 0,
        'params': {},
        'goalReached': false
      }
    ]
  });
}

onMounted(async () => {
  await getCompetition()
  await getEntityContests()
})

const getCompetition = async () => {
  try {
    const competitionsApiWsClient = new CompetitionsApiWs(ApiClientStomp.instance);
    const { statusCode, limit, skip, ids } = tournamentRequestData;

    const competitionRequest = CompetitionRequest.constructFromObject({
      competitionFilter: {
        statusCode,
        sortBy: [{
          queryField: 'created',
          order: 'Desc'
        }],
        limit,
        skip,
        ids
      }
    }, null);

    await competitionsApiWsClient.getCompetitions(competitionRequest, async (res) => {
      const competitions = res.data;

      const competitionsIds = competitions.map(item => item.id);

      const rewards = await getEntityRewards('Competition', competitionsIds);

      for (const competition of competitions) {
        if (rewards.length) {
          let maxReward = null;
          for (const reward of rewards) {
            if (reward.entityId === competition.id) {
              if (!maxReward || reward.rewardValue > maxReward.rewardValue) {
                maxReward = reward;
              }
            }
          }
          if (maxReward) {
            competition.rewardValue = maxReward.rewardValue;
            competition.rewardType = maxReward.rewardType.key;
          }
        } else {
          competition.rewardValue = null;
          competition.rewardType = '';
        }
      }

      tournaments.value = competitions;

      await getOptInStatus();

      isLoaded.value = true;
    });
  } catch (err) {
    console.log(err);
  }
}

const getEntityContests = async () => {
  const contestApiWsClient = new ContestsApiWs(ApiClientStomp.instance);
  const contestRequest = ContestRequest.constructFromObject({
    contestFilter: {
      productIds: [],
      tags: [],
      startDate: null,
      endDate: null,
      ids: [],
      limit: 20,
      competitionIds: ids,
      constraints: [],
      statusCode: {
        moreThan: 10,
        lessThan: 100
      },
    }
  }, null);

  await contestApiWsClient.getContests(contestRequest, async (res) => {
    if (res.data && res.data.length) {
      const contests = res.data;
      const contestIds = contests.map(item => item.id);

      const rewards = await getEntityRewards('Contest', contestIds)

      for (const contest of contests) {
        if (res.data.length) {
          let maxReward = null;
          for (const reward of rewards) {
            if (reward.entityId === contest.id) {
              if (!maxReward || reward.rewardValue > maxReward.rewardValue) {
                maxReward = reward;
              }
            }
          }
          if (maxReward) {
            contest.rewardValue = maxReward.rewardValue;
            contest.rewardType = maxReward.rewardType.key;
            // if (maxReward.icon) {
            //   contest.icon = await getRewardIcon(maxReward.icon);
            // }
          }
        }
      }

      // const activeContests = contests.filter(contest => contest.status === 'Active');
      const activeContests = contests.filter(contest => contest.id === route.params.contestId);

      contest.value = activeContests[0];

      if (contest.value && contest.value.status === 'Active') {
        await getEntityLeaderboard(route.params.contestId);
      } else {
        leaderboardEntries.value = defLeaders;
      }
    } else {
      leaderboardEntries.value = defLeaders;
      console.warn('This competition has no contests');
    }

  })
}

const getRewardIcon = async (id) => {
  const fileApiWsClient = new FilesApiWs(ApiClientStomp.instance);

  const fileRequest = {
    ids: [id],
    limit: 1,
    skip: 0
  };

  return new Promise((resolve) => {
    fileApiWsClient.getFiles(fileRequest, (res) => {
      resolve(res.data[0].uri);
    });
  });
}

const getEntityLeaderboard = async (contestId) => {
  const apiLeaderboardWsClient = new LeaderboardApiWs(ApiClientStomp.instance);
  const leaderboardSubscriptionRequest = {
    action: 'Subscribe',
    entityId: contestId,
    leaderboardFilter: {
      ranksAboveToInclude: 10,
      ranksBelowToInclude: 10,
      topRanksToInclude: 10
    }
  };

  ApiClientStomp.instance.sendSys('', {}, (json, headers) => {
    if (headers && headers.objectType === 'Leaderboard') {
      if (json.id && json.id === contestId) {
        leaderboardEntries.value = json.leaderboardEntries && json.leaderboardEntries.length ? json.leaderboardEntries : defLeaders;
      }
    }
  })

  await apiLeaderboardWsClient.subscribeToLeaderboard(leaderboardSubscriptionRequest, (res) => {
    leaderboardEntries.value = res.data.leaderboardEntries && res.data.leaderboardEntries.length ? res.data.leaderboardEntries : defLeaders;
  });
}

const unsubscribeEntityLeaderboard = async () => {
  if (contest.value) {
    try {
      const contestId = contest.value.id;

      const apiLeaderboardWsClient = new LeaderboardApiWs(ApiClientStomp.instance);

      const leaderboardSubscriptionRequest = {
        action: 'Unsubscribe',
        entityId: contestId,
        leaderboardFilter: {
          ranksAboveToInclude: 10,
          ranksBelowToInclude: 10,
          topRanksToInclude: 10
        }
      };

      await apiLeaderboardWsClient.subscribeToLeaderboard(leaderboardSubscriptionRequest, () => {});
    } catch (err) {
      console.log('Unsubscribe Leaderboard error', err)
    }
  }
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
    for (const tournament of tournaments.value) {
      if (res.data.length) {
        const status = res.data.find(item => item.entityId === tournament.id)?.status;
        const percentage = res.data.find(item => item.entityId === tournament.id)?.percentageComplete;

        tournament.entrantStatus = status ? status : '';
        tournament.percentageComplete = percentage ? percentage : 0;
      } else {
        tournament.percentageComplete = 0;
        tournament.entrantStatus = '';
      }
    }
    currentTournament.value = tournaments.value[0];
  });
};

const getEntityRewards = async (entityType, ids) => {
  const rewardsApiWsClient = await new RewardsApiWs(ApiClientStomp.instance);

  const rewardRequest = EntityRequest.constructFromObject({
    entityFilter: [
      {
        entityType: entityType,
        entityIds: ids
      },
    ],
    skip: 0,
    limit: 20,
    languageKey: ''
  }, null);

  return new Promise((resolve) => {
    rewardsApiWsClient.getRewards(rewardRequest, async (res) => {
      resolve(res.data);
    });
  });
}

const joinTournament = async () => {
  const optInApiWsClient = new OptInApiWs(ApiClientStomp.instance);

  const optInRequest = ManageOptinRequest.constructFromObject({
    entityId: route.params.id,
    entityType: 'Competition',
    action: 'join'
  }, null);

  await optInApiWsClient.manageOptin(optInRequest, async (res) => {
    if (res.data) {
      // const message = `You successfully joined the ${currentTournament.value.name} tournament`;
      // store.dispatch('setAlertMessage', message);

      setTimeout(async () => {
        await getCompetition();
      }, 3500);
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

  await optInApiWsClient.manageOptin(optInRequest, async (res) => {
    if (res.data) {
      // const message = `You successfully leaved the ${currentTournament.value.name} tournament`;
      // store.dispatch('setAlertMessage', message);

      setTimeout(async () => {
        await getCompetition();
      }, 3500);
    }
  })
}

onUnmounted(() => unsubscribeEntityLeaderboard());

const goToCalendar = () => {
  router.push({name: 'TournamentsCalendar'})
}

</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables';

@media screen and (max-width: 1280px) {
  .tournament_card {
    width: 100%;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;

  .calendar-btn {
    cursor: pointer;
    border: 1px solid $btn-border-grey;
  }
}

.tournament-details {
  display: grid;
  grid-template-columns: 64% 36%;
  width: 100%;
  height: 100%;

  .tournament-details-mobile-header {
    display: none;
  }

  .details {
    width: 100%;
    height: 100%;
  }

  .leaderboard-section {
    display: flex;
    flex-direction: column;
    padding: 0 20px;

    &_header {
      width: 95%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 0;

      .section-title {
        font-size: 24px;
        font-family: $bold;
        color: $white-color-DM;
      }
    }

    .leaderboard-table {
      display: flex;
      width: 100%;
      border: 1px solid $border-color-DM;
      border-radius: 10px;
      overflow: hidden;
    }
  }

  &.light-mode {
    .leaderboard-section {
      display: flex;
      flex-direction: column;
      padding-right: 20px;

      &_header {
        width: 95%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 0;

        .section-title {
          font-size: 24px;
          font-family: $bold;
          color: $section-title-color-LM;
        }
      }

      .leaderboard-table {
        display: flex;
        width: 100%;
        border: 1px solid $main-border-color-LM;
        border-radius: 10px;
        overflow: hidden;
      }
    }
  }
}

@media screen and (max-width: $tableWidth) {
  .tournament-details {
    display: flex;
    flex-direction: column;
    align-items: center;

    .details {
      width: 100%;
      padding-right: 0;
    }

    .leaderboard-section {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding-bottom: 30px;
      padding-right: 0;
      padding-left: 0;

      &_header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 0;

        .section-title {
          font-size: 14px;
          font-family: $bold;
          color: $text-color-white;
        }
      }

      .leaderboard-table {
        width: 100%;
      }
    }

    &.light-mode {
      .leaderboard-section {
        display: flex;
        flex-direction: column;
        padding-right: 0;
        padding-left: 0;

        &_header {
          width: 95%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;

          .section-title {
            font-size: 14px;
            font-family: $bold;
            color: $section-title-color-LM;
          }
        }

        .leaderboard-table {
          display: flex;
          width: 100%;
          border: 1px solid $main-border-color-LM;
          border-radius: 10px;
          overflow: hidden;
        }
      }
    }
  }
}
</style>