<template>
  <div class="award">
    <span class="award__expires-in">Expires in {{ countdownResult }}</span>
    <div class="award__icon">
      <img src="../../assets/icons/awards/bottle.png" alt="">
    </div>
    <h3 class="award__name">Name of award</h3>
    <h5 class="award__type">Type of reward</h5>
    <div class="award__btn prize">
      <img src="../../assets/icons/achievements/diamond.png" alt="">
      1000
    </div>
    <button class="award__btn claim-button">Claim</button>
  </div>
</template>

<script setup>

import { useCountdown } from '../../hooks/useCountdown';

const countdownResult = useCountdown();

</script>

<style lang="scss" scoped>
@import '../../assets/scss/_variables';

.award {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 34px;
  background-color: $light-grey;
  border-radius: $border-radius;

  &__expires-in {
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: $body-text-color;
  }

  &__icon {
    width: 136px;
    height: 136px;
    border-radius: $border-radius-round;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    & > img {
      width: inherit;
      height: inherit;
    }
  }

  &__name {
    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
    color: $main-text-color-white;
    margin: 5px 0;
  }

  &__type {
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: $body-text-color;
    margin-bottom: 10px;
  }

  &__btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $border-radius;

    > img {
      margin-right: 5px;
    }
  }

  .prize {
    color: $main-text-color-white;
    background-color: $dark-grey;
    cursor: default;
    border: none;
    padding: 5px;
    font-weight: 500;
    font-size: 24px;
    line-height: 29px;
    margin-bottom: 10px;
  }

  .claim-button {
    border: 1px solid $purple;
    background-color: $purple;
    color: $main-text-color-white;
    padding: 10px 57px;
    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
  }
}
</style>