<template>
  <div class="status" :class="itemStatus()">
    <div class="status__icon" :class="itemStatus()">{{ setStatusIcon() }}</div>
    <div class="status__title" :class="itemStatus()">{{ capitalizeStatus() }}</div>
  </div>
</template>

<script>
export default {
  name: 'Status',
  props: {
    status: {
      type: String,
      default: 'Active'
    }
  },
  methods: {
    setStatusIcon() {
      switch (this.status.toLowerCase()) {
        case 'active':
          return 'A';
        case 'upcoming':
          return 'U';
        case 'closed':
        case 'finalised':
          return 'C'
      }
    },
    itemStatus() {
      switch (this.status.toLowerCase()) {
        case 'active':
          return 'active';
        case 'upcoming':
          return 'upcoming';
        case 'closed':
        case 'finalised':
          return 'closed'
      }
    },
    capitalizeStatus() {
      const word = this.status
      const firstLetter = word.charAt(0)
      const firstLetterCap = firstLetter.toUpperCase()
      const remainingLetters = word.slice(1)
      return firstLetterCap + remainingLetters;
    }
  }
};
</script>

<style lang="scss">

</style>