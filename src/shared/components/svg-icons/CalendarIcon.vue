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
  <svg :width="width" :height="height" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="29" height="29" rx="4.5" :stroke="strokeColor"/>
    <path d="M12.3333 8.33337V10.3334" :stroke="strokeColor" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17.6667 8.33337V10.3334" :stroke="strokeColor" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9.33325 13.0601H20.6666" :stroke="strokeColor" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M21 12.6667V18.3334C21 20.3334 20 21.6667 17.6667 21.6667H12.3333C10 21.6667 9 20.3334 9 18.3334V12.6667C9 10.6667 10 9.33337 12.3333 9.33337H17.6667C20 9.33337 21 10.6667 21 12.6667Z" :stroke="strokeColor" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17.4632 16.1334H17.4692" :stroke="strokeColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17.4632 18.1334H17.4692" :stroke="strokeColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14.9969 16.1334H15.0029" :stroke="strokeColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14.9969 18.1334H15.0029" :stroke="strokeColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12.5296 16.1334H12.5356" :stroke="strokeColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12.5296 18.1334H12.5356" :stroke="strokeColor" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<style scoped lang="scss">

</style>