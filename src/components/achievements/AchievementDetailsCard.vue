<template>
  <div class="achievements-details-card">
    <div class="title">
      {{ achievement.name }}
    </div>
    <div class="icon">
      <img :src="defaultIcon" alt="">
    </div>
    <div class="achievements-progress-wrapper">
      <span class="progress-title">Progress</span>
      <div class="achievements-progress">
        <div class="progress">
          <div class="progress-bar" :style="{ width: achievement.percentageComplete + '%' }"></div>
        </div>
        <div class="progress-value">
          {{ achievement.percentageComplete }}%
        </div>
      </div>
    </div>
    <div class="description">
      <span class="description-title">Description</span>
      <span class="description-value" >
        {{ achievement.description ? achievement.description : testDescription }}
      </span>
    </div>
    <div class="bottom-section">
      <div class="prize-btn">
        <img src="@/assets/icons/achievements/diamond.png" alt="">
        1000
      </div>
      <button class="action-btn">Leave</button>
    </div>
  </div>
</template>

<script setup>

import defaultIcon from '@/assets/icons/achievements/book.png'
import { ref } from 'vue';

const props = defineProps({
  achievement: Object
})

const testDescription = ref('Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.')

console.warn('PROS', props.achievement);
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables';

.achievements-details-card {
  max-width: 840px;
  background-color: $light-grey;
  border-radius: $border-radius;
  padding: 10px 25px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;


  .title {
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    color: $main-text-color-white;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-top: 30px;
  }

  .icon {
    width: 100px;
    height: 100px;
    padding-top: 20px;

    > img {
      width: inherit;
      height: inherit;
    }
  }

  .achievements-progress-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 50px;
    text-align: start;

    .progress-title {
      text-align: start;
      width: 100%;
      font-weight: 700;
      font-size: 14px;
      line-height: 17px;
      color: $main-text-color-white;
      padding-top: 20px;
    }

    .achievements-progress {
      display: flex;
      width: 100%;

      .progress {
        width: 90%;
        height: 4px;
        background-color: $dark-blue;
        margin: 10px 0;

        .progress-bar {
          height: 100%;
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
  }

  .description {
    display: flex;
    flex-direction: column;

    .description-title {
      text-align: start;
      width: 100%;
      font-weight: 700;
      font-size: 14px;
      line-height: 17px;
      color: $main-text-color-white;
      padding-top: 20px;
    }

    .description-value {
      text-align: start;
      width: 100%;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      color: $main-text-color-white;
      padding-top: 14px;
    }
  }

  .bottom-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 30px;

    .action-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 57px;

      background: $purple-gradient;
      border-radius: 10px;
      border: 1px solid $purple;
      color: $main-text-color-white;
    }

    .prize-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 57px;

      background: $dark-grey;
      border-radius: 10px;
      border: 1px solid $dark-grey;
      color: $main-text-color-white;

      > img {
        margin-right: 10px;
        width: 20px;
        height: 20px;
      }
    }
  }

}
</style>