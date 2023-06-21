<template>
  <div class="section">
    <CNav variant="pills" layout="fill" class="achievements-tabs" v-if="!isDashboard">
      <CNavLink
          :active="activeTabKey === 'all'"
          @click="() => updateActiveTab('all')"
      >
        All
      </CNavLink>
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
      <CNavLink
          :active="activeTabKey === 'monthly'"
          @click="() => updateActiveTab('monthly')"
      >
        Monthly
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
    <div class="content-wrapper">
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
      <Pagination
          v-if="!isDashboard"
          :current-page="currentPage"
          :total-pages="totalPages"
          @pageChange="pageChange"
      />
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
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
import Pagination from '@/shared/components/Pagination.vue';

const store = useStore();

const props = defineProps({
  isDashboard: {
    type: Boolean,
    default: false
  }
});

const achievementsData = ref([]);
const limit = ref(computed(() => props.isDashboard ? 2 : 9));
const isLoading = ref(false);
const achievements = ref([]);
const activeTabKey = ref('all');

const currentPage = ref(1);
const totalRecords = ref(0);
const totalPages = computed(() => Math.ceil(totalRecords.value / limit.value));
const skip = computed(() => (currentPage.value - 1) * limit.value);

const descriptions = {
  daily: 'List of daily achievements that refresh every day.',
  weekly: 'List of weekly achievements that refresh every week.',
  all: 'List of all once and repeatedly achievements.',
  monthly: 'List of monthly achievements that refresh every month.',
};

const achievementsTitles = {
  daily: 'Daily achievements',
  weekly: 'Weekly achievements',
  all: 'All achievements',
  monthly: 'Monthly achievements',
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

const getAchievementsRequest = async () => {
  isLoading.value = true;
  const achievementsApiWsClient = new AchievementsApiWs(ApiClientStomp.instance);

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

  achievementsApiWsClient.getAchievements(achievementsRequest, (res) => {
    totalRecords.value = res.meta.totalRecordsFound
    // store.dispatch('setAchievementsTotalRecords', res.meta.totalRecordsFound);

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
        gt: -5,
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
    achievementsData.value = achievements.value
    store.dispatch('setAchievements', achievements.value);
  });
};

// if (!achievementsData.value.length) getAchievementsRequest();

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

const pageChange = async (pageNumber) => {
  currentPage.value = pageNumber;
  await getAchievementsRequest();
};

onMounted(() => {
  getAchievementsRequest();
})

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
  color: $text-color-white;

  & > img {
    margin-right: 8px;
  }

  @media screen and (max-width: $tableWidth) {
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;

    padding: 8px;
  }
}

.achievements-tabs {
  width: 400px;
  display: flex;
  align-items: center;
  background-color: $light-grey;
  border-radius: $border-radius;
  margin: 0 auto;

  @media screen and (max-width: $tableWidth) {
    width: 225px;
    margin-bottom: 20px;
  }
}

.nav-pills .nav-link {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-color-white;
  cursor: pointer;

  @media screen and (max-width: $tableWidth) {
    font-weight: 500;
    font-size: 10px;
    line-height: 12px;
  }
}

.nav-pills .nav-link.active {
  background: $btn-gradient-color;
}

.achievements-dashboard-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  grid-gap: 15px;

  @media screen and (max-width: $tableWidth) {
    grid-template-columns: repeat(1, 1fr);
    height: 100%;
  }
}

.achievements-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  height: 100%;
  grid-gap: 15px;
  margin-bottom: 30px;

  @media screen and (max-width: $tableWidth) {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>