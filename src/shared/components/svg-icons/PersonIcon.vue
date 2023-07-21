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
  <svg  :width="width" :height="height" viewBox="0 0 20 20" fill="none">
    <path d="M9.99992 10.0001C12.3011 10.0001 14.1666 8.1346 14.1666 5.83341C14.1666 3.53223 12.3011 1.66675 9.99992 1.66675C7.69873 1.66675 5.83325 3.53223 5.83325 5.83341C5.83325 8.1346 7.69873 10.0001 9.99992 10.0001Z" :stroke="strokeColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17.1582 18.3333C17.1582 15.1083 13.9499 12.5 9.99988 12.5C6.04988 12.5 2.84155 15.1083 2.84155 18.3333" :stroke="strokeColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<style scoped lang="scss">

</style>