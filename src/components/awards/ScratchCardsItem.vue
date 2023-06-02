<template>
  <div class="box">
    <canvas
        id="myCanvas"
        ref="canvasRef"
        @mousedown="canvasDraw"
        @mousemove="mouseMove"
        @mouseup="finishDraw"
        @touchmove="touchMove"
        width="80"
        height="80"
    ></canvas>
    <img :src="img" alt="" srcset="" width="80" height="80"/>
  </div>
</template>

<script setup>
import { computed, onMounted, onUpdated, reactive, ref, watch } from 'vue';
import { useMouse } from '@vueuse/core';
import { useStore } from 'vuex';

import cursorImgSrc from '@/assets/images/instant-wins/coin.png'

const props = defineProps({
  img: String
});

const emit = defineEmits(['scratched'])

const store = useStore();

const isAutoScratchAll = computed(() => store.getters.getIsScratchAll);

const height = ref(80);
const width = ref(80);
const position = ref(1);
const canvasRef = ref(null);
const scratchText = ref('?');
const isScratched = ref(false)

const mouse = reactive(useMouse());

onMounted(() => {
  initCanvas();
});

onUpdated(() => {
  initCanvas();
});

const initCanvas = () => {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d',);

  if (isAutoScratchAll.value !== true) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1A202C';

    if (position.value === 1) {
      ctx.fillRect(0, 0, height.value, width.value);
      ctx.fillStyle = '#BEE9F3';
      ctx.canvas.style.opacity = 1;

      // font size
      const fontSize = 40;
      ctx.font = `${ fontSize }px Syne`;

      // text position
      const textWidth = ctx.measureText(scratchText.value).width;
      const textX = (width.value - textWidth) / 2;
      const textY = (height.value + fontSize) / 2;

      ctx.fillText(scratchText.value, textX, textY);
    }
  }
};

const autoScratching = () => {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d',);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const scratching = () => {
  const { x, y } = getClientOffset(mouse);
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d',);
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

const getClientOffset = (position) => {
  if (canvasRef.value) {
    const rect = canvasRef.value.getBoundingClientRect();

    return {
      x: position.x - rect.left,
      y: position.y - rect.top,
    };
  }
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
    isScratched.value = true
  }
};

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

const setCursorImage = () => {
  if (!isScratched.value) {
    const canvas = canvasRef.value;
    canvas.style.cursor = `url(${cursorImgSrc}), auto`
  }
}

let isDraw = false;
const canvasDraw = () => {
  isDraw = true;
};

const mouseMove = (e) => {
  if (!isDraw) return;
  scratching();
};

const finishDraw = () => {
  isDraw = false;
};

const touchMove = (e) => {
  const canvas = canvasRef.value;
  if (e.target === canvas) {
    e.preventDefault();
    scratching();
  }
};

watch(isAutoScratchAll, (value) => {
  if (value) autoScratching();
});

watch(isScratched, (value) => {
  if (value) emit('scratched')
})


</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-self: center;
  justify-content: center;
  background-color: #c077ee;
}

#myCanvas {
  z-index: 2;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: url('@/assets/images/instant-wins/coin.png'), auto;
}

img {
  position: absolute;
  width: 90%;
  height: 90%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>