<template>
  <CNavItem
      v-for="(item, index) in navItems"
      :key="index"
  >
    <router-link :to="item.to" class="nav-item">
      <div class="nav-item__icon-wrapper">
        <component class="icon" :is="item.icon"/>
      </div>
      <span class="nav-item__title">{{ item.name }}</span>
    </router-link>
  </CNavItem>
</template>

<script setup>
import { CNavItem } from '@coreui/vue';
const props = defineProps({ navItems: Array });

</script>

<style lang="scss">
@import 'src/assets/scss/_variables';

.nav-item {
  font-family: $mainFont;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 11px 13px;
  border-radius: 10px;

  & a {
    text-decoration: none;
    color: $sidebar-text-color;
  }

  & a:hover {
    color: $main-text-color-white;
  }

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

  > .router-link-active {
    background-color: $purple;
    color: $main-text-color-white;
  }
}
</style>