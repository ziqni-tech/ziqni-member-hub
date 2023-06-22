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
  EntityRequest,
  FilesApiWs,
  ManageOptinRequest,
  OptInApiWs,
  OptInStatesRequest,
  RewardsApiWs
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
    achievements.value = res.data;
    getOptInStatus();
    getEntityRewards()
    isLoaded.value = true;
  });
};

const getOptInStatus = async () => {
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
  });
};

const getEntityRewards = async () => {
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
          if (maxReward.icon) {
            achievement.icon = await getRewardIcon(maxReward.icon);
          }
        }
      }
    }
    achievement.value = achievements.value[0];
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