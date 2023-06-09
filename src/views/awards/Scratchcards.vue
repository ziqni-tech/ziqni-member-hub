<template>
  <div class="page-content">
    <h1 class="page-title">Scratchcards</h1>
    <Scratchcards :prizes="images" class="scratch-cards-block" />
  </div>
</template>

<script setup>
import Scratchcards from '@/components/awards/ScratchCards'
import PrizeOverview from '@/components/awards/PrizeOverview.vue';

import firstPrize from '@/assets/images/instant-wins/first_prize.png'
import secondPrize from '@/assets/images/instant-wins/second_prize.png'
import thirdPrize from '@/assets/images/instant-wins/third_prize.png'

const images = [
  {prize: 'first prize', image: firstPrize},
  {prize: 'second prize', image: secondPrize},
  {prize: 'third prize', image: thirdPrize},

];

</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables';
.page-content {
  display: flex;
  flex-direction: column;
  align-items: center;

  .page-title {
    font-weight: 700;
    font-size: 24px;
    line-height: 29px;
    color: $main-text-color-white;
    margin-top: 50px;
  }

  .page-description {
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: $body-text-color;
    padding-top: 10px;
  }
}

@media screen and (max-width: $tableWidth) {
  .page-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    .page-title {
      display: none;
      font-weight: 700;
      font-size: 16px;
      line-height: 19px;
      color: $main-text-color-white;
      margin-top: 20px;
    }

    .page-description {
      font-weight: 400;
      font-size: 14px;
      line-height: 17px;
      color: $body-text-color;
      padding-top: 10px;
    }
  }
}
</style>