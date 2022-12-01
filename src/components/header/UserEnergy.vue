<template>
  <div class="user-energy">
    <div class="icon-wrapper">
      <img src="../../assets/icons/lightning-icon.svg" alt="">
    </div>
    <span class="energy-value">{{energyValue}}</span>
    <span v-if="!isMobile" class="increment-energy-value">+{{incrementEnergyValue}}/hour</span>
  </div>
</template>

<script>
import { useMedia } from '../../hooks/useMedia';

export default {
  name: 'UserEnergy',
  props: {
    energyValue: Number,
    incrementEnergyValue: Number
  },
  setup() {
    const isMobile = useMedia('(max-width: 480px)')

    return {isMobile}
  },
};
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
    box-shadow: 0px 0px 12px rgba(255, 71, 56, 0.5);
    border-radius: 4px;
    object-fit: cover;
    overflow: hidden;
  }

  .energy-value {
    padding: 0 3px 0 10px;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 10px;
    color: $nav-text-color;
  }

  .increment-energy-value {
    font-family: 'Poppins';
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