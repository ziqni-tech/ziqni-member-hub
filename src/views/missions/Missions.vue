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
  padding: 0 20px;

  &::-webkit-scrollbar {
    width: 0;
  }
}
@media screen and (max-width: 820px) {
  .missions {
    padding: 0;
  }
}
</style>