<template>
  <GradientProgress
      :diameter="diameter"
      :completed-steps="completedSteps"
      :total-steps="totalSteps"
      :stroke-width="strokeWidth"
      :inner-stroke-width="strokeWidth"
      :start-color="color"
      :stop-color="color"
      :inner-stroke-color="innerStrokeColor"
      :stroke-linecap="strokeLinecap"
  >
    <p class="progress-value">{{ completedSteps }}{{ isPercents ? '%' : ''}}</p>
    <p class="progress-title">{{ title }}</p>
  </GradientProgress>
</template>

<script setup>
import GradientProgress from 'vue3-radial-progress';

const props = defineProps({
  color: String,
  totalSteps: Number || String,
  completedSteps: Number || String,
  title: String,
  isPercents: Boolean
})

const diameter = 100;
const strokeWidth = 5;
const strokeLinecap = 'round';
const innerStrokeColor = '#141E28';

</script>

<style lang="scss">
@import "src/assets/scss/_variables";

.progress-value {
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: $main-text-color-white;
}

.progress-title {
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: $body-text-color;
  text-transform: capitalize;
}
</style>