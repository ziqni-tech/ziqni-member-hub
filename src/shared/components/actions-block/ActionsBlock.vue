<template>
  <div class="actions">
    <CButton variant="outline" class="r-btn" >
      <img src="../../../assets/icons/white-grid.svg" alt="">
    </CButton>
    <CButton variant="outline" class="r-btn" >
      <img src="../../../assets/icons/btn-settings.svg" alt="">
    </CButton>
  </div>
</template>

<script>
import { CContainer, CButton } from '@coreui/vue';
import DropdownBtn from './DropdownBtn';

export default {
  name: 'ActionsBlock',
  components: {
    DropdownBtn,
    CContainer,
    CButton
  }
};
</script>

<style lang="scss">
.actions {
    display: flex;
    align-items: center;
}
</style>