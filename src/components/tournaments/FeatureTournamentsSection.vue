<template>
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">Feature Tournaments</h2>
    </div>
    <Loader v-if="!isLoaded" :title="'Feature Tournaments are loading'"/>
    <div class="cards-grid" v-else-if="isLoaded && featureCompetitions.length">
      <div v-for="c in featureCompetitions" class="card-wrapper">
        <TournamentCard :key="c.id" :card="c"/>
      </div>
    </div>
    <button class="show-more-btn" v-if="featureCompetitions.length && isShowMore" @click="loadMore">
      Show More
    </button>
  </div>
</template>

<script setup>
import TournamentCard from '../../components/tournaments/TournamentCard';

import { computed, ref, watch } from 'vue';
import { useCompetitions } from '../../hooks/useCompetitions';
import Loader from '../Loader';
import { useStore } from 'vuex';
import { useGetAwards } from '../../hooks/useGetAwards';

const { getCompetitionsHandler, tournamentsResponse } = useCompetitions();
const { getAvailableAwards, awards } = useGetAwards();
const isLoaded = ref(true);
const store = useStore();
const featureCompetitions = computed(() => store.getters.getFeatureTournaments);
const tournamentsTotalRecords = computed(() => store.getters.getFeatureTournamentsTotalRecords);
const limit = ref(4);
const skip = ref(0);
const statusCode = {
  moreThan: 5,
  lessThan: 35
};
const tournamentRequestData = {
  statusCode,
  limit: limit.value,
  skip: skip.value,
  ids: []
};

if (!featureCompetitions.value.length) {
  isLoaded.value = false;
  getCompetitionsHandler(tournamentRequestData);
}

watch(tournamentsResponse, (currentValue, oldValue) => {
  store.dispatch('setFeatureTournamentsAction', currentValue);
  isLoaded.value = true;
});

const tourIds = computed(() => featureCompetitions.value.map((item) => item.id))

// watchEffect( () => {
//   currentCompetitions.value.map( async (item) => {
// await getAvailableAwards([item.id]);
// })
// })

watch(tourIds, (value) => {
  if (value) {
    console.warn('IDS VALUE', value);
    getAvailableAwards(value);
  }
})

watch(awards, (value) => {
  if (value) {
    console.warn('FEATURE COMP AWARDS', value);
  }
})

const isShowMore = computed(() => featureCompetitions.value.length < tournamentsTotalRecords.value);

const loadMore = async () => {
  tournamentRequestData.skip = featureCompetitions.value.length;
  await getCompetitionsHandler(tournamentRequestData);
};
</script>

<style lang="scss">

</style>