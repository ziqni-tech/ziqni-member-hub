<template>
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">Current Missions</h2>
      <ActionsBlock />
    </div>
    <div class="cards-grid">
      <div class="card-wrapper" v-for="mission in missions">
        <MissionCard :mission="mission" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ActionsBlock from '../../shared/components/UI/actions-block/ActionsBlock';
import MissionCard from './MissionCard';
import { onMounted, ref } from 'vue';
import { AchievementRequest, AchievementsApiWs, ApiClientStomp } from '@ziqni-tech/member-api-client';

const missions = ref({})

const getAchievementsRequest = async () => {
  const achievementsApiWsClient = new AchievementsApiWs(ApiClientStomp.instance);

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
      skip: 0,
      limit: 20,
      statusCode: {
        moreThan: 20,
        lessThan: 30
      },
      constraints: ['hasNoDependancies']
    },
  }, null);

  await achievementsApiWsClient.getAchievements(achievementsRequest, (res) => {

    console.log('MISSIONS', res);
    missions.value = res.data;
  });
}
onMounted(() => {
  getAchievementsRequest()
})

</script>

<style lang="scss">

</style>