<template>
  <div class="loader">
    <div class="spinner-wrapper" >
      <CSpinner class="spinner-wrapper__spinner" color="secondary"/>
      <span class="spinner-wrapper__title">{{ title }}</span>
    </div>
  </div>
</template>

<script setup>
import { CSpinner } from '@coreui/vue';
const props = defineProps({title: { type: String, default: 'Loading...' }})
const title = props.title;

</script>

<style scoped lang="scss">
@import '../assets/scss/utils/vars';
.loader {
  height: 100%;
  width: 100%;
  position: relative;

  .spinner-wrapper {
    position: absolute;
    top: 20%;
    left: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    @media screen and (max-width: $phoneWidth) {
      left: 0;
    }

    &__spinner {
      width: 50px;
      height: 50px;
    }

    &__text {
      margin-top: 5px;
    }
  }
}
</style>