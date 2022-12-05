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

<script setup>
import { CButton } from '@coreui/vue';

</script>

<style lang="scss">
.actions {
    display: flex;
    align-items: center;
}
</style>