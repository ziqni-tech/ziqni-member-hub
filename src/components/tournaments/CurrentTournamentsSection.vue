<template>
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">Current Tournaments</h2>
      <ActionsBlock/>
    </div>
    <Loader v-if="isLoading" :title="'Current Tournaments are loading'" />
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
import { computed, ref, watchEffect } from 'vue';

import NotFoundItems from '../NotFoundItems';
import { useGetAwards } from '../../hooks/useGetAwards';
import { useCompetitions } from '../../hooks/useCompetitions';
import { rewardFormatter } from '../../utils/rewardFormatter';
import TournamentCard from '../../components/tournaments/TournamentCard';
import ActionsBlock from '../../shared/components/actions-block/ActionsBlock';
import Loader from '../Loader';

const props = defineProps({
  isDashboard: {
    type: Boolean,
    default: false
  }
});

const {
  totalRecords,
  getCompetitionsHandler,
  competitions,
  isLoaded,
  isLoading,
  error
} = useCompetitions();

const currentCompetitions = ref([]);
const limit = ref(3);
const skip = ref(0);
const statusCode = {
  moreThan: 20,
  lessThan: 30
}

const { getAvailableAwards, awards } = useGetAwards();

const tournamentRequestData = {
  type: 'current',
  statusCode,
  limit: limit.value,
  skip: skip.value,
  ids: []
}

getCompetitionsHandler(tournamentRequestData);

watchEffect(() => {
  currentCompetitions.value = [...currentCompetitions.value, ...competitions.value];
});

watchEffect( () => {
  currentCompetitions.value.map( async (item) => {
    await getAvailableAwards([item.id]);
  })
})

watchEffect(() => {
  if (awards.value) {
    console.warn('IF AWARDS', awards.value);
    awards.value.map(item => {
      console.log('rewardFormatter(item)', rewardFormatter(item));
      return rewardFormatter(item);
    })
  }
})

const isShowMore = computed(() => currentCompetitions.value.length < totalRecords.value)

const loadMore = async() => {
  tournamentRequestData.skip = currentCompetitions.value.length;
  await getCompetitionsHandler(tournamentRequestData)
}
</script>

<style lang="scss">

</style>