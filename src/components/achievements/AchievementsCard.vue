<template>
  <div class="achievements-card">
    <div class="top-section">
      <div class="left-section">
        <div class="icon">
          <img src="../../assets/icons/achievements/book.png" alt="">
        </div>
      </div>
      <div class="right-section">
        <div class="title">
          {{ achievement.name }}
        </div>
        <div class="achievements-progress">
          <div class="progress">
            <div class="progress-bar"></div>
          </div>
          <div class="progress-value">
            5/20
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-section">
      <div class="btn prize">
        <img src="../../assets/icons/achievements/diamond.png" alt="">
        1000
      </div>
      <button class="btn go-button">go</button>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  achievement: Object
})

</script>

<style lang="scss">
@import '../../assets/scss/_variables';

.achievements-card {
  width: 100%;
  background-color: $light-grey;
  border-radius: $border-radius;
  padding: 10px 16px 14px;

  .top-section {
    display: flex;
    border-bottom: 1px solid $border-dark;
    padding-bottom: 14px;
  }

  .left-section {
    width: 20%;
    
    .icon {
      width: 74px;
      height: 74px;
      border-radius: $border-radius-round;
      border: 1px solid $border-dark;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .right-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 0 0 20px;
    
    .title {
      font-weight: 700;
      font-size: 14px;
      line-height: 17px;
      color: $main-text-color-white;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .achievements-progress {
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
  }

  .bottom-section {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;

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
</style>