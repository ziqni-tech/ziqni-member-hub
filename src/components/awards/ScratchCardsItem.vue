<template>
  <div class="prize-container"></div>
<!--  <img :src="img" alt="Prize Image" class="image" />-->
  <img v-if="cell.scratched" :src="img" alt="Prize Image" class="image" />-->
  <!--        <div v-else class="cover">?</div>-->
<!--  <canvas id="scratch-card" width="80px" height="80px"></canvas>-->
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  img: String
})

const isContext = ref(false)

const generateCanvas = () => {
  // this.canvas = document.createElement('canvas');
  // this.canvas.classList.add('sc__canvas');
  //
  // // Add canvas into container
  // this.canvas.width = this.config.containerWidth;
  // this.canvas.height = this.config.containerHeight;
  // this.container.appendChild(this.canvas);
}

// let canvas = document.getElementById('scratch-card')
// let context = canvas.getContext('2d')

const init = () => {
  // let gradientColor = context.createLinearGradient(0,0,135,135)
  // gradientColor.addColorStop(0,'#c3a3f1')
  // gradientColor.addColorStop(1,'#6414e9')
  // context.fillStyle = gradientColor
  // context.fillRect(0,0,80,80)
}

window.onload = init()

// watch(context, (value) => {
//   if (value) console.warn('CONTEXT', value)
// })

</script>

<style scoped lang="scss">
#scratch-card {
  border: 1px solid red;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}
</style>