<template>
  <div class="game-mode-switch">
    <span class="label">Game Mode OFF</span>
    <CFormSwitch />
  </div>
</template>

<script>
import { CFormSwitch } from '@coreui/vue'
export default {
  name: 'GameModeSwitch',
  components: {
    CFormSwitch
  }
};
</script>

<style lang="scss">
@import '../../assets/scss/variables';

.game-mode-switch {
  display: flex;
  align-items: center;

  .label {
    padding: 0 10px;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    text-align: center;
    letter-spacing: -0.408px;
    color: $nav-text-color;
  }

  .form-check-input {
    width: 51px;
    height: 31px;
    //background: linear-gradient(180deg, #ABA7D9 0%, #E1E8F1 95.16%);
    box-shadow: inset 0px -0.5px 0px #FFFFFF;
  }
}
</style>