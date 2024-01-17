<template>
  <div class="section" :class="{'light-mode': !isDarkMode}">
    <div class="section-header">
      <div>
        <h2 class="section-title">
          {{ achievementsTitles['weekly'] }}
        </h2>
        <p class="section-description" :class="{'light-mode': !isDarkMode}">
          {{ descriptions['weekly'] }}
        </p>
      </div>
      <div class="until-the-next-day">
        <img :src="expiresInIcon" alt="">
        {{ remainingTimeUntilEndOfWeek }} left
      </div>
    </div>
    <div class="content-wrapper">
      <Loader v-if="isLoading"   class="loading" :title="'Achievements are loading'"/>
      <div v-if="!isLoading " :class="'achievements-cards-grid'">
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
          v-if="!isLoading"
          :current-page="currentPage"
          :total-pages="totalPages"
          @pageChange="pageChange"
      />
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import {
  AchievementsApiWs,
  ApiClientStomp,
  EntityRequest,
  ManageOptinRequest,
  OptInApiWs,
  OptInStatesRequest,
  RewardsApiWs
} from '@ziqni-tech/member-api-client';

import AchievementsCard from './AchievementsCard';
import expiresInIcon from '@/assets/icons/tournament/expires-in.png';
import Pagination from '@/shared/components/Pagination.vue';
import Loader from '@/components/Loader.vue';

const store = useStore();

const isDarkMode = computed(() => store.getters.getTheme);

const achievementsData = ref([]);
const limit = ref(9);
const isLoading = ref(false);
const achievements = ref([]);

const currentPage = computed(() => store.getters.getCurrentPage);
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

const remainingTimeUntilEndOfWeek = ref('');

const getRemainingTimeUntilEndOfWeek = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysToNextMonday = 8 - dayOfWeek;
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + daysToNextMonday);
  endOfWeek.setHours(23, 59, 59, 999);

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
  remainingTimeUntilEndOfWeek.value = `${ remainingDays }d ${ remainingHours }h ${ remainingMinutes }m`;
};

onMounted(updateRemainingTimeUntilEndOfWeek);

const getAchievementsRequest = async () => {
  try {
    isLoading.value = true;

    const achievementsApiWsClient = new AchievementsApiWs(ApiClientStomp.instance);

    achievementsApiWsClient.getAchievements({
      achievementFilter: {
        productTagsFilter: [],
        ids: [],
        status: [],
        scheduleTypes: ['Weekly'],
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
    }, async (res) => {
      totalRecords.value = res.meta.totalRecordsFound;
      const ids = res.data.map(item => item.id);

      achievements.value = res.data;

      await getOptInStatus(ids);
      await getEntityRewards(ids);
      isLoading.value = false;
    });
  } catch (err) {
    console.log('getAchievementsRequest error => ', err);
  }
};

const getOptInStatus = async (ids) => {
  try {
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

      store.dispatch('setAchievements', achievementsData.value);
    });
  } catch (e) {
    console.log('error => ', e);
  }
};

const getEntityRewards = async (ids) => {
  try {
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
  } catch (e) {
    console.log('error => ', e);
  }
};

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
  await store.dispatch('setCurrentPage', pageNumber);
  await getAchievementsRequest();
};

onMounted(() => {
  getAchievementsRequest();
});

</script>

<style lang="scss">
@import '@/assets/scss/_variables';

.until-the-next-day {
  background-color: $light-grey;
  border-radius: $border-radius;
  padding: 12px 30px;

  font-family: $medium;
  font-size: 14px;
  color: $text-color-white;

  & > img {
    margin-right: 8px;
  }

  @media screen and (max-width: $tableWidth) {
    font-size: 12px;
    line-height: 14px;

    padding: 8px;
  }
}

.light-mode .until-the-next-day {
  background-color: $card-bg-LM;
  color: $card-title-color-LM;
}

.achievements-dashboard-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  grid-gap: 15px;

  @media screen and (max-width: 915px) {
    grid-template-columns: repeat(1, 1fr);
  }
}

.achievements-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  height: 100%;
  grid-gap: 15px;
  margin-bottom: 30px;
  transition: opacity 0.5s ease-in-out;

  @media screen and (max-width: $tableWidth) {
    grid-template-columns: repeat(1, 1fr);
    height: auto;
  }
}
</style>