<template>
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">Feature Tournaments</h2>
      <ActionsBlock/>
    </div>
    <Loader v-if="!isLoaded" :title="'Feature Tournaments are loading'"/>
    <div class="cards-grid" v-else-if="isLoaded && featureCompetitions.length">
      <div v-for="c in featureCompetitions" class="card-wrapper">
        <TournamentCard :key="c.id" :card="c"/>
      </div>
    </div>
    <NotFoundItems v-else :title="'Feature Tournaments'"/>
    <button class="m-btn b-btn__text" v-if="featureCompetitions.length && isShowMore" @click="loadMore">
      Show More
    </button>
  </div>
</template>

<script setup>
import ActionsBlock from '../../shared/components/UI/actions-block/ActionsBlock';
import TournamentCard from '../../components/tournaments/TournamentCard';
import NotFoundItems from '../NotFoundItems';

import { computed, ref, watch, watchEffect } from 'vue';
import { useCompetitions } from '../../hooks/useCompetitions';
import Loader from '../Loader';
import { useStore } from 'vuex';

const { getCompetitionsHandler, tournamentsResponse } = useCompetitions();
const isLoaded = ref(true);
const store = useStore();
const featureCompetitions = computed(() => store.getters.getFeatureTournaments);
const tournamentsTotalRecords = computed(() => store.getters.getFeatureTournamentsTotalRecords);
const limit = ref(3);
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

const isShowMore = computed(() => featureCompetitions.value.length < tournamentsTotalRecords.value);

const loadMore = async () => {
  tournamentRequestData.skip = featureCompetitions.value.length;
  await getCompetitionsHandler(tournamentRequestData);
};
</script>

<style lang="scss">

</style>