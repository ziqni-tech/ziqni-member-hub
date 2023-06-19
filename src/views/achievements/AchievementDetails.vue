<template>
  <AchievementDetailsCard
      v-if="isLoaded"
      :achievement="achievement"
      @joinAchievement="joinAchievement"
      @leaveAchievement="leaveAchievement"
  />
</template>

<script setup>


import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import {
  AchievementRequest,
  AchievementsApiWs,
  ApiClientStomp,
  ManageOptinRequest,
  OptInApiWs,
  OptInStatesRequest
} from '@ziqni-tech/member-api-client';
import AchievementDetailsCard from '@/components/achievements/AchievementDetailsCard.vue';
import { useStore } from 'vuex';

const router = useRouter()

const route = useRoute();
const ids = [route.params.id];
const isLoaded = ref(false);
const achievements = ref([]);
const achievement = ref({});
const store = useStore();

onMounted(() => {
  getAchievementsRequest()
})
const getAchievementsRequest = async () => {
  const achievementsApiWsClient = new AchievementsApiWs(ApiClientStomp.instance);

  const achievementsRequest = AchievementRequest.constructFromObject({
    achievementFilter: {
      productTagsFilter: [],
      ids,
      status: [],
      sortBy: [
        {
          queryField: 'created',
          order: 'Desc'
        },
      ],
      skip: 0,
      limit: 1,
      statusCode: {
        moreThan: 0,
        lessThan: 100
      },
      constraints: []
    },
  }, null);

  achievementsApiWsClient.getAchievements(achievementsRequest, (res) => {
    const ids = res.data.map(item => item.id);

    achievements.value = res.data;
    console.warn('achievements', res.data);

    getOptInStatus(ids);
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
      limit: 10
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
    achievement.value = achievements.value[0];
    isLoaded.value = true;
  });
};

const joinAchievement = async ({ id, name }) => {
  const optInApiWsClient = new OptInApiWs(ApiClientStomp.instance);

  const optInRequest = ManageOptinRequest.constructFromObject({
    entityId: id,
    entityType: 'Achievement',
    action: 'join'
  }, null);

  await optInApiWsClient.manageOptin(optInRequest, (res) => {
    if (res.data) {
      const message = `You successfully joined the ${ name } tournament`;
      store.dispatch('setAlertMessage', message);

      setTimeout(async () => {
        await getAchievementsRequest();
      }, 5000);
    }
  });
};

const leaveAchievement = async ({ id, name }) => {
  const optInApiWsClient = new OptInApiWs(ApiClientStomp.instance);

  const optInRequest = ManageOptinRequest.constructFromObject({
    entityId: id,
    entityType: 'Achievement',
    action: 'leave'
  }, null);

  await optInApiWsClient.manageOptin(optInRequest, (res) => {
    if (res.data) {
      const message = `You successfully leaved the ${ name } tournament`;
      store.dispatch('setAlertMessage', message);

      setTimeout(async () => {
        await getAchievementsRequest();
      }, 5000);
    }
  });
};


</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables';

</style>