<template>
  <div class="header">
    <h1 class="title">{{ 'World cup 2022🏆' }} 😝</h1>
    <img class="share-icon" :src="shareIcon" />
  </div>
  <MissionDetailsCard />
</template>

<script setup>
import shareIcon from '../assets/icons/share-icon.svg';
import MissionDetailsCard from '../components/missions/MissionDetailsCard';

</script>

<style lang="scss">
.header {
  display: flex;
  justify-content: flex-start;
  padding-top: 46px;
  background: none;
  border: none;

  .title {
    font-family: 'Montserrat', sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 27px;
    color: #737478;
  }

  .share-icon {
    height: 30px;
    width: 30px;
    margin-left: 18px;
  }
}
</style>