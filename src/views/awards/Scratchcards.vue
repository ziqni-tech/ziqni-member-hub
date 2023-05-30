<template>
  <div class="page-content">
    <h1 class="page-title">Scratchcards</h1>
    <div class="scratch-cards">
      <Scratchcards :prizes="images" class="scratch-cards-block" />
      <PrizeOverview :prizes="images" class="prize-overview-block" />
    </div>
  </div>
</template>

<script setup>
import Scratchcards from '@/components/awards/ScratchCards'
import PrizeOverview from '@/components/awards/PrizeOverview.vue';

import firstPrize from '@/assets/images/instant-wins/first_prize.png'
import secondPrize from '@/assets/images/instant-wins/second_prize.png'
import thirdPrize from '@/assets/images/instant-wins/third_prize.png'

const images = [
  firstPrize,
  secondPrize,
  thirdPrize
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

  .scratch-cards {
    display: flex;
    margin-top: 50px;

    .scratch-cards-block {
      margin-right: 50px;
    }

    .prize-overview-block {
      margin-left: 50px;
    }

  }
}
</style>