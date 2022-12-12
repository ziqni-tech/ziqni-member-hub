<template>
  <CurrentTournamentsSection />
  <FeatureTournamentsSection />
</template>

<script>
import CurrentTournamentsSection from '../../components/tournaments/CurrentTournamentsSection';
import FeatureTournamentsSection from '../../components/tournaments/FeatureTournamentsSection';

export default {
  name: 'Tournaments',
  components: {
    FeatureTournamentsSection,
    CurrentTournamentsSection,
  },
}
</script>

<style lang="scss">

</style>