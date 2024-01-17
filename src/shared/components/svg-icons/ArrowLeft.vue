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

<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24" fill="none" >
    <path d="M15 19.92L8.48 13.4C7.71 12.63 7.71 11.37 8.48 10.6L15 4.08002" :stroke="strokeColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<style scoped lang="scss">

</style>