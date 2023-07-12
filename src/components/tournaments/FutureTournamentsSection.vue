<template>
  <div class="section">
    <div class="tournaments-section-header-wrapper">
      <div class="tournaments-section-header">
        <h2 class="section-title">Future Tournaments</h2>
        <div
            v-if="isSeeAll"
            class="see-all-btn"
            @click="seeAll">
          see all
        </div>
      </div>
      <div v-if="!isDashboard" class="calendar-btn" @click="goToCalendar" title="Tournaments calendar">
        <img src="@/assets/icons/tournament/calendar.svg" alt="">
      </div>
    </div>
    <Loader v-if="!isLoaded" :title="'Future Tournaments are loading'" />
    <div :class="isDashboard ? 'dashboard-cards-grid' : 'tournaments-cards-grid '" v-else-if="competitions.length && isLoaded">
      <div v-for="c in competitions" class="card-wrapper">
        <Tournament :key="c.id" :card="c"/>
      </div>
    </div>
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

const limit = ref(computed(() => props.isDashboard ? 3 : 4));

const isLoading = ref(false);
const competitions = ref([]);

const totalRecords = ref(0);

const statusCode = {
  moreThan: 5,
  lessThan: 25
};

onMounted(() => {
  getCompetitionsRequest();
});

const getCompetitionsRequest = async () => {
  isLoaded.value = false;

  const competitionRequest = CompetitionRequest.constructFromObject({
    competitionFilter: {
      statusCode,
      sortBy: [{
        queryField: 'created',
        order: 'Desc'
      }],
      limit: limit.value,
      skip: 0,
      ids: []
    }
  }, null);

  try {
    const apiClientStomp = ApiClientStomp.instance;
    const competitionsApiWsClient = await new CompetitionsApiWs(apiClientStomp);

    await competitionsApiWsClient.getCompetitions(competitionRequest, async (res) => {
      const competitionsData = res.data;

      totalRecords.value = res.meta.totalRecordsFound

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

const isSeeAll = computed(() => competitions.value.length < totalRecords.value);

const goToCalendar = () => {
  router.push({name: 'TournamentsCalendar'})
}

const seeAll = async () => {
  isLoaded.value = false;
  competitions.value = [];

  try {
    const apiClientStomp = ApiClientStomp.instance;
    const competitionsApiWsClient = await new CompetitionsApiWs(apiClientStomp);

    let totalFetched = 0;
    let moreDataAvailable = true;

    while (moreDataAvailable) {
      const competitionRequest = CompetitionRequest.constructFromObject({
        competitionFilter: {
          statusCode,
          sortBy: [{
            queryField: 'created',
            order: 'Desc'
          }],
          limit: 20, // Ограничиваем лимит до максимального значения 20
          skip: totalFetched,
          ids: []
        }
      }, null);

      const response = await new Promise((resolve, reject) => {
        competitionsApiWsClient.getCompetitions(competitionRequest, resolve, reject);
      });
      const competitionsData = response.data;

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

      competitions.value = [...competitions.value, ...competitionsData];
      totalFetched += competitionsData.length;

      if (totalFetched >= response.meta.totalRecordsFound || totalFetched >= limit.value) {
        moreDataAvailable = false;
      }
    }

    isLoaded.value = true;
  } catch (e) {
    console.log('ERROR', e);
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/_variables";
.tournaments-section-header-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;

  .tournaments-section-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .see-all-btn {
      font-size: 16px;
      font-family: $semi-bold;
      color: $text-color-white;
      cursor: pointer;
    }
  }

  .calendar-btn {
    cursor: pointer;
    margin: 8px 0 10px;
    border-color: $btn-border-grey;
    width: 40px;
    height: 40px;

    > img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>