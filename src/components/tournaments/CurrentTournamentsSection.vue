<template>
  <div class="section" :class="{'light-mode': !isDarkMode, 'dashboard': isDashboard}">
    <div class="tournaments-section-header-wrapper">
      <div class="tournaments-section-header">
        <h2 class="section-title">Current Tournaments</h2>
        <div
            v-if="isSeeAll"
            class="see-all-btn"
            @click="seeAll">
          see all
        </div>
        <div
            v-if="!isSeeAll && competitions.length > limit"
            class="see-all-btn"
            @click="seeOriginalView"
        >
          original view
        </div>
      </div>

      <div v-if="!isDashboard" class="calendar-btn" @click="goToCalendar" title="Tournaments calendar">
        <CalendarIcon :strokeColor="getIconStrokeColor()" :width="'35'" :height="'35'" />
      </div>
    </div>
    <Loader v-if="!isLoaded" :title="'Current Tournaments are loading'" />
    <div :class="isDashboard ? 'dashboard-cards-grid' : 'tournaments-cards-grid '" v-else-if="competitions.length && isLoaded">
      <div v-for="c in competitions" class="card-wrapper">
        <Tournament
            :key="c.id"
            :card="c"
            :is-dark-mode="isDarkMode"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, ref } from 'vue';

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
import CalendarIcon from "@/shared/components/svg-icons/CalendarIcon.vue";
import cardImage1 from '@/assets/images/tournaments/tournament_1.svg';
import cardImage2 from '@/assets/images/tournaments/tournament_2.svg';
import cardImage3 from '@/assets/images/tournaments/tournament_3.svg';
import cardImage4 from '@/assets/images/tournaments/tournament_4.svg';
const images = [
  cardImage1,
  cardImage2,
  cardImage3,
  cardImage4
]

const props = defineProps({
  isDashboard: {
    type: Boolean,
    default: false
  }
});

const store = useStore();
const isLoaded = ref(true);
const router = useRouter();

const isDarkMode = computed(() => store.getters.getTheme);

const getIconStrokeColor = () => {
  return isDarkMode.value ? '#FFFFFF' : '#080D12'
};
const limit = ref(computed(() => props.isDashboard ? 3 : 4));

const isLoading = ref(false);
const competitions = ref([]);

const currentPage = ref(1);
const totalRecords = ref(0);

const statusCode = {
  moreThan: 20,
  lessThan: 30
};

onBeforeMount(async () => {
  ApiClientStomp.instance.client.debug = () => {};
  await ApiClientStomp.instance.connect({ token: localStorage.getItem('token') });
  await store.dispatch('setIsConnectedClient', true);
});

onMounted(() => {
  getCompetitionsRequest();
});
const seeOriginalView = () => {
  getCompetitionsRequest()
}
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

      competitions.value = competitionsData.map((competition, index) => {
        const image = images[index % images.length]
        return {
          ...competition,
          image
        }
      });

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
  competitions.value = []; // Resetting the current competition data

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
          limit: 20,
          skip: totalFetched,
          ids: []
        }
      }, null);

      const response = await new Promise((resolve, reject) => {
        competitionsApiWsClient.getCompetitions(competitionRequest, resolve, reject);
      });

      const competitionsData = response.data.map((competition, index) => {
        const image = images[index % images.length];
        return {
          ...competition,
          image
        };
      });

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
        moreDataAvailable = false; // Terminate the loop if limits are reached
      }
    }

    isLoaded.value = true;
  } catch (e) {
    console.log('ERROR', e);
  }
}

const pageChange = async (pageNumber) => {
  currentPage.value = pageNumber;
  await getCompetitionsRequest();
};

</script>

<style scoped lang="scss">
@import "@/assets/scss/_variables";

.section {
  padding: 20px 16px 20px 20px;
  min-height: 400px;

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

  &.light-mode {
    .tournaments-section-header-wrapper {
      .tournaments-section-header {
        .section-title {
          color: $section-title-color-LM;
        }
        .see-all-btn {
          font-size: 16px;
          font-family: $semi-bold;
          color: $btn-secondary-color-LM;
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
  }
}

.section.dashboard {
  padding: 20px 0;
}

@media screen and (max-width: 820px) {
  .section {
    padding: 0;

    .tournaments-section-header-wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: start;
      padding-top: 15px;

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
  }
}
</style>