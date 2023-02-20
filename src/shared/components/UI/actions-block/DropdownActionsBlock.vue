<template>
  <div class="actions">
    <DropdownBtn :btn-title="'New'" />
    <DropdownBtn :btn-title="'View All'" />
  </div>
</template>

<script setup>
import DropdownBtn from './DropdownBtn';

</script>

<style lang="scss">
.actions {
  display: flex;
  align-items: center;
}
</style>