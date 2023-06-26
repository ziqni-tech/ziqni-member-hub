<template>
  <div class="page-content">
    <h1 class="page-title">Scratchcards</h1>
    <div class="cards-wrapper">
      <ScratchCardsMobileView v-if="isMobile" :prizes="images" class="cards-block"  />
      <Scratchcards v-else :prizes="images" class="cards-block" />
      <PrizeOverview :prizes="images" class="overview-block" />
    </div>
  </div>
</template>

<script setup>
import useMobileDevice from '@/hooks/useMobileDevice';
import Scratchcards from '@/components/awards/ScratchCards'
import PrizeOverview from '@/components/awards/PrizeOverview'

import firstPrize from '@/assets/images/instant-wins/first_prize.png'
import secondPrize from '@/assets/images/instant-wins/second_prize.png'
import thirdPrize from '@/assets/images/instant-wins/third_prize.png'
import ScratchCardsMobileView from '@/components/awards/ScratchCardsMobileView.vue';

const images = [
  { prize: 'first prize', image: firstPrize },
  { prize: 'second prize', image: secondPrize },
  { prize: 'third prize', image: thirdPrize }
]

const { isMobile } = useMobileDevice();
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables';

.page-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  .page-title {
    font-weight: 700;
    font-size: 24px;
    line-height: 29px;
    color: $text-color-white;
    margin-top: 50px;
  }

  .page-description {
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: $body-text-color;
    padding-top: 10px;
  }

  .cards-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
  }

  .cards-block {
    margin-right: 50px;
  }

  .overview-block {
    margin-left: 50px;
  }
}

@media screen and (max-width: 820px) {
  .page-content {
    justify-content: center;
    .page-title {
      display: none;
      font-weight: 700;
      font-size: 16px;
      line-height: 19px;
      color: $text-color-white;
      margin-top: 20px;
    }

    .cards-wrapper {
      flex-direction: column;
      align-items: center;
      width: 100%;
      margin-top: 0;

      .cards-block {
        margin-right: 0;
        margin-bottom: 15px;

        .scratch-cards-row {
          display: flex;
          justify-content: center;
        }

        .cell {
          margin: 0 10px;
        }
      }

      .overview-block {
        margin-top: 20px;
        margin-left: 0;
      }
    }
  }
}
</style>
