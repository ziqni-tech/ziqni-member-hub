<template>
  <div class="status" :class="itemStatus">
    <div class="status__icon" :class="itemStatus">{{ setStatusIcon }}</div>
    <div class="status__title" :class="itemStatus">{{ capitalizeStatus }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ status: String })

const setStatusIcon = computed(() => {
  switch (props.status.toLowerCase()) {
    case 'active':
      return 'A';
    case 'ready':
    case 'upcoming':
      return 'U';
    case 'closed':
    case 'finalised':
      return 'C'
  }
});

const itemStatus = computed(() => {
  switch (props.status.toLowerCase()) {
    case 'active':
      return 'active';
    case 'ready':
    case 'upcoming':
      return 'upcoming';
    case 'closed':
    case 'finalised':
      return 'closed'
  }
});

const capitalizeStatus = computed(() => {
  const word = props.status.toLowerCase() === 'ready' ? 'upcoming' : props.status
  const firstLetter = word.charAt(0)
  const firstLetterCap = firstLetter.toUpperCase()
  const remainingLetters = word.slice(1)
  return firstLetterCap + remainingLetters;
});

</script>

<style lang="scss">

</style>