<template>
  <div class="content-wrapper">
    <div class="awards-cards-grid" v-if="isLoaded">
      <div v-for="award in awards">
        <AwardCard :award="award" @claimAward="claimAward" />
      </div>
    </div>
    <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @pageChange="pageChange"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import {
  ApiClientStomp,
  AwardRequest,
  AwardsApiWs,
  ClaimAwardRequest,
  EntityRequest,
  RewardsApiWs
} from '@ziqni-tech/member-api-client';

import AwardCard from '@/components/awards/AwardCard.vue';
import Pagination from '@/shared/components/Pagination.vue';

const awards = ref([]);
const isLoaded = ref(false);
const currentPage = ref(1);
const totalRecords = ref(0);
const limit = ref(8);

const skip = computed(() => (currentPage.value - 1) * limit.value);
const totalPages = computed(() => Math.ceil(totalRecords.value / limit.value));

const getAwardsRequest = async () => {
  const awardsApiWsClient = new AwardsApiWs(ApiClientStomp.instance);

  const availableAwardsRequest = AwardRequest.constructFromObject({
    awardFilter: {
      statusCode: {
        moreThan: 14,
        lessThan: 16
      },
      sortBy: [{
        queryField: 'created',
        order: 'Desc'
      }],
      skip: skip.value,
      limit: limit.value
    },
    currencyKey: ''
  });

  awardsApiWsClient.getAwards(availableAwardsRequest, async (res) => {
    awards.value = res.data;
    totalRecords.value = res.meta.totalRecordsFound;
    const rewardIds = res.data.map(item => item.rewardId);
    await getEntityRewards(rewardIds);
    isLoaded.value = true;
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
    limit: limit.value
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
  });
}
const pageChange = async (pageNumber) => {
  currentPage.value = pageNumber;
  await getAwardsRequest();
};

onMounted(() => {
  getAwardsRequest();
})

const claimAward = async (id) => {
  const awardsApiWsClient = new AwardsApiWs(ApiClientStomp.instance);

  const claimAwardRequest = ClaimAwardRequest.constructFromObject({
    awardIds: [id]
  });

  await awardsApiWsClient.claimAwards(claimAwardRequest, async (res) => {
    if (res.data && res.data.length) {
      await ApiClientStomp.instance.sendSys('', {}, async (res, headers) => {
        if (res.entityId && res.entityId === id && headers.objectType === "EntityStateChanged") {
          await getAwardsRequest();
        }
      })
    }
  });
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/_variables";

.awards-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  grid-gap: 15px;
  margin: 30px 0;
}

@media screen and (max-width: $tableWidth) {
  .awards-cards-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
    grid-gap: 8px;

    margin-top: 10px;
  }
}
</style>