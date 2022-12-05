<template>
  <div class="user-energy">
    <div class="icon-wrapper">
      <img src="../../assets/icons/lightning-icon.svg" alt="">
    </div>
    <span class="energy-value">{{ energyValue }}</span>
    <span v-if="!isMobile" class="increment-energy-value">+{{ incrementEnergyValue }}/hour</span>
  </div>
</template>

<script setup>
import { useMedia } from '../../hooks/useMedia';

const isMobile = useMedia('(max-width: 480px)');
const props = defineProps({
                            energyValue: Number,
                            incrementEnergyValue: Number
                          });
</script>

<style lang="scss">
@import '../../assets/scss/variables';

.user-energy {
  display: flex;
  align-items: center;

  .icon-wrapper {
    width: 18px;
    height: 18px;
    background: $bg-orange;
    box-shadow: 0 0 12px rgba(255, 71, 56, 0.5);
    border-radius: 4px;
    object-fit: cover;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .energy-value {
    padding: 0 3px 0 10px;
    font-family: 'Poppins', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 10px;
    color: $nav-text-color;
  }

  .increment-energy-value {
    font-family: 'Poppins', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 11px;
    line-height: 10px;
    color: $nav-text-color;
    mix-blend-mode: normal;
    opacity: 0.6;
  }
}
</style>