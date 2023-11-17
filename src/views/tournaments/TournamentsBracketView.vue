<template>
  <Loader v-if="!currentTournament" :title="'Loading'" />
  <div v-else class="tournaments-bracket-view">
    <TournamentsBracket class="bracket-view" :key="rerenderBracket" />
    <div class="details">
      <TournamentDetailsCard
          v-if="isLoaded"
          :tournament="currentTournament"
          :isDarkMode="isDarkMode"
          :key="updateKey"
          @joinTournament="joinTournament"
          @leaveTournament="leaveTournament"
      />
    </div>
  </div>
</template>

<script setup>

import TournamentsBracket from '@/components/tournaments/TournamentsBracket.vue';
import TournamentDetailsCard from '@/components/tournaments/TournamentDetailsCard.vue';
import {
  ApiClientStomp,
  CompetitionRequest,
  CompetitionsApiWs,
  EntityRequest, ManageOptinRequest, OptInApiWs, OptInStatesRequest,
  RewardsApiWs
} from '@ziqni-tech/member-api-client';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Loader from '@/components/Loader.vue';

const router = useRouter()

const route = useRoute();
const ids = [route.params.id];
const statusCode = {
  moreThan: 5,
  lessThan: 100
};

const store = useStore();
const isLoaded = ref(false)
const tournaments = ref(null)
const currentTournament = ref(null);
const isDarkMode = computed(() => store.getters.getTheme);
const tournamentRequestData = {
  statusCode,
  limit: 1,
  skip: 0,
  ids
};
const updateKey = ref(0);
const rerenderBracket = ref(0);

watch(isDarkMode, (newVal) => {
  rerenderBracket.value++
})


onMounted(async () => {
  await getCompetition()
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
      const rewards = await getEntityRewards('Competition', ids);

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

const joinTournament = async () => {
  const optInApiWsClient = new OptInApiWs(ApiClientStomp.instance);

  const optInRequest = ManageOptinRequest.constructFromObject({
    entityId: route.params.id,
    entityType: 'Competition',
    action: 'join'
  }, null);

  await optInApiWsClient.manageOptin(optInRequest, async (res) => {
    if (res.data) {
      setTimeout(async () => {
        await getCompetition();
        updateKey.value++
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
      setTimeout(async () => {
        await getCompetition();
        updateKey.value++
      }, 3500);
    }
  })
}

</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables';

.tournaments-bracket-view {
  display: grid;
  grid-template-columns: 70% 30%;
  width: 100%;
  height: 100%;

  .details {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
@media screen and (max-width: $tableWidth) {
  .tournaments-bracket-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      width: 0;
    }

    .bracket-view {
      min-height: 300px;
      order: 2;
    }

    .details {
      height: auto;
      width: 100%;
      padding-right: 0;
      order: 1;
    }
  }
}
</style>