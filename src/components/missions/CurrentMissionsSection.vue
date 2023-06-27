<template>
  <div class="section">
    <Loader v-if="isLoading" :title="'Current Missions are loading'"/>
    <div :class="isDashboard ? 'dashboard-cards-grid' : 'missions-cards-grid'">
      <div class="card-wrapper" v-for="mission in currentMissions">
        <Mission :mission="mission"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import {
  AchievementRequest,
  AchievementsApiWs,
  ApiClientStomp, EntityRequest, FilesApiWs,
  OptInApiWs,
  OptInStatesRequest, RewardsApiWs
} from '@ziqni-tech/member-api-client';
import { useStore } from 'vuex';

import Mission from './Mission';
import Loader from '../Loader';

const props = defineProps({
  isDashboard: {
    type: Boolean,
    default: false
  }
});

const store = useStore();

const currentMissions = computed(() => {
  return props.isDashboard
      ? store.getters.getCurrentMissions.slice(0, 3)
      : store.getters.getCurrentMissions;
});
const totalRecords = computed(() => store.getters.getCurrentMissionsTotalRecords);

const limit = ref(20);
const skip = ref(0);
const isLoading = ref(false);
const missions = ref([]);

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
    constraints: ['mission']
  },
}, null);

const getAchievementsRequest = async () => {
  isLoading.value = true;
  const achievementsApiWsClient = new AchievementsApiWs(ApiClientStomp.instance);

  await achievementsApiWsClient.getAchievements(achievementsRequest, async (res) => {
    store.dispatch('setCurrentMissionsTotalRecords', res.meta.totalRecordsFound);

    const ids = res.data.map(item => item.id);
    missions.value = res.data;

    await getOptInStatus(ids);
    await getEntityRewards(ids);
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
    for (const mission of missions.value) {
      if (res.data.length) {
        const status = res.data.find(item => item.entityId === mission.id)?.status;
        const percentage = res.data.find(item => item.entityId === mission.id)?.percentageComplete;

        mission.entrantStatus = status ? status : '';
        mission.percentageComplete = percentage ? percentage : 0;
      } else {
        mission.percentageComplete = 0;
        mission.entrantStatus = '';
      }
    }
    store.dispatch('setCurrentMissionsAction', missions.value);
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
    limit: 20
  }, null);

  await rewardsApiWsClient.getRewards(rewardRequest, async (res) => {
    for (const mission of missions.value) {
      if (res.data.length) {
        let maxReward = null;
        for (const reward of res.data) {
          if (reward.entityId === mission.id) {
            if (!maxReward || reward.rewardValue > maxReward.rewardValue) {
              maxReward = reward;
            }
          }
        }
        if (maxReward) {
          mission.rewardValue = maxReward.rewardValue;
          mission.rewardType = maxReward.rewardType.key;
          if (maxReward.icon) {
            mission.icon = await getRewardIcon(maxReward.icon);
          }
        }
      }
    }
  });
}

const getRewardIcon = async (id) => {
  const fileApiWsClient = new FilesApiWs(ApiClientStomp.instance);

  const fileRequest = {
    ids: [id],
    limit: 1,
    skip: 0
  };

  return new Promise((resolve) => {
    fileApiWsClient.getFiles(fileRequest, (res) => {
      resolve(res.data[0].uri);
    });
  });
}

if (!currentMissions.value.length) getAchievementsRequest();

const isShowMore = computed(() => currentMissions.value.length < totalRecords.value);

const loadMore = async () => {
  isLoading.value = true;
  const achievementsApiWsClient = new AchievementsApiWs(ApiClientStomp.instance);

  achievementsRequest.achievementFilter.skip = currentMissions.value.length;

  await achievementsApiWsClient.getAchievements(achievementsRequest, (res) => {
    missions.value = res.data;

    const ids = res.data.map(item => item.id);
    getOptInStatus(ids);

    isLoading.value = false;
  });
};

</script>

<style scoped lang="scss">
@import "@/assets/scss/_variables";

.missions-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  grid-gap: 15px;

  @media screen and (max-width: 1240px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media screen and (max-width: 935px) {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>