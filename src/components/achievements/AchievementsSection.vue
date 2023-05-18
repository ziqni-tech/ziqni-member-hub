<template>
  <div class="section">
    <div class="section-header">
      <div>
        <h2 class="section-title">{{ sectionTitle }}</h2>
        <p v-if="!isDashboard" class="section-description">List of daily achievements that refresh every day.</p>
      </div>
<span>{{ countdownResult }}</span>
    </div>
    <div :class="isDashboard ? 'achievements-dashboard-cards-grid' : 'achievements-cards-grid'">
      <div v-for="achievement in achievementsData">
        <AchievementsCard :achievement="achievement" />
      </div>
    </div>
  </div>
</template>

<script setup>
import AchievementsCard from './AchievementsCard';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import {
  AchievementRequest,
  AchievementsApiWs,
  ApiClientStomp,
  OptInApiWs,
  OptInStatesRequest
} from '@ziqni-tech/member-api-client';

const props = defineProps({
  isDashboard: {
    type: Boolean,
    default: false
  }
});

const sectionTitle = props.isDashboard ? 'Achievements' : 'Daily achievements'
const store = useStore();

import { useCountdown } from '@/hooks/useCountdown';

const getNextDayStart = () => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  currentDate.setHours(0, 0, 0, 0);

  return currentDate;
};

const nextDayStart = getNextDayStart();

const countdownResult = useCountdown(nextDayStart, true);

const achievementsData = computed(() => {
  return props.isDashboard
      ? store.getters.getAchievements.slice(0, 2)
      : store.getters.getAchievements;
});
const totalRecords = computed(() => store.getters.getAchievementsTotal);

const limit = ref(20);
const skip = ref(0);
const isLoading = ref(false);
const achievements = ref([]);

const achievementsRequest = AchievementRequest.constructFromObject({
  achievementFilter: {
    productTagsFilter: [],
    ids: [],
    status: [],
    sortBy: [
      {
        queryField: 'created',
        order: 'Desc'
      },
    ],
    skip: skip.value,
    limit: limit.value,
    statusCode: {
      moreThan: 20,
      lessThan: 30
    },
    constraints: []
  },
}, null);

const getAchievementsRequest = async () => {
  isLoading.value = true;
  const achievementsApiWsClient = new AchievementsApiWs(ApiClientStomp.instance);

  await achievementsApiWsClient.getAchievements(achievementsRequest, (res) => {
    store.dispatch('setAchievementsTotalRecords', res.meta.totalRecordsFound);

    const ids = res.data.map(item => item.id);

    achievements.value = res.data;

    getOptInStatus(ids);
    isLoading.value = false;
  });
};

const getOptInStatus = async (ids) => {
  const optInApiWsClient = new OptInApiWs(ApiClientStomp.instance);

  const optInStateRequest = OptInStatesRequest.constructFromObject({
    optinStatesFilter: {
      entityTypes: ['Achievement'],
      ids: ids,
      statusCodes: {
        gt: 0,
        lt: 40
      },
      skip: 0,
      limit: 10
    }
  }, null);

  await optInApiWsClient.optInStates(optInStateRequest, res => {
    for (const achievement of achievements.value) {
      if (res.data.length) {
        const status = res.data.find(item => item.entityId === achievement.id)?.status;
        const percentage = res.data.find(item => item.entityId === achievement.id)?.percentageComplete;

        achievement.entrantStatus = status ? status : '';
        achievement.percentageComplete = percentage ? percentage : 0;
      } else {
        achievement.percentageComplete = 0;
        achievement.entrantStatus = '';
      }
    }
    store.dispatch('setAchievements', achievements.value);
  });
};

if (!achievementsData.value.length) getAchievementsRequest();
</script>

<style lang="scss">
.achievements-dashboard-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  grid-gap: 15px;
}

.achievements-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  grid-gap: 15px;
}
</style>