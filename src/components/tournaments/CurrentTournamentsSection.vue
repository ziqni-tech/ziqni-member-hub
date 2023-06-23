<template>
  <div class="section">
    <div class="tournaments-section-header">
      <h2 class="section-title">Current Tournaments</h2>
      <div v-if="!isDashboard" class="calendar-btn" @click="goToCalendar" title="Tournaments calendar">
        <img src="@/assets/icons/tournament/calendar.png" alt="">
      </div>
    </div>
    <Loader v-if="!isLoaded" :title="'Current Tournaments are loading'" />
    <div :class="isDashboard ? 'dashboard-cards-grid' : 'cards-grid'" v-else-if="competitions.length && isLoaded">
      <div v-for="c in competitions" class="card-wrapper">
        <Tournament :key="c.id" :card="c"/>
      </div>
    </div>
<!--    <button class="show-more-btn" v-if="competitions.length && isShowMore && !isDashboard" @click="loadMore">-->
<!--      Show More-->
<!--    </button>-->
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';

import Tournament from '@/components/tournaments/TournamentCard';
import Loader from '../Loader';
import { useStore } from 'vuex';
import {
  ApiClientStomp,
  CompetitionRequest,
  CompetitionsApiWs,
  EntityRequest,
  RewardsApiWs
} from '@ziqni-tech/member-api-client';
import { useRouter } from 'vue-router';

const props = defineProps({
  isDashboard: {
    type: Boolean,
    default: false
  }
});

const store = useStore();
const isLoaded = ref(true);
const router = useRouter();

const limit = ref(computed(() => props.isDashboard ? 3 : 20));

const isLoading = ref(false);
const competitions = ref([]);

const currentPage = ref(1);
const totalRecords = ref(0);
const totalPages = computed(() => Math.ceil(totalRecords.value / limit.value));
// const skip = computed(() => (currentPage.value - 1) * limit.value);

const tournamentsTotalRecords = computed(() => store.getters.getCurrentTournamentsTotalRecords);

const skip = ref(0);
const statusCode = {
  moreThan: 15,
  lessThan: 35
};

onMounted(() => {
  getCompetitionsRequest();
});

async function getCompetitionsRequest() {
  isLoaded.value = false;

  const competitionRequest = CompetitionRequest.constructFromObject({
    competitionFilter: {
      statusCode,
      sortBy: [{
        queryField: 'created',
        order: 'Desc'
      }],
      limit: limit.value,
      skip: skip.value,
      ids: []
    }
  }, null);

  try {
    const apiClientStomp = ApiClientStomp.instance;
    const competitionsApiWsClient = await new CompetitionsApiWs(apiClientStomp);

    await competitionsApiWsClient.getCompetitions(competitionRequest, async (res) => {
      const competitionsData = res.data;
      totalRecords.value = res.meta.totalRecordsFound
      // store.dispatch('setCurrentTournamentsTotalRecords', res.meta.totalRecordsFound);
      const compIds = competitionsData.map(item => item.id);

      const rewards = await getEntityRewards(compIds);

      for (const competition of competitionsData) {
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

      competitions.value = competitionsData;
      // await store.dispatch('setCurrentTournamentsAction', competitions);
      isLoaded.value = true;
    });
  } catch (e) {
    console.log('ERROR', e);
  }
}

const getEntityRewards = async (ids) => {
  const rewardsApiWsClient = await new RewardsApiWs(ApiClientStomp.instance);
  const rewardRequest = EntityRequest.constructFromObject({
    entityFilter: [
      {
        entityType: 'Competition',
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

const isShowMore = computed(() => competitions.value.length < tournamentsTotalRecords.value);

// const loadMore = async () => {
//   tournamentRequestData.skip = currentCompetitions.value.length;
//   await getCompetitionsHandler(tournamentRequestData.value);
// };

const goToCalendar = () => {
  router.push({name: 'Calendar'})
}

</script>

<style lang="scss">
.tournaments-section-header {
  display: flex;
  flex-direction: column;
  align-items: start;

  .calendar-btn {
    cursor: pointer;
    margin: 8px 0 10px;
  }
}
</style>