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
import { useStore } from 'vuex';

const props = defineProps({
  isDashboard: {
    type: Boolean,
    default: false
  }
});

const store = useStore();

const currentMissions = computed(() => store.getters.getCurrentMissions);
const totalRecords = computed(() => store.getters.getCurrentMissionsTotalRecords);

const limit = ref(3);
const skip = ref(0);
const isLoading = ref(false);

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
    store.dispatch('setCurrentMissionsAction', res)
    isLoading.value = false;
  });
}

if (!currentMissions.value.length) getAchievementsRequest();

const isShowMore = computed(() => currentMissions.value.length < totalRecords.value)

const loadMore = async() => {
  isLoading.value = true;
  const achievementsApiWsClient = new AchievementsApiWs(ApiClientStomp.instance);

  achievementsRequest.achievementFilter.skip = currentMissions.value.length;

  await achievementsApiWsClient.getAchievements(achievementsRequest, (res) => {
    store.dispatch('setCurrentMissionsAction', res)
    isLoading.value = false;
  });
}

</script>

<style lang="scss">

</style>