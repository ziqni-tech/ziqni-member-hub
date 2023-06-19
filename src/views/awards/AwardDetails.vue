<template>
  Award Details
</template>

<script setup>


import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { ApiClientStomp, AwardRequest, AwardsApiWs, } from '@ziqni-tech/member-api-client';

const router = useRouter()

const route = useRoute();
const ids = [route.params.id];
const isLoaded = ref(false);
const award = ref({});
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

  console.warn('awardRequest', awardRequest);

  awardsApiWsClient.getAwards(awardRequest, (res) => {
    award.value = res.data[0];
    console.warn('AWARD', res);
    isLoaded.value = true;
  });

};


</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables';

</style>