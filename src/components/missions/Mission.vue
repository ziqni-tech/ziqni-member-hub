<template>
  <div class="m-card">
    <div class="m-card-image">
      <img :src="missionImage" alt="">
      <div class="expires-in">{{ date }}</div>
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
          <img :src="mission.icon" alt="">
          {{ mission.rewardValue }}
        </div>
        <button class="btn go-button" @click="goToMissionsMapPage">go</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useCountdown } from '@/hooks/useCountdown';
import missionImage from '@/assets/images/missions/mission.png';
import { ref, watch } from 'vue';

const props = defineProps({
  mission: Object
});
const missionItem = props.mission;

const countdownResult = useCountdown(missionItem.scheduling.endDate);

const date = ref('');

watch(countdownResult, (value) => {
  if (value) {
    const { days, hours, minutes, seconds, expired } = value;
    date.value = `${ days }d ${ hours }h ${ minutes }m ${ seconds }s`;
  }
}, { immediate: true });

const router = useRouter();
const goToMissionsMapPage = () => {
  router.push({
    name: 'MissionsMap',
    params: {
      id: missionItem.id,
    }
  });
};

</script>

<style lang="scss">
@import '@/assets/scss/_variables';

.m-card {
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
      background: $btn-gradient-color;
      padding: 8px 16px;
      color: $text-color-white;
      font-family: $semi-bold;
      font-size: 16px;

      @media screen and (max-width: $tableWidth) {
        right: 0;
        font-size: 12px;
      }
    }
  }

  .m-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    padding: 14px 12px 10px;
    font-family: $semi-bold;

    .mission-name {
      font-size: 16px;
      color: $text-color-white;

      @media screen and (max-width: $tableWidth) {
        font-size: 16px;
      }
    }

    .mission-progress {
      display: flex;
      align-items: center;
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
        font-size: 12px;
        color: $text-color-white;

        @media screen and (max-width: $tableWidth) {
          //font-weight: 500;
          //font-size: 10px;
          //line-height: 12px;
        }
      }
    }

    .bottom-section {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      width: 100%;

      @media screen and (max-width: $tableWidth) {
        justify-content: center;
        flex-wrap: wrap;
      }

      .btn {
        width: 108px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: $border-radius;

        font-size: 16px;

        > img {
          margin-right: 5px;
        }

        @media screen and (max-width: $tableWidth) {
          width: 100%;

          font-size: 16px;

          &:last-child {
            margin-top: 5px;
          }
        }
      }

      .prize {
        color: $body-text-color;
        background-color: $dark-grey;
        cursor: default;
        border: none;
        min-height: 35px;
        margin-bottom: 5px;
      }

      .go-button {
        border: 1px solid $purple;
        background: $btn-gradient-color;
        color: $text-color-white;
      }
    }
  }
}
</style>