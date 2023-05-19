<template>
  <div class="awards-cards-grid" v-if="isLoaded">
    <div v-for="award in awards">
      <AwardCard :award="award" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ApiClientStomp, AwardRequest, AwardsApiWs } from '@ziqni-tech/member-api-client';

import AwardCard from '@/components/awards/AwardCard.vue';

const awards = ref([]);
const isLoaded = ref(false)

const claimedAwardsRequest = AwardRequest.constructFromObject({
  awardFilter: {
    statusCode: {
      moreThan: 34,
      lessThan: 36
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

const getAwardsRequest = async () => {
  const awardsApiWsClient = new AwardsApiWs(ApiClientStomp.instance);

  awardsApiWsClient.getAwards(claimedAwardsRequest, (res) => {
    awards.value = res.data
    isLoaded.value = true
    console.warn('Claimed AWARDS', res);
  });
};

getAwardsRequest()
</script>

<style scoped lang="scss">
.awards-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  grid-gap: 15px;
  margin: 30px 0;
}
</style>