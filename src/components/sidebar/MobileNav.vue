<template>
  <div id="mobile-nav">
    <CNavItem
        v-for="(item, index) in sidebarNav"
        :key="index"
    >
      <router-link :to="item.to" class="mob-nav-item">
        <div class="icon-wrapper">
          <component class="icon" :is="item.icon" :strokeColor="getIconStrokeColor(item)" />
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

const route = useRoute();

const getIconStrokeColor = (item) => {
  if (route.path.startsWith(item.to)) {
    return '#8749DC';
  } else {
    return '#8B96BE';
  }
};

const isActive = (path) => {
  return route.path.startsWith(path)
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
      background: radial-gradient(84.48% 157.68% at 50.5% 101.43%, rgba(127, 33, 255, 0.2) 0%, rgba(19, 22, 33, 0) 69.27%);
      color: $text-color-white;
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
      color: $text-color-white;
      margin-top: 8px;
    }
  }
}
</style>