<template>
  <div class="awards-cards-grid" v-if="isLoaded">
    <div v-for="award in awards">
      <AwardCard :award="award" />
    </div>
  </div>
  <Pagination :current-page="currentPage" :total-pages="100" @pageChang="pageChang" />
</template>

<script setup>
import { ApiClientStomp, AwardRequest, AwardsApiWs } from '@ziqni-tech/member-api-client';
import AwardCard from '@/components/awards/AwardCard.vue';
import { ref } from 'vue';
import Pagination from '@/shared/components/Pagination.vue';

const awards = ref([]);
const isLoaded = ref(false);
const currentPage = ref(1)

const pageChang = (pageNumber) => {
  currentPage.value = pageNumber
}

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
    skip: 0,
    limit: 20
  },
  currencyKey: ''
});

const getAwardsRequest = async () => {
  const awardsApiWsClient = new AwardsApiWs(ApiClientStomp.instance);

  awardsApiWsClient.getAwards(availableAwardsRequest, (res) => {
    awards.value = res.data;
    isLoaded.value = true;
    console.warn('Available AWARDS', res);
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