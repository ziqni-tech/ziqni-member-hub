<template>
  <div class="actions">
    <DropdownBtn :btn-title="'New'" />
    <DropdownBtn :btn-title="'View All'" />
  </div>
</template>

<script>
import DropdownBtn from './DropdownBtn';

export default {
  name: 'DropdownActionsBlock',
  components: {
    DropdownBtn
  }
};
</script>

<style lang="scss">
.actions {
  display: flex;
  align-items: center;
}
</style>