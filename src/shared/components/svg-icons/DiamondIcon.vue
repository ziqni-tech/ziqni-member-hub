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
  <svg :width="width" :height="height" viewBox="0 0 26 26" fill="none">
    <path d="M19.7599 2.85999H6.23991C5.92821 2.86854 5.62291 2.95033 5.34867 3.09874C5.07444 3.24715 4.83898 3.45801 4.66134 3.71427L1.28134 8.39427C1.03036 8.74894 0.905016 9.17727 0.925203 9.61128C0.945389 10.0453 1.10995 10.4601 1.39277 10.79L11.5328 22.4714C11.7064 22.6951 11.9288 22.8761 12.1831 23.0007C12.4374 23.1252 12.7168 23.1899 12.9999 23.1899C13.2831 23.1899 13.5624 23.1252 13.8167 23.0007C14.071 22.8761 14.2935 22.6951 14.4671 22.4714L24.6071 10.79C24.8899 10.4601 25.0544 10.0453 25.0746 9.61128C25.0948 9.17727 24.9695 8.74894 24.7185 8.39427L21.3385 3.71427C21.1608 3.45801 20.9254 3.24715 20.6511 3.09874C20.3769 2.95033 20.0716 2.86854 19.7599 2.85999Z" :stroke="strokeColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12.0341 2.84143L7.50272 9.86143L12.9999 23.14L18.5341 9.86143L14.0213 2.84143M0.965576 9.86143H25.0341" :stroke="strokeColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<style scoped lang="scss">

</style>