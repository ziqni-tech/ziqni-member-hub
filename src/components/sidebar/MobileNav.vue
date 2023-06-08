<template>
  <div id="mobile-nav">
    <CNavItem
        v-for="(item, index) in sidebarNav"
        :key="index"
    >
      <router-link :to="item.to" class="mob-nav-item">
        <div class="icon-wrapper">
          <component class="icon" :is="item.icon"/>
        </div>
        <span v-if="isActive(item.to)" class="item-name">{{ item.name }}</span>
      </router-link>
    </CNavItem>
  </div>

</template>

<script setup>
import { CNavItem } from '@coreui/vue';
import sidebarNav from './sidebarNav';
import { useRoute } from 'vue-router';

const route = useRoute()

const isActive = (path) => {
  return route.path === path
}

</script>

<style scoped lang="scss">
@import "@/assets/scss/_variables";

#mobile-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .nav-item {
    flex-grow: 1;
    display: flex;

    > .router-link-active {
      background-color: $purple;
      color: $main-text-color-white;
      border-radius: 8px;
    }
  }

  .mob-nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px;

    .icon-wrapper {
      flex-grow: 1;
      width: 18px;
      height: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      object-fit: cover;

      .icon {
        width: inherit;
        height: inherit;
        fill: none;
      }
    }

    .item-name {
      font-weight: 500;
      font-size: 9px;
      line-height: 11px;
      color: $main-text-color-white;
      margin-top: 8px;
    }
  }
}
</style>