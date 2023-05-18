<template>
  <div class="section">
    <div class="section-header">
      <div>
        <h2 class="section-title">{{ sectionTitle }}</h2>
        <p v-if="!isDashboard" class="section-description">List of daily achievements that refresh every day.</p>
      </div>
      <div class="until-the-next-day">
        <img :src="expiresInIcon" alt="">
        {{ countdownResult }} left
      </div>
    </div>
    <div :class="isDashboard ? 'achievements-dashboard-cards-grid' : 'achievements-cards-grid'">
      <div v-for="achievement in achievementsData" :key="achievement.id">
        <AchievementsCard
          :key="achievement.id"
          :achievement="achievement"
          @joinAchievement="joinAchievement"
          @leaveAchievement="leaveAchievement"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import {
  AchievementRequest,
  AchievementsApiWs,
  ApiClientStomp,
  ManageOptinRequest,
  OptInApiWs,
  OptInStatesRequest
} from '@ziqni-tech/member-api-client';

import { useCountdown } from '@/hooks/useCountdown';
import AchievementsCard from './AchievementsCard';
import expiresInIcon from '@/assets/icons/tournament/expires-in.png';

const store = useStore();

const props = defineProps({
  isDashboard: {
    type: Boolean,
    default: false
  }
});

const achievementsData = ref([]);
const limit = ref(20);
const skip = ref(0);
const isLoading = ref(false);
const achievements = ref([]);

const sectionTitle = props.isDashboard ? 'Achievements' : 'Daily achievements';

const getNextDayStart = () => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  currentDate.setHours(0, 0, 0, 0);

  return currentDate;
};

const nextDayStart = getNextDayStart();

const countdownResult = useCountdown(nextDayStart, true);

watch(() => store.getters.getAchievements, (newValue) => {
  achievementsData.value = props.isDashboard
    ? newValue.slice(0, 2)
    : newValue;
}, { immediate: true });

const totalRecords = computed(() => store.getters.getAchievementsTotal);

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

  achievementsApiWsClient.getAchievements(achievementsRequest, (res) => {
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

const joinAchievement = async ({ id, name }) => {
  const optInApiWsClient = new OptInApiWs(ApiClientStomp.instance);

  const optInRequest = ManageOptinRequest.constructFromObject({
    entityId: id,
    entityType: 'Achievement',
    action: 'join'
  }, null);

  await optInApiWsClient.manageOptin(optInRequest, (res) => {
    if (res.data) {
      const message = `You successfully joined the ${ name } tournament`;
      store.dispatch('setAlertMessage', message);

      setTimeout(async () => {
        await getAchievementsRequest();
      }, 5000);
    }
  });
};

const leaveAchievement = async ({ id, name }) => {
  const optInApiWsClient = new OptInApiWs(ApiClientStomp.instance);

  const optInRequest = ManageOptinRequest.constructFromObject({
    entityId: id,
    entityType: 'Achievement',
    action: 'leave'
  }, null);

  await optInApiWsClient.manageOptin(optInRequest, (res) => {
    if (res.data) {
      const message = `You successfully leaved the ${ name } tournament`;
      store.dispatch('setAlertMessage', message);

      setTimeout(async () => {
        await getAchievementsRequest();
      }, 5000);
    }
  });
};

</script>

<style lang="scss">
@import '@/assets/scss/_variables';

.until-the-next-day {
  background-color: $light-grey;
  border-radius: $border-radius;
  padding: 12px 30px;

  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: $main-text-color-white;

  & > img {
    margin-right: 8px;
  }
}

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