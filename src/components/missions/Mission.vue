<template>
  <div class="m-card">
    <div class="m-card-image">
      <img :src="missionImage" alt="">
    </div>
    <div class="m-info">
      <h3 class="mission-name"> {{ missionItem.name }} </h3>
      <div class="mission-progress">
        <div class="progress">
          <div class="progress-bar"></div>
        </div>
        <div class="progress-value">
          5/20
        </div>
      </div>
      <div class="bottom-section">
        <div class="btn prize">
          <img src="../../assets/icons/achievements/diamond.png" alt="">
          1000</div>
        <button class="btn go-button">go</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import missionImage from '@/assets/images/missions/mission.png';

const props = defineProps({
  mission: Object
});
const missionItem = props.mission;
</script>

<style lang="scss">
@import '../../assets/scss/_variables';

.m-card {
  display: grid;
  grid-template-rows: 65% 35%;
  background-color: $light-grey;

  .m-card-image > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .m-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 12px ;

    .mission-name {
      font-weight: 700;
      font-size: 14px;
      line-height: 17px;
      color: $main-text-color-white;
    }

    .mission-progress {
      display: flex;
      margin-top: 10px;
      width: 100%;

      .progress {
        width: 90%;
        height: 4px;
        background-color: $dark-blue;
        margin: 10px 0;

        .progress-bar {
          height: 100%;
          width: 50%;
          background-color: $purple;
        }
      }

      .progress-value {
        margin-left: 5px;
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        color: $main-text-color-white;
      }
    }

    .bottom-section {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      width: 100%;

      .btn {
        width: 108px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: $border-radius;

        font-weight: 700;
        font-size: 14px;
        line-height: 17px;

        > img {
          margin-right: 5px;
        }
      }

      .prize {
        color: $body-text-color;
        background-color: $dark-grey;
        cursor: default;
        border: none;
      }

      .go-button {
        border: 1px solid $purple;
        color: $main-text-color-white;
      }
    }
  }
}
</style>