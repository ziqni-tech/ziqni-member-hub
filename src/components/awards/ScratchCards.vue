<template>
  <div class="scratch-cards">
    <div class="scratch-cards-block">
      <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="scratch-cards-row">
        <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell">
          <ScratchCardsItem :img="cell.image" @scratched="updateScratchedCells"/>
        </div>
      </div>
    </div>
    <PrizeOverview :prizes="prizes" class="prize-overview-block"/>
  </div>
  <AwardsModal
      :modalShow="isShowModal"
      :message="message"
      :title="titleMessage"
      :btnLabel="btnTitle"
      @doFunction="isWinner ? claim() : closeModal()"
      v-on:toggle-modal="isShowModal = false"
  />
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import ScratchCardsItem from '@/components/awards/ScratchCardsItem.vue';
import PrizeOverview from '@/components/awards/PrizeOverview.vue';
import AwardsModal from '@/components/awards/AwardsModal.vue';
import { useStore } from 'vuex';

const props = defineProps({
  prizes: Array
});

const store = useStore();

const isAutoScratchAll = computed(() => store.getters.getIsScratchAll);

const prizes = props.prizes.map(item => item.image);

const grid = reactive(createGrid());
const scratchedCells = ref(0);

const allCardsScratched = computed(() => scratchedCells.value === grid.length * grid[0].length);

const isShowModal = ref(false);
const titleMessage = ref('');
const message = ref('');
const btnTitle = ref('');
const isWinner = ref(false);

function createGrid() {
  const grid = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      row.push({ image: getRandomImage(), scratched: false });
    }
    grid.push(row);
  }
  return grid;
}

function getRandomImage() {
  return prizes[Math.floor(Math.random() * props.prizes.length)];
}

const updateScratchedCells = () => {
  scratchedCells.value = scratchedCells.value + 1;
};

const done = (prize) => {
  if (prize !== 'Next time') {
    titleMessage.value = 'Congratulations!';
    message.value = `You won ${ prize }`;
    btnTitle.value = 'Claim';
    isWinner.value = true;
  } else {
    titleMessage.value = 'Didn\'t win this time!';
    message.value = `Wishing you better luck in the future`;
    btnTitle.value = 'Return';
    isWinner.value = false;
  }

  isShowModal.value = true;
};

watch(allCardsScratched, (value) => {
  if (value) {
    const prizes = props.prizes;
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const prize = prizes[randomIndex];

    store.dispatch('setIsScratchAllCards', true);
    done(prize.prize);
  }
});

watch(isAutoScratchAll, (value) => {
  if (value) {
    const prizes = props.prizes;
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const prize = prizes[randomIndex];

    done(prize.prize);
  }
});

const claim = () => {
  console.warn('CLAIM');
  isShowModal.value = false;
};

const closeModal = () => {
  console.warn('RETURN');
  isShowModal.value = false;
};

</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables';

.scratch-cards {
  display: flex;
  margin-top: 50px;

  .scratch-cards-block {
    margin-right: 50px;

    .scratch-cards-row {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }

    .cell {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      margin: 0 10px;
      border: 1px solid #406A8C;
      box-shadow: 0 2px 12px rgba(64, 106, 140, 0.5);
      border-radius: $border-radius;
      overflow: hidden;
    }
  }

  .prize-overview-block {
    margin-left: 50px;
  }
}

</style>