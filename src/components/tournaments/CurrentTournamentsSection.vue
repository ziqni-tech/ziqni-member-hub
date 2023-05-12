<template>
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">Current Tournaments</h2>
    </div>
    <Loader v-if="!isLoaded" :title="'Current Tournaments are loading'" />
    <div :class="isDashboard ? 'dashboard-cards-grid' : 'cards-grid'" v-else-if="currentCompetitions.length && isLoaded">
      <div v-for="c in currentCompetitions" class="card-wrapper">
        <Tournament :key="c.id" :card="c"/>
      </div>
    </div>
    <button class="show-more-btn" v-if="currentCompetitions.length && isShowMore && !isDashboard" @click="loadMore">
      Show More
    </button>
  </div>
</template>

<script setup>
import { computed, ref, watch, watchEffect } from 'vue';

import { useGetAwards } from '../../hooks/useGetAwards';
import { rewardFormatter } from '../../utils/rewardFormatter';
import Tournament from '../../components/tournaments/TournamentCard';
import Loader from '../Loader';
import { useStore } from 'vuex';
import { ApiClientStomp, CompetitionRequest, CompetitionsApiWs } from '@ziqni-tech/member-api-client';

const props = defineProps({
  isDashboard: {
    type: Boolean,
    default: false
  }
});

const store = useStore();
const isLoaded = ref(true);

const currentCompetitions = computed(() => {
  return props.isDashboard
      ? store.getters.getCurrentTournaments.slice(0, 3)
      : store.getters.getCurrentTournaments;
});

const tournamentsTotalRecords = computed(() => store.getters.getCurrentTournamentsTotalRecords);

const limit = ref(20);
const skip = ref(0);
const statusCode = {
  moreThan: 15,
  lessThan: 35
};

const { getAvailableAwards, awards } = useGetAwards();

const competitionRequest = CompetitionRequest.constructFromObject({
  competitionFilter: {
    statusCode,
    sortBy: [{
      queryField: 'created',
      order: 'Desc'
    }],
    limit: limit.value,
    skip: skip.value,
    ids: []
  }
}, null);

if (!currentCompetitions.value.length) getCompetitionsRequest();


const tourIds = computed(() => currentCompetitions.value.map((item) => item.id));

async function getCompetitionsRequest() {
  isLoaded.value = false;
  try {
    const apiClientStomp = ApiClientStomp.instance;
    const competitionsApiWsClient = await new CompetitionsApiWs(apiClientStomp);

    await competitionsApiWsClient.getCompetitions(competitionRequest, (res) => {
      store.dispatch('setCurrentTournamentsTotalRecords', res.meta.totalRecordsFound);
      store.dispatch('setCurrentTournamentsAction', res.data);
      isLoaded.value = true;
    });
  } catch (e) {
    console.log('ERROR', e);
  }

}

// watchEffect( () => {
//   currentCompetitions.value.map( async (item) => {
// await getAvailableAwards([item.id]);
// })
// })

watch(tourIds, (value) => {
  if (value) {
    getAvailableAwards(value);
    console.warn('IDS Current VALUE', value);
  }
});

watchEffect(() => {
  if (awards.value) {
    console.warn('IF Current AWARDS', awards.value);
    // awards.value.map(item => {
    //   console.log('rewardFormatter(item)', rewardFormatter(item));
    //   return rewardFormatter(item);
    // })
  }
});

const isShowMore = computed(() => currentCompetitions.value.length < tournamentsTotalRecords.value);

// const loadMore = async () => {
//   tournamentRequestData.skip = currentCompetitions.value.length;
//   await getCompetitionsHandler(tournamentRequestData.value);
// };

</script>

<style lang="scss">

</style>