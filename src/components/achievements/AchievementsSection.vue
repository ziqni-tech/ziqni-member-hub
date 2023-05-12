<template>
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">Achievements</h2>
    </div>
    <div :class="isDashboard ? 'achievements-dashboard-cards-grid' : 'achievements-cards-grid'">
      <div v-for="c in count">
        <AchievementsCard />
      </div>
    </div>
  </div>
</template>

<script setup>
import AchievementsCard from './AchievementsCard';

const props = defineProps({
  isDashboard: {
    type: Boolean,
    default: false
  }
});

const count = props.isDashboard ? 2 : 5
</script>

<style lang="scss">
.achievements-dashboard-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  grid-gap: 15px;
}
.achievements-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  grid-gap: 15px;
}
</style>