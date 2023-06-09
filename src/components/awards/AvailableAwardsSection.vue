<template>
  <div class="content-wrapper">
    <div class="awards-cards-grid" v-if="isLoaded">
      <div v-for="award in awards">
        <AwardCard :award="award"/>
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
import { ApiClientStomp, AwardRequest, AwardsApiWs } from '@ziqni-tech/member-api-client';

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

  awardsApiWsClient.getAwards(availableAwardsRequest, (res) => {
    awards.value = res.data;
    totalRecords.value = res.meta.totalRecordsFound;
    isLoaded.value = true;
  });
};

const pageChange = async (pageNumber) => {
  currentPage.value = pageNumber;
  await getAwardsRequest();
};

onMounted(() => {
  getAwardsRequest();
})
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