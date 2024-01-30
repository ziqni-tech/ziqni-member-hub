<template>
  <div class="section" :class="{'light-mode': !isDarkMode}">
    <div class="section-header">
      <div>
        <h2 class="section-title">
          {{ achievementsTitles['all'] }}
        </h2>
        <p class="section-description" :class="{'light-mode': !isDarkMode}">
          {{ descriptions['all'] }}
        </p>
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
  ApiClientStomp, CompetitionRequest,
  EntityRequest,
  ManageOptinRequest,
  OptInApiWs,
  OptInStatesRequest,
  RewardsApiWs
} from '@ziqni-tech/member-api-client';

import AchievementsCard from './AchievementsCard';
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

onMounted(() => {
  ApiClientStomp.instance.sendSys('', {}, async (json, headers) => {
    if (json && json.entityType === 'Achievement') {
      await getAchievementsRequest();
    }
  });
});

const getAchievementsRequest = async () => {
  try {
    isLoading.value = true;

    const achievementsApiWsClient = new AchievementsApiWs(ApiClientStomp.instance);
    const urlParams = new URLSearchParams(window.location.search);
    const languageKey = urlParams.get('languageKey');

    const achievementsRequest = {
      achievementFilter: {
        productTagsFilter: [],
        ids: [],
        status: [],
        scheduleTypes: ['Once', 'Repeatedly'],
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
      languageKey: languageKey,
    };

    achievementsApiWsClient.getAchievements(achievementsRequest, (res) => {
      totalRecords.value = res.meta.totalRecordsFound;
      const ids = res.data.map(item => item.id);

      achievements.value = res.data;

      getOptInStatus(ids);
      getEntityRewards(ids);
      isLoading.value = false;
    });
  } catch (err) {
    console.log('getAchievementsRequest error => ', err);
  }
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

    store.dispatch('setAchievements', achievementsData.value);
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
.achievements-dashboard-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  grid-gap: 15px;

  @media screen and (max-width: 915px) {
    grid-template-columns: repeat(1, 1fr);
  }
}

.section-description.light-mode {
  color: $section-description-color-LM;
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