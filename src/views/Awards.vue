<template>
  <div class="awards-cards-grid">
    <div v-for="awards in 8">
      <AwardCard />
    </div>
  </div>
</template>

<script setup>
import AchievementsList from '../components/achievements/AchievementsList';
import { useGetAchievements } from '../hooks/useGetAchievements';
import AwardCard from '../components/awards/AwardCard';

const { achievements, getAchievementsRequest } = useGetAchievements();

getAchievementsRequest();

</script>

<style lang="scss" scoped>
.awards-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  grid-gap: 15px;
}
</style>