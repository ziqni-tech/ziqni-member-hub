<template>
  <div class="section">
    <Loader v-if="isLoading" :title="'Current Missions are loading'"/>
    <div :class="isDashboard ? 'dashboard-cards-grid' : 'cards-grid'">
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
  ApiClientStomp,
  OptInApiWs,
  OptInStatesRequest
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

  await achievementsApiWsClient.getAchievements(achievementsRequest, (res) => {
    store.dispatch('setCurrentMissionsTotalRecords', res.meta.totalRecordsFound);

    const ids = res.data.map(item => item.id);
    missions.value = res.data;

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

<style lang="scss">

</style>