<template>
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">Current Tournaments</h2>
      <ActionsBlock/>
    </div>
    <div class="tournament-cards" v-if="currentCompetitions">
      <div v-for="c in currentCompetitions" class="tournament-card-wrapper">
        <TournamentCard :key="c.id" :card="c"/>
      </div>
    </div>
    <NotFoundItems v-else :title="'Current Tournaments'" />
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

const { totalRecords, getCompetitionsHandler, competitions } = useCompetitions();
const currentCompetitions = ref([]);
const limit = ref(3);
const skip = ref(0);
const statusCode = {
  moreThan: 20,
  lessThan: 30
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