<template>
  <div id="blazzio-mobile-nav">
    <CNavItem
        v-for="(item, index) in sidebarNav"
        :key="index"
    >
      <a :href="item.to" class="mob-nav-item">
        <div class="icon-wrapper">
          <component class="icon" :is="item.icon" :strokeColor="getIconStrokeColor(item)" />
        </div>
        <span  class="item-name">{{ item.name }}</span>
      </a>
    </CNavItem>
  </div>

</template>

<script setup>
import { CNavItem } from '@coreui/vue';
import sidebarNav from './blazzioNav';
import { useRoute } from 'vue-router';

const route = useRoute();

const getIconStrokeColor = (item) => {
  if (route.path.startsWith(item.to)) {
    return '#8749DC';
  } else {
    return '#8B96BE';
  }
};

</script>

<style scoped lang="scss">
@import "@/assets/scss/_variables";

#blazzio-mobile-nav {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  border-top: 1px solid $btn-border-grey;
  border-bottom: 1px solid $btn-border-grey;
  padding-right: 10px;

  .mob-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 0;

    .icon-wrapper {
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
      font-size: 10px;
      color: $text-color-white;
      margin-top: 8px;
    }
  }
}
</style>