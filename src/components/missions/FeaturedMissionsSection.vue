<template>
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">Feature Missions</h2>
    </div>
    <Loader v-if="isLoading" :title="'Featured Missions are loading'"/>
    <div class="cards-grid">
      <div class="card-wrapper" v-for="mission in featureMissions">
        <MissionCard :mission="mission"/>
      </div>
    </div>
    <button class="show-more-btn" v-if="featureMissions.length && isShowMore && !isDashboard" @click="loadMore">
      Show More
    </button>
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

import MissionCard from './Mission';
import Loader from '../Loader';

const props = defineProps({
  isDashboard: {
    type: Boolean,
    default: false
  }
});

const store = useStore();

const featureMissions = computed(() => store.getters.getFeatureMissions);
const totalRecords = computed(() => store.getters.getFeatureMissionsTotalRecords);

const limit = ref(3);
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
    constraints: ['hasNoDependancies']
  },
}, null);

const getAchievementsRequest = async () => {
  isLoading.value = true;
  const achievementsApiWsClient = new AchievementsApiWs(ApiClientStomp.instance);

  await achievementsApiWsClient.getAchievements(achievementsRequest, (res) => {
    store.dispatch('setFeatureMissionsTotalRecords', res.meta.totalRecordsFound);

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
    store.dispatch('setFeatureMissionsAction', missions.value);
  });
};

if (!featureMissions.value.length) getAchievementsRequest();

const isShowMore = computed(() => featureMissions.value.length < totalRecords.value);

const loadMore = async () => {
  isLoading.value = true;
  const achievementsApiWsClient = new AchievementsApiWs(ApiClientStomp.instance);

  achievementsRequest.achievementFilter.skip = featureMissions.value.length;

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