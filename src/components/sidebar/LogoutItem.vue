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
@import "@/assets/scss/_variables";
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
      fill: none;
    }
  }

  &__title {
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
  }

  &:hover {
    color: $body-text-white;

    &:before {
      left: -20px;
      content: "";
      position: absolute;
      width: 56px;
      height: 45px;
      background-image: radial-gradient(84.48% 157.68% at 50.5% 101.43%, rgb(127, 33, 255) 0%, rgba(41, 24, 79, 0) 66.15%, rgba(19, 22, 33, 0) 100%);
      opacity: 0.4;
      transform: rotate(90deg);
    }
  }
}
</style>