<template>
  <div class="section-header">
    <h1 class="section-title">Loyalty Store</h1>
    <ActionsBlock />
  </div>
  <div class="tournament-cards">
    <div v-for="(card, index) in 7" class="tournament-card-wrapper">
      <LoyalityStoreCard :key="index"/>
    </div>
  </div>
</template>

<script setup>
import LoyalityStoreCard from '../components/LoyalityStoreCard';
import ActionsBlock from '../shared/components/actions-block/ActionsBlock';

</script>

<style scoped>

</style>