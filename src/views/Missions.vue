<template>
  <div class="page-container">
    <FeaturedMissionsSection />
    <CurrentMissionsSection />
  </div>
</template>

<script>
import { CContainer } from '@coreui/vue';
import FeaturedMissionsSection from '../components/missions/FeaturedMissionsSection';
import CurrentMissionsSection from '../components/missions/CurrentMissionsSection';


export default {
  name: 'Missions',
  components: {
    CurrentMissionsSection,
    FeaturedMissionsSection,
    CContainer,
  }
};
</script>

<style lang="scss">
.page-container {
  padding: 21px 42px;
}
</style>