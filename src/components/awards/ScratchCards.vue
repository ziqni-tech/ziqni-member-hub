<template>
  <div class="scratch-cards">
    <canvas
        class="scratch-cards-canvas"
        ref="canvasRef"
        @mousedown="canvasMouseDown"
        @mousemove="canvasMouseMove"
        @mouseup="canvasMouseUp"
        @touchstart="canvasTouchStart"
        @touchmove="canvasTouchMove"
        @touchend="canvasTouchEnd"
        width="280"
        height="280"
    ></canvas>
    <div class="scratch-cards-block">
      <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="scratch-cards-row">
        <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell">
          <img :src="cell.image" alt="" width="80" height="80" >
        </div>
      </div>
    </div>
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
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useMouse } from '@vueuse/core';
import AwardsModal from '@/components/awards/AwardsModal.vue';

const grid = reactive(createGrid());

const canvasRef = ref(null);
let ctx;
let isDrawing = false;

const height = ref(280);
const width = ref(280);
const position = ref(1);
const mouse = reactive(useMouse());

const store = useStore();

const isAutoScratchAll = computed(() => store.getters.getIsScratchAll);
const scratchText = ref('?');

const isShowModal = ref(false);
const titleMessage = ref('');
const message = ref('');
const btnTitle = ref('');
const isWinner = ref(false);

const props = defineProps({
  prizes: Array
});

onMounted(() => {
  initCanvas();
});

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
  const prizes = props.prizes.map((item) => item.image);
  return prizes[Math.floor(Math.random() * prizes.length)];
}

function initCanvas() {
  const canvas = canvasRef.value;
  ctx = canvas.getContext('2d');
  const cellSize = 80; // Размер ячейки
  const spacing = 20; // Расстояние между ячейками
  const borderRadius = 10; // Радиус скругления

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const cell = grid[i][j];
      const x = j * (cellSize + spacing); // Позиция X ячейки
      const y = i * (cellSize + spacing); // Позиция Y ячейки

      if (cell.scratched) {
        const image = new Image();
        image.src = cell.image;
        image.onload = () => {
          ctx.save(); // Сохраняем контекст
          ctx.beginPath();
          ctx.moveTo(x + borderRadius, y);
          ctx.arcTo(x + cellSize, y, x + cellSize, y + borderRadius, borderRadius);
          ctx.arcTo(x + cellSize, y + cellSize, x + cellSize - borderRadius, y + cellSize, borderRadius);
          ctx.arcTo(x, y + cellSize, x, y + cellSize - borderRadius, borderRadius);
          ctx.arcTo(x, y, x + borderRadius, y, borderRadius);
          ctx.closePath();
          ctx.clip();

          ctx.drawImage(image, x, y, cellSize, cellSize);

          ctx.restore(); // Восстанавливаем контекст
        };
      } else {
        ctx.fillStyle = '#1A202C';
        ctx.fillRect(x, y, cellSize, cellSize);

        // Добавляем скругленные радиусы
        ctx.save(); // Сохраняем контекст
        ctx.beginPath();
        ctx.moveTo(x + borderRadius, y);
        ctx.arcTo(x + cellSize, y, x + cellSize, y + borderRadius, borderRadius);
        ctx.arcTo(x + cellSize, y + cellSize, x + cellSize - borderRadius, y + cellSize, borderRadius);
        ctx.arcTo(x, y + cellSize, x, y + cellSize - borderRadius, borderRadius);
        ctx.arcTo(x, y, x + borderRadius, y, borderRadius);
        ctx.closePath();
        ctx.clip();

        ctx.fillStyle = '#BEE9F3';
        ctx.font = '40px Syne';

        // Исправляем координаты текста
        const textWidth = ctx.measureText(scratchText.value).width;
        const textX = x + (cellSize - textWidth) / 2;
        const textY = y + cellSize / 2 + 15; // Смещение по Y

        ctx.fillText(scratchText.value, textX, textY);

        ctx.restore(); // Восстанавливаем контекст
      }
    }
  }
}


