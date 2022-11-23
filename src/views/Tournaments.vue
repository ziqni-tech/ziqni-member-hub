<template>
  <div class="page-container">
    <CurrentTournamentsSection />
    <FeatureTournamentsSection />
  </div>
</template>

<script>
import CurrentTournamentsSection from '../components/tournaments/CurrentTournamentsSection';
import FeatureTournamentsSection from '../components/tournaments/FeatureTournamentsSection';

export default {
  name: 'Tournaments',
  components: {
    FeatureTournamentsSection,
    CurrentTournamentsSection,
  },
}
</script>

<style lang="scss">
.page-container {
  padding: 21px 42px;
}
</style>