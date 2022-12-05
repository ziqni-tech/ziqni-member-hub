<template>
  <div class="loyality-card">
    <div class="loyality-card__title">Loyality</div>
    <img class="loyality-card__level" :src="loyaltyCardLevel" alt="">
    <img class="loyality-card__circles" :src="loyaltyCardCircles" alt="">
  </div>
</template>

<script setup>
import loyaltyCardLevel from '../../assets/images/loyalty-card-level.png';
import loyaltyCardCircles from '../../assets/images/loyalty-card-circles.png';
</script>

<style lang="scss">
@import '../../assets/scss/utils/vars';
.loyality-card {
  position: relative;
  padding: 25px 43px;

  width: 636px;
  height: 385px;

  background: #FFFFFF;
  box-shadow: 0 7px 21px rgba(180, 180, 180, 0.25);
  border-radius: 14px;

  &__title {
    font-family: 'Poppins', sans-serif;
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

  @media screen and (max-width: $phoneWidth) {
    width: 342px;
    height: 207px;
    padding: 11px 23px;

    &__title {
      position: absolute;
      top: 11px;
      left: 23px;
      z-index: 3;
      font-family: 'Poppins', sans-serif;
      font-style: normal;
      font-weight: 700;
      font-size: 18px;
      line-height: 22px;
      color: #242731;
      text-align: start;
    }

    &__level {
      position: absolute;
      top: 42%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      width: 188px;
    }

    &__circles {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 290px;
    }
  }
}
</style>