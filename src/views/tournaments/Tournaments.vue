<template>
  <div class="tournaments">
    <CurrentTournamentsSection />
    <FutureTournamentsSection />
  </div>

</template>

<script setup>
import CurrentTournamentsSection from '../../components/tournaments/CurrentTournamentsSection';
import FutureTournamentsSection from '../../components/tournaments/FutureTournamentsSection';

</script>

<style scoped lang="scss">
.tournaments {
  width: 100%;
  height: 100%;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0;
  }
}
</style>