<template>
  <div class="actions">
    <CButton variant="outline" class="btn" >
      <img :src="$options.gridIcon" alt="">
    </CButton>
    <CButton variant="outline" class="btn" >
      <img :src="$options.settingsIcon" alt="">
    </CButton>
  </div>
</template>

<script>
import { CContainer, CButton } from '@coreui/vue';
import DropdownBtn from './DropdownBtn';
import gridIcon from '../../../assets/icons/white-grid.svg';
import settingsIcon from '../../../assets/icons/btn-settings.svg';

export default {
  name: 'ActionsBlock',
  gridIcon,
  settingsIcon,
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

    .btn {
      border-radius: 50%;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #5D53C2;
    }

    .btn:nth-child(odd) {
      margin-right: 16px;
    }
}
</style>