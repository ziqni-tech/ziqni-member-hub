<template>
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">Current Tournaments</h2>
    </div>
    <Loader v-if="!isLoaded" :title="'Current Tournaments are loading'" />
    <div class="cards-grid" v-else-if="currentCompetitions.length && isLoaded">
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
import { useCompetitions } from '../../hooks/useCompetitions';
import { rewardFormatter } from '../../utils/rewardFormatter';
import Tournament from '../../components/tournaments/TournamentCard';
import Loader from '../Loader';
import { useStore } from 'vuex';

const props = defineProps({
  isDashboard: {
    type: Boolean,
    default: false
  }
});

const {
  getCompetitionsHandler,
  tournamentsResponse
} = useCompetitions();

const store = useStore();
const isLoaded = ref(true);
const currentCompetitions = computed(() => {
  return props.isDashboard
      ? store.getters.getCurrentTournaments.slice(0, 3)
      : store.getters.getCurrentTournaments;
});
const tournamentsTotalRecords = computed(() => store.getters.getCurrentTournamentsTotalRecords);

const limit = ref(3);
const skip = ref(0);
const statusCode = {
  moreThan: 15,
  lessThan: 35
}

const { getAvailableAwards, awards } = useGetAwards();

const tournamentRequestData = {
  type: 'current',
  statusCode,
  limit: limit.value,
  skip: skip.value,
  ids: []
}

if (!currentCompetitions.value.length) {
  isLoaded.value = false;
  getCompetitionsHandler(tournamentRequestData);
}

const tourIds = computed(() => currentCompetitions.value.map((item) => item.id))

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
})

watchEffect(() => {
  if (awards.value) {
    console.warn('IF Current AWARDS', awards.value);
    // awards.value.map(item => {
    //   console.log('rewardFormatter(item)', rewardFormatter(item));
    //   return rewardFormatter(item);
    // })
  }
})

watch(tournamentsResponse, (currentValue, oldValue) => {
  store.dispatch('setCurrentTournamentsAction', currentValue);
  isLoaded.value = true;
});

const isShowMore = computed(() => currentCompetitions.value.length < tournamentsTotalRecords.value)

const loadMore = async() => {
  tournamentRequestData.skip = currentCompetitions.value.length;
  await getCompetitionsHandler(tournamentRequestData);
}
</script>

<style lang="scss">

</style>