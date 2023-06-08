<template>
  <div class="section">
    <CNav variant="pills" layout="fill" class="achievements-tabs" v-if="!isDashboard">
      <CNavLink
          :active="activeTabKey === 'daily'"
          @click="() => updateActiveTab('daily')"
      >
        Daily
      </CNavLink>
      <CNavLink
          :active="activeTabKey === 'weekly'"
          @click="() => updateActiveTab('weekly')"
      >
        Weekly
      </CNavLink>
    </CNav>
    <div class="section-header">
      <div>
        <h2 class="section-title">
          {{ isDashboard ? 'Achievements' : achievementsTitles[activeTabKey] }}
        </h2>
        <p v-if="!isDashboard" class="section-description">
          {{ descriptions[activeTabKey] }}
        </p>
      </div>
      <div class="until-the-next-day" v-if="!isDashboard">
        <img :src="expiresInIcon" alt="">
        {{ activeTabKey === 'daily' ? dailyTimeLeft : weeklyTimeLeft }} left
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
import { CNav, CNavLink } from '@coreui/vue';

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
const activeTabKey = ref('daily');

const descriptions = {
  daily: 'List of daily achievements that refresh every day.',
  weekly: 'List of weekly achievements that refresh every week.'
};

const achievementsTitles = {
  daily: 'Daily achievements',
  weekly: 'Weekly achievements'
};

const updateActiveTab = (val) => {
  activeTabKey.value = val;
};

// daily
const dailyTimeLeft = ref('');

const getNextDayStart = () => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  currentDate.setHours(0, 0, 0, 0);

  return currentDate;
};

const nextDayStart = getNextDayStart();
const dailyCountdownResult = useCountdown(nextDayStart);

watch(dailyCountdownResult, value => {
  if (value) {
    const { hours, minutes } = dailyCountdownResult;
    return dailyTimeLeft.value = `${ hours }h ${ minutes }m`;
  }

}, { immediate: true });

// weekly
const weeklyTimeLeft = ref('');

const getNextWeekStart = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  const daysToNextMonday = 8 - dayOfWeek;

  startOfWeek.setDate(now.getDate() + daysToNextMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  return startOfWeek;
};

const nextWeekStart = getNextWeekStart();
const weeklyCountdownResult = useCountdown(nextWeekStart);

watch(weeklyCountdownResult, value => {
  if (value) {
    const { days, hours, minutes } = weeklyCountdownResult;
    weeklyTimeLeft.value = `${ days }d ${ hours }h ${ minutes }m`;
  }

}, { immediate: true });


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

.achievements-tabs {
  width: 400px;
  display: flex;
  align-items: center;
  background-color: $light-grey;
  border-radius: $border-radius;
  margin: 0 auto;
}

.nav-pills .nav-link {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $main-text-color-white;
  cursor: pointer;
}

.nav-pills .nav-link.active {
  background-color: $purple;
}

.achievements-dashboard-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  grid-gap: 15px;

  @media screen and (max-width: $tableWidth) {
    grid-template-columns: repeat(1, 1fr);
  }
}

.achievements-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  grid-gap: 15px;

  @media screen and (max-width: $tableWidth) {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>