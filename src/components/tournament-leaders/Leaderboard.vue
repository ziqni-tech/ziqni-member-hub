<template>
  <div class="leader-board">
    <div class="leader-board__header">
      <span>Player</span>
      <span># Tournaments Played</span>
      <span>Score</span>
    </div>
    <div class="leaderboard-items">
      <div class="leaderboard-items__item-wrapper" v-for="(item, index) in leaderboard">
        <LeaderboardItem :item="item" :idx="index" :key="index" />
      </div>
    </div>
  </div>
</template>

<script setup>
import LeaderboardItem from './LeaderboardItem';
const props = defineProps({ leaderboard: Array });

</script>

<style lang="scss">
@import '../../assets/scss/utils/vars';
.leader-board {
  width: 1035px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .leaderboard-items {
    width: 100%;
    height: 400px;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    align-items: center;

    &::-webkit-scrollbar {
      height: 7px;
      width: 0;
      background-color: $primary-bg-dark-LM;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: $scrollbar-color;
    }

    &__item-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }

  &__header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 19px 14px 17px;

    font-family: $mainFont;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 27px;
    color: $sts-grey-medium;
  }
}
@media screen and (max-width: $phoneWidth) {
  .leader-board {
    width: 100%;

    .leaderboard-items {
      height: 340px;
    }

    &__header {
      padding: 7px 5px;
      font-size: 14px;
      line-height: 17px;
    }
  }
}
</style>