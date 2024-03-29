<template>
  <div class="details-content">
    <AchievementDetailsCard
        :key="updateKey"
        v-if="isLoaded"
        :achievement="achievement"
        @joinAchievement="joinAchievement"
        @leaveAchievement="leaveAchievement"
        :isDarkMode="isDarkMode"
    />
  </div>
</template>

<script setup>

import { useRoute, useRouter } from 'vue-router';
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import {
  AchievementRequest,
  AchievementsApiWs,
  ApiClientStomp,
  EntityRequest,
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
const updateKey = ref(0);
const store = useStore();

const isDarkMode = computed(() => store.getters.getTheme);

onBeforeMount(async () => {
  ApiClientStomp.instance.client.debug = () => {};
  await ApiClientStomp.instance.connect({ token: localStorage.getItem('token') });
  await store.dispatch('setIsConnectedClient', true);
});

onMounted(() => {
  getAchievementsRequest()
})
const getAchievementsRequest = async () => {
  try {
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
  } catch (err) {
    console.log(err);
  }
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
          achievement.rewardIconLink = maxReward.iconLink;
        }
      }
    }
    achievement.value = achievements.value[0];
  });
}

const joinAchievement = async ({ id, name }) => {
  const optInApiWsClient = new OptInApiWs(ApiClientStomp.instance);

  const optInRequest = ManageOptinRequest.constructFromObject({
    entityId: id,
    entityType: 'Achievement',
    action: 'join'
  }, null);

  await optInApiWsClient.manageOptin(optInRequest, async (res) => {
    setTimeout(async function () {
      await getAchievementsRequest();
      updateKey.value++
    }, 2000);
  });
};

const leaveAchievement = async ({ id, name }) => {
  const optInApiWsClient = new OptInApiWs(ApiClientStomp.instance);

  const optInRequest = ManageOptinRequest.constructFromObject({
    entityId: id,
    entityType: 'Achievement',
    action: 'leave'
  }, null);


  await optInApiWsClient.manageOptin(optInRequest, async (res) => {
    setTimeout(async function () {
      await getAchievementsRequest();
      updateKey.value++
    }, 2000);
  });
};


</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables';

</style>