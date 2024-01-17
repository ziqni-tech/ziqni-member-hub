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
    <path d="M14.8741 3.80249L16.7807 7.61582C17.0407 8.14665 17.7341 8.65582 18.3191 8.75332L21.7749 9.32748C23.9849 9.69582 24.5049 11.2992 22.9124 12.8808L20.2257 15.5675C19.7707 16.0225 19.5216 16.9 19.6624 17.5283L20.4316 20.8542C21.0382 23.4867 19.6407 24.505 17.3116 23.1292L14.0724 21.2117C13.4874 20.865 12.5232 20.865 11.9274 21.2117L8.68824 23.1292C6.3699 24.505 4.96157 23.4758 5.56823 20.8542L6.3374 17.5283C6.47823 16.9 6.22907 16.0225 5.77407 15.5675L3.0874 12.8808C1.50573 11.2992 2.0149 9.69582 4.2249 9.32748L7.68074 8.75332C8.2549 8.65582 8.94823 8.14665 9.20823 7.61582L11.1149 3.80249C12.1549 1.73332 13.8449 1.73332 14.8741 3.80249Z" :stroke="strokeColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<style scoped lang="scss">

</style>