<template>
  <div class="section" :class="{'light-mode': !isDarkMode}">
    <div class="section-header">
      <h2 class="section-title" v-if="achievementsData.length">
        {{ 'Achievements' }}
      </h2>
    </div>
    <div class="content-wrapper">
      <Loader v-if="isLoading"   class="loading" :title="'Achievements are loading'"/>
      <div v-if="!isLoading " :class="isDashboard ? 'achievements-dashboard-cards-grid' : 'achievements-cards-grid'">
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
import Loader from '@/components/Loader.vue';

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



const currentPage = computed(() => store.getters.getCurrentPage);
const totalRecords = ref(0);

const skip = computed(() => (currentPage.value - 1) * limit.value);

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

    achievementsApiWsClient.getAchievements({
      achievementFilter: {
        productTagsFilter: [],
        ids: [],
        status: [],
        scheduleTypes: [],
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
    }, (res) => {
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

.achievements-tabs {
  width: 400px;
  max-width: 90%;
  display: flex;
  align-items: center;
  background-color: $tabs-bg-DM;
  border-radius: $border-radius;
  margin: 0 auto;
  font-family: $medium;
  font-size: 12px;

  @media screen and (max-width: 480px) {
    margin-bottom: 20px;
  }

  @media screen and (max-width: 380px) {
    width: 280px;
    margin-bottom: 20px;
  }

  &.light-mode {
    background-color: $card-bg-LM;
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
    font-size: 10px;
    line-height: 12px;
  }
}

.light-mode .nav-pills .nav-link {
  color: $card-text-color-LM;
}

.nav-pills .nav-link.active {
  background: $active-tab-bg_DM;
  box-shadow: 0 2px 12px 0 rgba(64, 106, 140, 0.50);
  border: 1px solid var(--secondary-dark-blue-600, #406A8C);
}

.light-mode .nav-pills .nav-link.active {
  background: $pagination-active-btn-bg;
  border: 1px solid $border-pink;
  box-shadow: 0 2px 12px 0 rgba(238, 62, 200, 0.40);
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