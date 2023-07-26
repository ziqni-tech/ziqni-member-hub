<template>
  <div class="missions">
    <CurrentMissionsSection />
  </div>
<!--  <FeaturedMissionsSection  />-->
</template>

<script setup>
import FeaturedMissionsSection from '../../components/missions/FeaturedMissionsSection';
import CurrentMissionsSection from '../../components/missions/CurrentMissionsSection';


</script>

<style scoped lang="scss">
.missions {
  width: 100%;
  height: 100%;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0;
  }
}
</style>