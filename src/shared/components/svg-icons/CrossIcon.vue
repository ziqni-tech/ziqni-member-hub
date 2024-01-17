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
  <svg :width="width" :height="height" viewBox="0 0 34 34" fill="none" >
    <path d="M10.9896 23.0104L23.0104 10.9896" :stroke="strokeColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M23.0104 23.0104L10.9896 10.9896" :stroke="strokeColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<style scoped lang="scss">

</style>