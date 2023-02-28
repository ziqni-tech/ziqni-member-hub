<template>
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">Current Missions</h2>
      <ActionsBlock />
    </div>
    <Loader v-if="isLoading" :title="'Current Missions are loading'" />
    <div class="cards-grid">
      <div class="card-wrapper" v-for="mission in currentMissions">
        <MissionCard :mission="mission" />
      </div>
    </div>
    <button class="b-btn b-btn__text" v-if="currentMissions.length && isShowMore && !isDashboard" @click="loadMore">
      Show More
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue';
import { AchievementRequest, AchievementsApiWs, ApiClientStomp } from '@ziqni-tech/member-api-client';

import ActionsBlock from '../../shared/components/UI/actions-block/ActionsBlock';
import MissionCard from './MissionCard';
import Loader from '../Loader';

const props = defineProps({
  isDashboard: {
    type: Boolean,
    default: false
  }
});

const currentMissions = ref([])
const missions = ref([])
const totalRecords = ref(0)
const limit = ref(3);
const skip = ref(0);
const isLoading = ref(false);

const achievementsRequest = AchievementRequest.constructFromObject({
  achievementFilter: {
    productIds: [],
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
    totalRecords.value = res.meta.totalRecordsFound
    missions.value = res.data;
    isLoading.value = false;
  });
}
onMounted(() => {
  getAchievementsRequest()
})

const isShowMore = computed(() => currentMissions.value.length < totalRecords.value)

const loadMore = async() => {
  isLoading.value = true;
  const achievementsApiWsClient = new AchievementsApiWs(ApiClientStomp.instance);
  achievementsRequest.achievementFilter.skip = currentMissions.value.length;
  await achievementsApiWsClient.getAchievements(achievementsRequest, (res) => {
    missions.value = res.data;
    isLoading.value = false;
  });
}

watchEffect(() => {
  currentMissions.value = [...currentMissions.value, ...missions.value];
});

</script>

<style lang="scss">

</style>