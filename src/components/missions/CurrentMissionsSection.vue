<template>
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">Current Missions</h2>
      <ActionsBlock />
    </div>
    <div class="tournament-cards">
      <div >
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
.tournament-cards, .missions-cards {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  overflow: hidden;
  overflow-x: scroll;

  &::-webkit-scrollbar {
    height: 7px;
    width: 7px;
    background-color: #f0f0f0;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #8a8a8a;
  }
}
</style>