<template>
  <div class="scratch-cards">
    <div class="scratch-cards-block">
      <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="scratch-cards-row">
        <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell">
          <ScratchCardsItem ref="scratchCardsItemRef" :img="cell.image" />
        </div>
      </div>
      <button @click="scratchAll" >clear</button>
      <div v-if="hasPrize" class="prize">Congratulations! You won a prize!</div>
    </div>
    <PrizeOverview :prizes="prizes" class="prize-overview-block" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import ScratchCardsItem from '@/components/awards/ScratchCardsItem.vue';
import PrizeOverview from '@/components/awards/PrizeOverview.vue';

const props = defineProps({
  prizes: Array
})

const grid = reactive(createGrid());
const scratchedCells = ref(0);

const scratchCardsItemRef = ref(null)

const hasPrize = computed(() => scratchedCells.value > 2);

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
  return props.prizes[Math.floor(Math.random() * props.prizes.length)];
}

const scratchAll = () => {
  const scratchCardsItem = scratchCardsItemRef.value
  console.warn('scratchCardsItemRef', scratchCardsItem);
  scratchCardsItemRef.value.autoScratching();
}

</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables';
.scratch-cards {
  display: flex;
  margin-top: 50px;

  .scratch-cards-block {
    margin-right: 50px;

    .scratch-cards-row{
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