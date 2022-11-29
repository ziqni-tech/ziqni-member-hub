<template>
  <div class="page-container">
    <div class="header">
      <h1 class="title">{{ 'World cup 2022🏆' }} 😝</h1>
      <img class="share-icon" :src="$options.shareIcon" />
    </div>
    <MissionDetailsCard />

  </div>
</template>

<script>
import shareIcon from '../assets/icons/share-icon.svg';
import MissionDetailsCard from '../components/missions/MissionDetailsCard';
export default {
  name: 'MissionDetails',
  components: { MissionDetailsCard },
  shareIcon
};
</script>

<style lang="scss">
.page-container {

  .header {
    display: flex;
    justify-content: start;
    padding-top: 46px;
    background: none;
    border: none;

    .title {
      font-family: 'Montserrat';
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
}
</style>