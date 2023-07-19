<template>
  <div class="section" :class="{'light-mode': !isDarkMode}">
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
      <div class="until-the-next-day" v-if="!isDashboard && activeTabKey === 'daily'">
        <img :src="expiresInIcon" alt="">
        {{ dailyTimeLeft }} left
      </div>
      <div class="until-the-next-day" v-if="!isDashboard && activeTabKey === 'weekly'">
        <img :src="expiresInIcon" alt="">
        {{ remainingTimeUntilEndOfWeek }} left
      </div>
      <div class="until-the-next-day" v-if="!isDashboard && activeTabKey === 'monthly'">
        <img :src="expiresInIcon" alt="">
        {{ remainingTimeUntilEndOfMonth }} left
      </div>
    </div>
    <div class="content-wrapper">
      <div class="spinner-wrapper-global" v-if="isLoading">
        <CSpinner grow size="sm"/>
      </div>
      <div :class="isDashboard ? 'achievements-dashboard-cards-grid' : 'achievements-cards-grid'">
        <div v-for="achievement in achievementsData" :key="achievement.id">
          <AchievementsCard
              :key="achievement.id"
              :achievement="achievement"
              @joinAchievement="joinAchievement"
              @leaveAchievement="leaveAchievement"
              :isDarkMode="isDarkMode"
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
  EntityRequest,
  ManageOptinRequest,
  OptInApiWs,
  OptInStatesRequest,
  RewardsApiWs
} from '@ziqni-tech/member-api-client';
import { CNav, CNavLink, CSpinner } from '@coreui/vue';

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

const isDarkMode = computed(() => store.getters.getTheme);

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

const remainingTimeUntilEndOfMonth = ref('');

const getRemainingTimeUntilEndOfMonth = () => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const nextMonth = currentMonth + 1;
  const nextMonthFirstDay = new Date(now.getFullYear(), nextMonth, 1);
  const endOfMonth = new Date(nextMonthFirstDay - 1);

  const remainingTime = endOfMonth.getTime() - now.getTime();
  const remainingDays = Math.floor(remainingTime / (1000 * 3600 * 24));
  const remainingHours = Math.floor((remainingTime % (1000 * 3600 * 24)) / (1000 * 3600));
  const remainingMinutes = Math.floor((remainingTime % (1000 * 3600)) / (1000 * 60));
  const remainingSeconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

  return {
    remainingDays,
    remainingHours,
    remainingMinutes,
    remainingSeconds,
  };
};

const updateRemainingTimeUntilEndOfMonth = () => {
  const { remainingDays, remainingHours, remainingMinutes } = getRemainingTimeUntilEndOfMonth();
  remainingTimeUntilEndOfMonth.value = `${remainingDays}d ${remainingHours}h ${remainingMinutes}m`;
};


onMounted(() => {
  updateRemainingTimeUntilEndOfMonth();
  ApiClientStomp.instance.sendSys('', {}, async (json, headers) => {
    if (json && json.entityType === 'Achievement') {
      await getAchievementsRequest();
    }
  })
});
watch(activeTabKey, (newValue) => {
  if (newValue === 'monthly') {
    updateRemainingTimeUntilEndOfMonth();
  }
});

watch(dailyCountdownResult, value => {
  if (value) {
    const { hours, minutes } = dailyCountdownResult;
    return dailyTimeLeft.value = `${ hours }h ${ minutes }m`;
  }

}, { immediate: true });

const remainingTimeUntilEndOfWeek = ref('');

const getRemainingTimeUntilEndOfWeek = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysToNextMonday = 8 - dayOfWeek;
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + daysToNextMonday);
  endOfWeek.setHours(23, 59, 59, 999); // Устанавливаем время на конец дня

  const remainingTime = endOfWeek.getTime() - now.getTime();
  const remainingSeconds = Math.floor(remainingTime / 1000) % 60;
  const remainingMinutes = Math.floor(remainingTime / 1000 / 60) % 60;
  const remainingHours = Math.floor(remainingTime / 1000 / 60 / 60) % 24;
  const remainingDays = Math.floor(remainingTime / 1000 / 60 / 60 / 24);

  return {
    remainingDays,
    remainingHours,
    remainingMinutes,
    remainingSeconds
  };
};

const updateRemainingTimeUntilEndOfWeek = () => {
  const { remainingDays, remainingHours, remainingMinutes, remainingSeconds } = getRemainingTimeUntilEndOfWeek();
  remainingTimeUntilEndOfWeek.value = `${remainingDays}d ${remainingHours}h ${remainingMinutes}m`;
};

onMounted(updateRemainingTimeUntilEndOfWeek);
watch(activeTabKey, (newValue) => {
  if (newValue === 'weekly') {
    updateRemainingTimeUntilEndOfWeek();
  }
});

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
    const ids = res.data.map(item => item.id);

    achievements.value = res.data;

    getOptInStatus(ids);
    getEntityRewards(ids);
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
      limit: limit.value
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
    achievementsData.value = achievements.value;
    store.dispatch('setAchievements', achievements.value);
  });
};

const getEntityRewards = async (ids) => {
  const rewardsApiWsClient = await new RewardsApiWs(ApiClientStomp.instance);

  const rewardRequest = EntityRequest.constructFromObject({
    entityFilter: [
      {
        entityType: 'Achievement',
        entityIds: ids
      },
    ],
    skip: 0,
    limit: limit.value
  }, null);

  await rewardsApiWsClient.getRewards(rewardRequest, async (res) => {
    for (const achievement of achievements.value) {
      if (res.data.length) {
        let maxReward = null;
        for (const reward of res.data) {
          if (reward.entityId === achievement.id) {
            if (!maxReward || reward.rewardValue > maxReward.rewardValue) {
              maxReward = reward;
            }
          }
        }
        if (maxReward) {
          achievement.rewardValue = maxReward.rewardValue;
          achievement.rewardType = maxReward.rewardType.key;
          achievement.rewardIconLink = maxReward.iconLink;
        }
      }
    }
  });
}

const joinAchievement = async ({ id, name }) => {
  const optInApiWsClient = new OptInApiWs(ApiClientStomp.instance);

  isLoading.value = true;

  const optInRequest = ManageOptinRequest.constructFromObject({
    entityId: id,
    entityType: 'Achievement',
    action: 'join'
  }, null);

  await optInApiWsClient.manageOptin(optInRequest, async () => {
    setTimeout(async function () {
      await getAchievementsRequest();
      isLoading.value = false;
    }, 2000);
  });
};

const leaveAchievement = async ({ id, name }) => {
  const optInApiWsClient = new OptInApiWs(ApiClientStomp.instance);

  isLoading.value = true;

  const optInRequest = ManageOptinRequest.constructFromObject({
    entityId: id,
    entityType: 'Achievement',
    action: 'leave'
  }, null);

  await optInApiWsClient.manageOptin(optInRequest, async () => {
    setTimeout(async function () {
      await getAchievementsRequest();
      isLoading.value = false;
    }, 2000);
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

  font-family: $semi-bold;
  font-size: 16px;
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

  @media screen and (max-width: 480px) {
    margin-bottom: 20px;
  }

  @media screen and (max-width: 380px) {
    width: 280px;
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
  text-transform: capitalize;

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

  @media screen and (max-width: 915px) {
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