<template>
  <div class="details-content">
    <AwardDetailsCard
        v-if="isLoaded"
        :award="award"
        @claimAward="claimAward"
        :isDarkMode="isDarkMode"
    />
  </div>
</template>

<script setup>

import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import {
  AchievementRequest,
  AchievementsApiWs,
  ApiClientStomp,
  AwardRequest,
  AwardsApiWs,
  ClaimAwardRequest,
  CompetitionRequest,
  CompetitionsApiWs,
  ContestRequest,
  ContestsApiWs,
  EntityRequest,
  RewardsApiWs,
} from '@ziqni-tech/member-api-client';
import AwardDetailsCard from '@/components/awards/AwardDetailsCard.vue';

const router = useRouter()

const route = useRoute();
const ids = [route.params.id];
const isLoaded = ref(false);
const awards = ref(null);
const award = ref(null);
const store = useStore();
const isDarkMode = computed(() => store.getters.getTheme);

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
    award.value = awards.value[0];

    const rewardIds = res.data.map(item => item.rewardId);
    await getEntityRewards(rewardIds);

    const { entityType, entityId } = res.data[0];
    await getEntityTermAndConditions(entityType, entityId);

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
  });
}

const getEntityTermAndConditions = async (entityType, entityId) => {
  if (entityType === 'Achievement') await getAchievementsRequest(entityId);
  if (entityType === 'Contest') await getContestRequest(entityId);
  if (entityType === 'Competition') await getCompetitionRequest(entityId);
}

const getAchievementsRequest = async (id) => {
  const achievementsApiWsClient = new AchievementsApiWs(ApiClientStomp.instance);

  const achievementsRequest = AchievementRequest.constructFromObject({
    achievementFilter: {
      productTagsFilter: [],
      ids: [id],
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
        moreThan: 0,
        lessThan: 130
      },
      constraints: []
    },
  }, null);

  achievementsApiWsClient.getAchievements(achievementsRequest, (res) => {
    if (res.data.length && res.data[0].termsAndConditions) {
      award.value.termsAndConditions = res.data[0].termsAndConditions;
    } else {
      award.value.termsAndConditions = null;
    }
  });
};

const getContestRequest = async (id) => {
  const contestApiWsClient = new ContestsApiWs(ApiClientStomp.instance);
  const contestRequest = ContestRequest.constructFromObject({
    contestFilter: {
      productIds: [],
      tags: [],
      startDate: null,
      endDate: null,
      ids: [id],
      competitionIds: [],
      constraints: [],
      statusCode: {
        moreThan: 10,
        lessThan: 100
      },
    }
  }, null);

  await contestApiWsClient.getContests(contestRequest, async (res) => {
    if (res.data.length && res.data[0].termsAndConditions) {
      award.value.termsAndConditions = res.data[0].termsAndConditions;
    } else {
      award.value.termsAndConditions = null;
    }
  })
}

const getCompetitionRequest = async (id) => {
  const competitionsApiWsClient = new CompetitionsApiWs(ApiClientStomp.instance);

  const competitionRequest = CompetitionRequest.constructFromObject({
    competitionFilter: {
      statusCode: {
        moreThan: 5,
        lessThan: 100
      },
      sortBy: [{
        queryField: 'created',
        order: 'Desc'
      }],
      limit: 20,
      skip: 0,
      ids: [id]
    }
  }, null);

  await competitionsApiWsClient.getCompetitions(competitionRequest, async (res) => {
    if (res.data.length && res.data[0].termsAndConditions) {
      award.value.termsAndConditions = res.data[0].termsAndConditions;
    } else {
      award.value.termsAndConditions = null;
    }
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