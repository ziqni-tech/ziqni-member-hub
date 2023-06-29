<template>
  <AwardDetailsCard v-if="isLoaded" :award="award" @claimAward="claimAward" />
</template>

<script setup>

import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import {
  ApiClientStomp,
  AwardRequest,
  AwardsApiWs,
  ClaimAwardRequest,
  EntityRequest,
  RewardsApiWs,
} from '@ziqni-tech/member-api-client';
import AwardDetailsCard from "@/components/awards/AwardDetailsCard.vue";

const router = useRouter()

const route = useRoute();
const ids = [route.params.id];
const isLoaded = ref(false);
const awards = ref(null);
const award = ref(null);
const store = useStore();

onMounted(() => {
  getAwardsRequest()
})
const getAwardsRequest = async () => {
  const awardsApiWsClient = new AwardsApiWs(ApiClientStomp.instance);

  const awardRequest = AwardRequest.constructFromObject({
    awardFilter: {
      ids,
      productIds: [],
      statusCode: {
        moreThan: 0,
        lessThan: 100
      },
      sortBy: [{
        queryField: 'created',
        order: 'Desc'
      }],
      skip: 0,
      limit: 20
    },
    currencyKey: ''
  });

  awardsApiWsClient.getAwards(awardRequest, async (res) => {
    awards.value = res.data;
    const rewardIds = res.data.map(item => item.rewardId);
    await getEntityRewards(rewardIds)
  });
};

const getEntityRewards = async (ids) => {
  const rewardsApiWsClient = await new RewardsApiWs(ApiClientStomp.instance);

  const rewardRequest = EntityRequest.constructFromObject({
    entityFilter: [
      {
        entityType: 'Reward',
        entityIds: ids
      },
    ],
    skip: 0,
    limit: 20
  }, null);

  await rewardsApiWsClient.getRewards(rewardRequest, async (res) => {
    for (const award of awards.value) {
      if (res.data.length) {
        let maxReward = null;
        for (const reward of res.data) {
          if (reward.entityId === award.entityId) {
            if (!maxReward || reward.rewardValue > maxReward.rewardValue) {
              maxReward = reward;
            }
          }
        }
        if (maxReward) {
          award.rewardIconLink = maxReward.iconLink;
        }
      }
    }
    award.value = awards.value[0];
    isLoaded.value = true;
  });
}

const claimAward = async () => {
  const awardsApiWsClient = new AwardsApiWs(ApiClientStomp.instance);

  const claimAwardRequest = ClaimAwardRequest.constructFromObject({
    awardIds: [award.value.id]
  });

  awardsApiWsClient.claimAwards(claimAwardRequest, (res) => {
    if (res.data && res.data.length) {
      setTimeout(async () => {
        await getAwardsRequest();
      }, 5000);
    }
  });
};

</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables';

</style>