const fadeOut = (ctx) => {
  let timesRun = 0;
  let interval = setInterval(() => {
    timesRun += 1;
    ctx.canvas.style.opacity *= 0.99;
    if (timesRun === 100) {
      clearInterval(interval);
    }
  }, 50);
};

const getFilledPercentage = (ctx) => {
  let imgData;
  if (position.value === 1) {
    imgData = ctx.getImageData(0, 0, height.value, width.value);
  }
  if (position.value === 2) {
    imgData = ctx.getImageData(150, 0, height.value, width.value);
  }

  let pixels = imgData.data;
  let n = 0;
  for (let i = 0; i < pixels.length; i += 100) {
    if (pixels[i + 3] < 128) {
      n += 100;
    }
  }

  if (n >= pixels.length * 0.7) {
    ctx.globalCompositeOperation = 'destination-over';
    fadeOut(ctx);
    store.dispatch('setIsScratchAllCards', true)
  }
};

const getClientOffset = (position) => {
  if (canvasRef.value) {
    const rect = canvasRef.value.getBoundingClientRect();

    return {
      x: position.x - rect.left,
      y: position.y - rect.top,
    };
  }
};

const scratching = () => {
  const { x, y } = getClientOffset(mouse);
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  const offsetX = x - 0.001;
  const offsetY = y - 0.001;

  ctx.globalCompositeOperation = 'destination-out';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = '30';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(offsetX, offsetY);
  ctx.stroke();
  getFilledPercentage(ctx);
};

function canvasMouseDown(e) {
  isDrawing = true;
  const { offsetX, offsetY } = getOffsetXY(e);
  ctx.beginPath();
  ctx.moveTo(offsetX, offsetY);
  scratching();
}

function canvasMouseMove(e) {
  if (!isDrawing) return;
  const { offsetX, offsetY } = getOffsetXY(e);
  ctx.lineTo(offsetX, offsetY);
  ctx.stroke();
}

function canvasMouseUp() {
  isDrawing = false;
}

function canvasTouchStart(e) {
  e.preventDefault();
  isDrawing = true;
  const { offsetX, offsetY } = getOffsetXY(e.touches[0]);
  ctx.beginPath();
  ctx.moveTo(offsetX, offsetY);
}

function canvasTouchMove(e) {
  if (!isDrawing) return;
  const { offsetX, offsetY } = getOffsetXY(e.touches[0]);
  ctx.lineTo(offsetX, offsetY);
  ctx.stroke();
}

function canvasTouchEnd() {
  isDrawing = false;
}

function getOffsetXY(event) {
  const rect = canvasRef.value.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;
  return { offsetX, offsetY };
}

watch(
    () => grid,
    () => {
      const canvas = canvasRef.value;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
          if (grid[i][j].scratched) {
            const image = new Image();
            image.src = grid[i][j].image;
            image.onload = () => {
              context.drawImage(image, j * 80, i * 80, 80, 80);
            };
          }
        }
      }
    },
    { deep: true }
);

const claim = () => {
  console.warn('CLAIM');
  isShowModal.value = false;
};

const closeModal = () => {
  console.warn('RETURN');
  isShowModal.value = false;
};

watch(isAutoScratchAll, (value) => {
  if (value) {
    const prizes = props.prizes;
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const prize = prizes[randomIndex];
    done(prize.prize);
  }
});

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

</script>


<style scoped lang="scss">
@import '@/assets/scss/_variables';
.scratch-cards {
  position: relative;
  display: flex;
  margin-top: 50px;

  .scratch-cards-canvas {
    position: absolute;
    top: 0;
    left: 10px;
    cursor: url('@/assets/images/instant-wins/coin.png'), auto;
    z-index: 5;
  }

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
}

.scratch-cards-row {
  display: flex;
}
</style>
