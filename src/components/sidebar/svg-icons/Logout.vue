<template>
  <svg :width="width" :height="height" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.41666 6.29995C7.67499 3.29995 9.21666 2.07495 12.5917 2.07495H12.7C16.425 2.07495 17.9167 3.56662 17.9167 7.29162V12.725C17.9167 16.45 16.425 17.9416 12.7 17.9416H12.5917C9.24166 17.9416 7.69999 16.7333 7.42499 13.7833" :stroke="strokeColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12.5 10H3.01666" :stroke="strokeColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4.87501 7.20837L2.08334 10L4.87501 12.7917" :stroke="strokeColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<script setup>
const props = defineProps({
  width: {
    type: String,
    default: '20'
  },
  height: {
    type: String,
    default: '20'
  },
  fill: {
    type: String,
    default: 'none'
  },
  strokeColor: {
    type: String,
    default: '#8B96BE'
  }
});
</script>

<style scoped>

</style>