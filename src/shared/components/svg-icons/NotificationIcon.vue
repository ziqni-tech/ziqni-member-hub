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
  <svg :width="width" :height="height" viewBox="0 0 40 40" fill="none" >
    <path d="M20.0167 12.425C17.2583 12.425 15.0167 14.6667 15.0167 17.425V19.8333C15.0167 20.3417 14.8 21.1167 14.5417 21.55L13.5833 23.1417C12.9917 24.125 13.4 25.2167 14.4833 25.5833C18.075 26.7833 21.95 26.7833 25.5417 25.5833C26.55 25.25 26.9917 24.0583 26.4417 23.1417L25.4833 21.55C25.2333 21.1167 25.0167 20.3417 25.0167 19.8333V17.425C25.0167 14.675 22.7667 12.425 20.0167 12.425Z" :stroke="strokeColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"/>
    <path d="M21.5583 12.6667C21.3 12.5917 21.0333 12.5334 20.7583 12.5C19.9583 12.4 19.1917 12.4584 18.475 12.6667C18.7167 12.05 19.3167 11.6167 20.0167 11.6167C20.7167 11.6167 21.3167 12.05 21.5583 12.6667Z" :stroke="strokeColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M22.5167 25.8834C22.5167 27.2584 21.3917 28.3834 20.0167 28.3834C19.3333 28.3834 18.7 28.1001 18.25 27.6501C17.8 27.2001 17.5167 26.5668 17.5167 25.8834" :stroke="strokeColor" stroke-width="1.5" stroke-miterlimit="10"/>
  </svg>
</template>

<style scoped lang="scss">

</style>