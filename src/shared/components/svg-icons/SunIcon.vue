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
  <svg :width="width" :height="height" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 25.4166C22.9916 25.4166 25.4167 22.9915 25.4167 20C25.4167 17.0084 22.9916 14.5833 20 14.5833C17.0085 14.5833 14.5833 17.0084 14.5833 20C14.5833 22.9915 17.0085 25.4166 20 25.4166Z" :stroke="strokeColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M25.95 25.95L25.8417 25.8417M25.8417 14.1584L25.95 14.05L25.8417 14.1584ZM14.05 25.95L14.1583 25.8417L14.05 25.95ZM20 11.7334V11.6667V11.7334ZM20 28.3334V28.2667V28.3334ZM11.7333 20H11.6667H11.7333ZM28.3333 20H28.2667H28.3333ZM14.1583 14.1584L14.05 14.05L14.1583 14.1584Z" :stroke="strokeColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<style scoped lang="scss">

</style>