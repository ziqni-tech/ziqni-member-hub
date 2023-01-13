<template>
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">Feature Tournaments</h2>
      <ActionsBlock/>
    </div>
    <Loader v-if="isLoading" :title="'Current Tournaments are loading...'" />
    <div class="cards-grid" v-else-if="isLoaded && featureCompetitions.length">
      <div v-for="c in featureCompetitions" class="card-wrapper">
        <TournamentCard :key="c.id" :card="c"/>
      </div>
    </div>
    <NotFoundItems v-else :title="'Feature Tournaments'" />
    <button class="b-btn b-btn__text" v-if="isShowMore" @click="loadMore">
      Show More
    </button>
  </div>
</template>

<script setup>
import ActionsBlock from '../../shared/components/actions-block/ActionsBlock';
import TournamentCard from '../../components/tournaments/TournamentCard';
import NotFoundItems from '../NotFoundItems';

import { computed, ref, watchEffect } from 'vue';
import { useCompetitions } from '../../hooks/useCompetitions'
import Loader from '../Loader';

const { totalRecords, getCompetitionsHandler, competitions } = useCompetitions();
const currentCompetitions = ref([]);
const limit = ref(3);
const skip = ref(0);
const statusCode = {
  moreThan: 5,
  lessThan: 35
}

getCompetitionsHandler(statusCode, limit.value, skip.value)

watchEffect(() => {
  currentCompetitions.value = [...currentCompetitions.value, ...competitions.value];
});

const isShowMore = computed(() => currentCompetitions.value.length < totalRecords.value)

const loadMore = async() => {
  skip.value = currentCompetitions.value.length
  await getCompetitionsHandler(statusCode, limit.value, skip.value)
}
</script>

<style lang="scss">

</style>