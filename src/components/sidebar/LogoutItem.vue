<template>
  <div class="logout-item" @click="handleLogout">
    <div class="logout-item__icon-wrapper">
      <Logout class="icon" />
    </div>
    <span class="logout-item__title">logout</span>
  </div>
</template>

<script setup>
import Logout from '@/components/sidebar/svg-icons/Logout'
const emit = defineEmits(['logOut'])

const handleLogout = () => {
  emit('logOut')
}

</script>

<style lang="scss">
.logout-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;

  &__icon-wrapper {
    width: 18px;
    height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    object-fit: cover;
    margin-right: 11px;

    .icon {
      width: inherit;
      height: inherit;
    }
  }

  &__title {
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
  }
}
</style>