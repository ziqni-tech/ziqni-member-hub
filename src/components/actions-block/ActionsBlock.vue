<template>
  <div class="actions-block">
    <div class="actions">
      <DropdownBtn :btn-title="'New'" />
      <DropdownBtn :btn-title="'View All'" />
    </div>
    <div class="actions">
      <CButton variant="outline" class="btn rounded-btn grid-btn" >
        <img :src="$options.gridIcon" alt="">
      </CButton>
      <CButton variant="outline" class="btn rounded-btn settings-btn" >
        <img :src="$options.settingsIcon" alt="">
      </CButton>
    </div>
  </div>
</template>

<script>
import { CContainer, CButton } from '@coreui/vue';
import DropdownBtn from './DropdownBtn';
import gridIcon from '../../assets/icons/btn-grid.svg';
import settingsIcon from '../../assets/icons/btn-settings.svg';

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
.actions-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 0;

  .actions {
    display: flex;
    align-items: center;

    .btn:nth-child(odd) {
      margin-right: 16px;
    }

    .grid-btn {
      background: #FFFFFF;
      box-shadow: 0px 4px 8px rgba(53, 53, 53, 0.1);
    }

    .settings-btn {
      background: #5D53C2;
    }
  }
}

.rounded-btn {
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>