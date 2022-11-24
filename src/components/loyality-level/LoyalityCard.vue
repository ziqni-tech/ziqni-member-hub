<template>
  <div class="loyality-card">
    <div class="loyality-card__title">Loyality</div>
    <img class="loyality-card__level" :src="$options.loyaltyCardLevel" alt="">
    <img class="loyality-card__circles" :src="$options.loyaltyCardCircles" alt="">
  </div>
</template>

<script>
import loyaltyCardLevel from '../../assets/images/loyalty-card-level.png';
import loyaltyCardCircles from '../../assets/images/loyalty-card-circles.png';
export default {
  name: 'LoyalityCard',
  loyaltyCardLevel,
  loyaltyCardCircles
};
</script>

<style lang="scss">
.loyality-card {
  position: relative;
  padding: 25px 43px;

  width: 636px;
  height: 385px;

  background: #FFFFFF;
  box-shadow: 0 7px 21px rgba(180, 180, 180, 0.25);
  border-radius: 14px;

  &__title {
    font-family: 'DM Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 30px;
    line-height: 39px;
    color: #242731;
    text-align: start;
  }

  &__level {
    position: absolute;
    top: 42%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }

  &__circles {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>