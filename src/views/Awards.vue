<template>
  <h1 class="section-title">History</h1>
  <AchievementsList :achievements="achievements" />
</template>

<script setup>
import AchievementsList from '../components/achievements/AchievementsList';
import { useGetAchievements } from '../hooks/useGetAchievements';

const { achievements, getAchievementsRequest } = useGetAchievements();

getAchievementsRequest();

</script>

<style scoped>

</style>