<template>
  <div class="m-card">
    <div class="m-card-image">
      <img :src="missionImage" alt="">
      <div class="expires-in">{{ countdownResult }}</div>
    </div>
    <div class="m-info">
      <h3 class="mission-name"> {{ missionItem.name }} </h3>
      <div class="mission-progress">
        <div class="progress">
          <div class="progress-bar" :style="{ width: missionItem.percentageComplete + '%' }"></div>
        </div>
        <div class="progress-value">
          {{ missionItem.percentageComplete }}%
        </div>
      </div>
      <div class="bottom-section">
        <div class="btn prize">
          <img src="../../assets/icons/achievements/diamond.png" alt="">
          1000
        </div>
        <button class="btn go-button" @click="goToMissionDetailsPage">go</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useCountdown } from '@/hooks/useCountdown';
import missionImage from '@/assets/images/missions/mission.png';

const props = defineProps({
  mission: Object
});
const missionItem = props.mission;

const countdownResult = useCountdown(missionItem.scheduling.endDate);

const router = useRouter();
const goToMissionDetailsPage = () => {
  router.push({
    name: 'MissionDetails',
    params: {
      id: missionItem.id,
    }
  });
};

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

  .m-card-image {
    position: relative;

    .expires-in {
      position: absolute;
      top: 16px;
      right: -10px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: $border-radius-sm;
      background-color: $purple-light;
      padding: 8px 16px;
      color: $main-text-color-white;
    }
  }

  .m-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    padding: 14px 12px 10px;

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
          background: $purple-gradient;
          border-radius: $border-radius-sm;
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
        background-color: $purple;
        color: $main-text-color-white;
      }
    }
  }
}
</style>