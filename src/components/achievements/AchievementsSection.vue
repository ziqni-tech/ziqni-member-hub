<template>
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">Achievements</h2>
    </div>
    <div class="achievements-cards-grid">
      <AchievementsCard />
      <AchievementsCard />
    </div>
  </div>
</template>

<script setup>
import AchievementsCard from './AchievementsCard';

</script>

<style lang="scss">
.achievements-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  grid-gap: 15px;
}
</style>