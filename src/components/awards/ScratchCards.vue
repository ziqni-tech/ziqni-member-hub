<template>
  <div>
    <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="row">
      <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell" @click="scratchCell(rowIndex, colIndex)">
<!--        <ScratchCardsItem :img="cell.image" />-->
<!--        <div class="scratch-container">-->
<!--          <img :src="cell.image" alt="Prize Image" class="image" />-->
<!--        </div>-->
<!--        <canvas class="scratch-card" width="80px" height="80px"></canvas>-->
        <img v-if="cell.scratched" :src="cell.image" alt="Prize Image" class="image" />
        <div v-else class="cover">?</div>
      </div>
    </div>
    <div v-if="hasPrize" class="prize">Congratulations! You won a prize!</div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import ScratchCardsItem from '@/components/awards/ScratchCardsItem.vue';

const props = defineProps({
  prizes: Array
})

const grid = reactive(createGrid());
const scratchedCells = ref(0);

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

function scratchCell(rowIndex, colIndex) {
  const cell = grid[rowIndex][colIndex];
  if (!cell.scratched) {
    cell.scratched = true;
    scratchedCells.value++;
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables';
.row {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.cell {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 10px;
  border: 1px solid #406A8C;
  box-shadow: 0 2px 12px rgba(64, 106, 140, 0.5);
  border-radius: $border-radius;
  overflow: hidden;
}

//.scratch-card {
//  border: 1px solid red;
//  position: absolute;
//  top: 0;
//  left: 0;
//  width: 100%;
//  height: 100%;
//  -webkit-tap-highlight-color: transparent;
//  -webkit-touch-callout: none;
//  -webkit-user-select: none;
//  user-select: none;
//}

.cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $light-grey;
  border-radius: $border-radius;
  font-weight: 700;
  font-size: 40px;
  line-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.prize {
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
}
</style>