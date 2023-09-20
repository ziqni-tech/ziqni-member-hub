<template>
  <div class="m-card" :class="{'light-mode': !isDarkMode}">
    <div class="expires-in">{{ date }}</div>
    <div class="m-card-image">
      <img :src="missionBannerLink" alt="">
<!--      <div class="expires-in">{{ date }}</div>-->
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
import defaultBanner from '@/assets/images/missions/mission.svg';
import { computed, ref, watch } from 'vue';

const props = defineProps({
  mission: Object,
  isDarkMode: Boolean
});
const missionItem = props.mission;

const countdownResult = useCountdown(missionItem.scheduling.endDate);

const date = ref('');

const missionBannerLink = computed(() => {
  if (missionItem.bannerLink) {
    return missionItem.bannerLink
  } else if (!missionItem.bannerLink && missionItem.bannerHighResolutionLink) {
    return missionItem.bannerHighResolutionLink
  } else if (!missionItem.bannerLink && !missionItem.bannerHighResolutionLink && missionItem.bannerLowResolutionLink) {
    return missionItem.bannerLowResolutionLink
  } else {
    return defaultBanner
  }
});

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
  position: relative;

  .expires-in {
    position: absolute;
    top: 16px;
    right: -10px;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $border-radius-sm;
    background: $expires-in-bg;
    padding: 8px 16px;
    color: $white-color-DM;
    font-family: $medium;
    font-size: 12px;

    @media screen and (max-width: $tableWidth) {
      right: 0;
      font-size: 10px;
    }
  }

  .m-card-image {
    position: relative;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    overflow: hidden;
    width: 100%;
    height: 230px;
    object-fit: cover;

    @media screen and (max-width: $tableWidth) {
      height: 140px;
      > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .m-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    padding: 14px 12px 10px;
    font-family: $semi-bold;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    overflow: hidden;
    background-color: $card-bg-DM;

    .mission-name {
      font-size: 14px;
      font-family: $bold;
      color: $white-color-DM;

      @media screen and (max-width: $tableWidth) {
        font-size: 12px;
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
        background-color: $progress-bg-DM;
        margin: 10px 0;

        .progress-bar {
          height: 100%;
          width: 50%;
          background: $blue-gradient;
          border-radius: $border-radius-sm;
        }
      }

      .progress-value {
        margin-left: 5px;
        font-size: 12px;
        font-family: $medium;
        color: $white-color-DM;

        @media screen and (max-width: $tableWidth) {
          font-size: 10px;
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

        font-size: 14px;

        > img {
          margin-right: 5px;
        }

        @media screen and (max-width: $tableWidth) {
          width: 100%;

          font-size: 12px;

          &:last-child {
            margin-top: 5px;
          }
        }
      }

      .prize {
        color: $prize-btn-color-DM;
        background-color: $prize-btn-bg-DM;
        cursor: default;
        border: none;
        min-height: 35px;
        margin-bottom: 5px;
        font-size: 14px;
        font-family: $bold;

        > img {
          height: 25px;
          object-fit: cover;
        }
      }

      .go-button {
        border: 1px solid $btn-border-color-LM;
        background: $btn-primary-bg-color-LM;
        color: $white-color-DM;
        font-size: 14px;
        font-family: $bold;
      }
    }
  }

  &.light-mode {

    .m-card-image {
      position: relative;
      height: 230px;
      object-fit: cover;

      @media screen and (max-width: $tableWidth) {
        height: 140px;
        > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .expires-in {
        position: absolute;
        top: 16px;
        right: -10px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: $border-radius-sm;
        background: $expires-in-bg;
        padding: 8px 16px;
        color: $btn-primary-color-LM;
        font-family: $medium;
        font-size: 12px;

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
      background-color: $card-bg-LM;

      .mission-name {
        font-size: 14px;
        color: $btn-secondary-color-LM;
        font-family: $bold;

        @media screen and (max-width: $tableWidth) {
          font-size: 12px;
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
          background-color: $bg-body-LM;
          margin: 10px 0;

          .progress-bar {
            height: 100%;
            width: 50%;
            background: $blue-gradient;
            border-radius: $border-radius-sm;
          }
        }

        .progress-value {
          margin-left: 5px;
          font-size: 12px;
          color: $card-title-color-LM;
          font-family: $medium;

          @media screen and (max-width: $tableWidth) {
            font-size: 10px;
            line-height: 12px;
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

          font-size: 14px;

          > img {
            margin-right: 5px;
          }

          @media screen and (max-width: $tableWidth) {
            width: 100%;

            &:last-child {
              margin-top: 5px;
            }
          }
        }

        .prize {
          color: $card-title-color-LM;
          background-color: $btn-prize-bg-color-LM;
          cursor: default;
          border: none;
          min-height: 35px;
          margin-bottom: 5px;
          font-family: $medium;

          @media screen and (max-width: $tableWidth) {
            font-size: 16px;
          }

          > img {
            height: 25px;
            object-fit: cover;
          }
        }

        .go-button {
          border: 1px solid $btn-border-color-LM;
          background: $btn-primary-bg-color-LM;
          color: $btn-primary-color-LM;
          font-family: $bold;

          @media screen and (max-width: $tableWidth) {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>