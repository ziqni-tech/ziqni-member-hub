<script setup>
const props = defineProps({
  width: {
    type: String,
    default: '26'
  },
  height: {
    type: String,
    default: '26'
  },
  fill: {
    type: String,
    default: 'none'
  },
  strokeColor: {
    type: String,
    default: '#223241'
  }
});
</script>

<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24" fill="none" >
    <path d="M12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2Z" :stroke="strokeColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 16V11" :stroke="strokeColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11.9945 8H12.0035" :stroke="strokeColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>

</template>

<style scoped lang="scss">

</style>