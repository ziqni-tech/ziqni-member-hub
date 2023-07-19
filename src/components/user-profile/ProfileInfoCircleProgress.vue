<template>
  <GradientProgress
      :diameter="state.diameter"
      :completed-steps="completedSteps"
      :total-steps="totalSteps"
      :stroke-width="state.strokeWidth"
      :inner-stroke-width="state.strokeWidth"
      :start-color="color"
      :stop-color="color"
      :inner-stroke-color="state.innerStrokeColor"
      :stroke-linecap="state.strokeLinecap"
  >
    <p class="progress-value" :class="{'light-mode': !isDarkMode}">{{ completedSteps }}{{ isPercents ? '%' : ''}}</p>
    <p class="progress-title" :class="{'light-mode': !isDarkMode}">{{ title }}</p>
  </GradientProgress>
</template>

<script setup>
import GradientProgress from 'vue3-radial-progress';
import { onMounted, onUnmounted, onUpdated, reactive, watch } from 'vue';

const props = defineProps({
  color: String,
  totalSteps: Number || String,
  completedSteps: Number || String,
  title: String,
  isPercents: Boolean,
  isDarkMode: Boolean
})

const state = reactive({
  diameter: 90,
  strokeWidth: 5,
  strokeLinecap: 'round',
  innerStrokeColor: props.isDarkMode ? '#141E28' : '#DCE6EF'
});

onMounted(() => {
  updateDiameter();

  window.addEventListener('resize', updateDiameter);
});

onUpdated(() => {
  updateDiameter();

  window.addEventListener('resize', updateDiameter);
})
onUnmounted(() => {
  window.removeEventListener('resize', updateDiameter);
});


function updateDiameter() {
  const screenWidth = window.innerWidth;
  let diameter;

  switch (true) {
    case screenWidth >= 1200:
      diameter = 100;
      break;
    case screenWidth >= 890 && screenWidth < 1200:
      diameter = 80;
      break;
    case screenWidth < 890:
      diameter = 80;
      break;
    default:
      diameter = 100;
      break;
  }

  state.diameter = diameter;
}

watch(() => window.innerWidth, updateDiameter);

</script>

<style lang="scss">
@import "src/assets/scss/_variables";

.progress-value {
  font-family: $semi-bold;
  font-size: 24px;
  color: $text-color-white;

  &.light-mode {
    color: $section-title-color-LM;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
}

.progress-title {
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: $body-text-color;
  text-transform: capitalize;

  &.light-mode {
    font-family: $mainFont;
    color: $info-name-color;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
}

@media screen and (max-width: 1200px) {
  .progress-value {
    font-size: 16px;
  }

  .progress-title {
    font-size: 10px;
  }
}

@media screen and (max-width: 890px) {
  .progress-value {
    font-size: 12px;
  }

  .progress-title {
    font-size: 8px;
  }
}
</style>