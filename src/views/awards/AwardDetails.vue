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

import { computed, onBeforeMount, onMounted, ref } from 'vue';
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
import awardIcon_1 from '@/assets/icons/awards/award_1.svg';
import awardIcon_2 from '@/assets/icons/awards/award_2.svg';
import awardIcon_3 from '@/assets/icons/awards/award_3.svg';
import awardIcon_4 from '@/assets/icons/awards/award_4.svg';
import awardIcon_5 from '@/assets/icons/awards/award_5.svg';
import awardIcon_6 from '@/assets/icons/awards/award_6.svg';
import awardIcon_7 from '@/assets/icons/awards/award_7.svg';
import awardIcon_8 from '@/assets/icons/awards/award_8.svg';

const router = useRouter();

const route = useRoute();
const ids = [route.params.id];
const isLoaded = ref(false);
const awards = ref(null);
const award = ref(null);
const store = useStore();
const isDarkMode = computed(() => store.getters.getTheme);

const awardsImages = [
  awardIcon_1,
  awardIcon_2,
  awardIcon_3,
  awardIcon_4,
  awardIcon_5,
  awardIcon_6,
  awardIcon_7,
  awardIcon_8,
];

onBeforeMount(async () => {
  ApiClientStomp.instance.client.debug = () => {
  };
  await ApiClientStomp.instance.connect({ token: localStorage.getItem('token') });
  await store.dispatch('setIsConnectedClient', true);
});

onMounted(() => {
  getAwardsRequest();
});
const getAwardsRequest = async () => {
  try {
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
  } catch (e) {
    console.log(e);
  }
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
      const image = awardsImages[route.query.idx];
      award.rewardIconLink = image;

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
          const image = awardsImages[route.query.idx];
          award.rewardIconLink = image;
          // award.rewardIconLink = maxReward.iconLink;
        }
      }
    }
  });
};

const getEntityTermAndConditions = async (entityType, entityId) => {
  if (entityType === 'Achievement') await getAchievementsRequest(entityId);
  if (entityType === 'Contest') await getContestRequest(entityId);
  if (entityType === 'Competition') await getCompetitionRequest(entityId);
};

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
  });
};

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
};

const claimAward = async () => {
  const awardsApiWsClient = new AwardsApiWs(ApiClientStomp.instance);

  const claimAwardRequest = ClaimAwardRequest.constructFromObject({
    awardIds: [award.value.id]
  });

  awardsApiWsClient.claimAwards(claimAwardRequest, (res) => {
  });
};

</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables';

</style>