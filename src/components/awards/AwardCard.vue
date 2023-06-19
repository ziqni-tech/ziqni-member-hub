<template>
  <div class="award">
    <div class="award__icon">
      <img src="../../assets/icons/awards/bottle.png" alt="">
    </div>
    <h3 class="award__name">{{ award.name }}</h3>
    <h5 class="award__type">{{ award.rewardType.key }}</h5>
    <div class="award__btn prize">
      <img src="../../assets/icons/achievements/diamond.png" alt="">
      {{ award.rewardValue }}
    </div>
    <button class="award__btn claim-button" v-if="!award.claimed">Claim</button>
  </div>
</template>

<script setup>

import { useCountdown } from '@/hooks/useCountdown';
import { ref, watch } from 'vue';

const countdownResult = useCountdown();

const date = ref('');

const props = defineProps({
  award: {
    type: Object,
    required: true
  }
})

watch(countdownResult, (value) => {
  if (value) {
    const { days, hours, minutes, seconds, expired } = value;
    date.value = `${ days }d ${ hours }h ${ minutes }m ${ seconds }s`;
  }
}, { immediate: true });

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
    color: $text-color-white;
    margin: 5px 0;
  }

  &__type {
    max-width: 170px;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: $body-text-color;
    margin-bottom: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
    color: $text-color-white;
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
    background: $btn-gradient-color;
    color: $text-color-white;
    padding: 10px 57px;
    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
  }
}

@media screen and (max-width: $tableWidth) {
  .award {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 20px;
    background-color: $light-grey;
    border-radius: $border-radius;

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
      font-size: 12px;
      line-height: 14px;
      color: $text-color-white;
      margin: 5px 0;
    }

    &__type {
      max-width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
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
      color: $text-color-white;
      background-color: $dark-grey;
      cursor: default;
      border: none;
      padding: 5px;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      margin-bottom: 10px;
    }

    .claim-button {
      width: 100%;
      border: 1px solid $purple;
      background: $btn-gradient-color;
      color: $text-color-white;
      padding: 6px;
      font-weight: 700;
      font-size: 12px;
      line-height: 14px;
    }
  }
}
</style>