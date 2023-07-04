<template>
  <div class="page-content">
    <h1 class="page-title">Scratchcards</h1>
    <div class="cards-wrapper">
      <ScratchCardsMobileView
          v-if="isMobile"
          :modalStyles="modalStyles"
          :prizes="images"
          class="cards-block"
          @claim="claim"
          @closeModal="closeModal"
          :key="rerenderKey"
      />
      <Scratchcards
          v-else
          :modalStyles="modalStyles"
          :prizes="images"
          class="cards-block"
          @claim="claim"
          @closeModal="closeModal"
          :key="rerenderKey"
      />
      <PrizeOverview
          :prizes="images"
          class="overview-block"
          @scratchAllCards="scratchAllCards"
          :key="rerenderKey"
      />
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
import { useStore } from 'vuex';
import { ref } from 'vue';

const images = [
  { prize: 'first prize', image: firstPrize },
  { prize: 'second prize', image: secondPrize },
  { prize: 'third prize', image: thirdPrize }
]

const modalStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  'z-index': '10'
};

const { isMobile } = useMobileDevice();

const store = useStore();
const rerenderKey = ref(0);

const scratchAllCards = () => {
  store.dispatch('setIsScratchAllCards', true)
}

const claim = () => {
  console.warn('CLAIM');
  rerenderKey.value += 1;
  store.dispatch('setIsScratchAllCards', false);
};

const closeModal = () => {
  console.warn('RETURN');
  rerenderKey.value += 1;
  store.dispatch('setIsScratchAllCards', false);
};
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
    font-family: $mainFont;
    font-size: 37px;
    color: $text-color-white;
    margin-top: 50px;
  }

  .page-description {
    font-family: $semi-bold;
    font-size: 16px;
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
      font-size: 28px;
      color: $text-color-white;
      margin-top: 20px;
    }

    .page-description {
      font-family: $semi-bold;
      font-size: 14px;
      color: $body-text-color;
      padding-top: 10px;
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
