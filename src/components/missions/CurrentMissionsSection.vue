<template>
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">Current Missions</h2>
      <ActionsBlock />
    </div>
    <div class="cards-grid">
      <div class="card-wrapper" v-for="card in 7">
        <MissionCard />
      </div>
    </div>
  </div>
</template>

<script>
import ActionsBlock from '../../shared/components/actions-block/ActionsBlock';
import MissionCard from './MissionCard';
export default {
  name: 'CurrentMissionsSection',
  components: { MissionCard, ActionsBlock }
};
</script>

<style lang="scss">

</style>