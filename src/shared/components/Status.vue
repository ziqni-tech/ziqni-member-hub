<template>
  <div class="status" :class="status.toLowerCase()">
    <div class="status__icon" :class="status.toLowerCase()">{{ setStatusIcon() }}</div>
    <div class="status__title" :class="status.toLowerCase()">{{ capitalizeStatus() }}</div>
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
          return 'C'
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
.status {
  display: flex;
  align-items: center;
  border-radius: 14px;
  padding: 11px 8px;

  &.active {
    background: #188A2A;
  }

  &.upcoming {
    background: #CE624B;
  }

  &.closed {
    background: #727272;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    width: 24px;
    height: 24px;

    font-family: 'Poppins';
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 18px;
  }

  &__icon.active {
    background: #1ECE30;
  }
  &__icon.upcoming {
    background: #F89A81;
  }
  &__icon.closed {
    background: #C4C4C4;
  }

  &__normal {
    width: 24px;
    height: 24px;
  }

  &__small {

  }

  &__title {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 18px;
    padding-left: 6px;
  }
  &__title.active {
    color: #8FFF9B;
  }
  &__title.upcoming {
    color: #FFE7E0;
  }
  &__title.closed {
    color: #E8E8E8;
  }
}

</style>