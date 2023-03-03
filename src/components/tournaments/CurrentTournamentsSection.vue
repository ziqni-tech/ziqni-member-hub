<template>
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">Current Tournaments</h2>
      <ActionsBlock/>
    </div>
    <Loader v-if="!isLoaded" :title="'Current Tournaments are loading'" />
    <div class="cards-grid" v-else-if="currentCompetitions.length && isLoaded">
      <div v-for="c in currentCompetitions" class="card-wrapper">
        <TournamentCard :key="c.id" :card="c"/>
      </div>
    </div>
    <NotFoundItems v-else :title="'Current Tournaments'" />
    <button class="b-btn b-btn__text" v-if="currentCompetitions.length && isShowMore && !isDashboard" @click="loadMore">
      Show More
    </button>
  </div>
</template>

<script setup>
import { computed, ref, watch, watchEffect } from 'vue';

import NotFoundItems from '../NotFoundItems';
import { useGetAwards } from '../../hooks/useGetAwards';
import { useCompetitions } from '../../hooks/useCompetitions';
import { rewardFormatter } from '../../utils/rewardFormatter';
import TournamentCard from '../../components/tournaments/TournamentCard';
import ActionsBlock from '../../shared/components/UI/actions-block/ActionsBlock';
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
  moreThan: 5,
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

watchEffect(() => {
  if (awards.value) {
    console.warn('IF AWARDS', awards.value);
    awards.value.map(item => {
      console.log('rewardFormatter(item)', rewardFormatter(item));
      return rewardFormatter(item);
    })
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