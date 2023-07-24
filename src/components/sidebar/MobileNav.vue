<template>
  <div id="mobile-nav" :class="{'light-mode': !isDarkMode}">
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
const props = defineProps({
  isDarkMode: Boolean
})

const getIconStrokeColor = (item) => {
  if (route.path.startsWith(item.to)) {
    return '#FFFFFF';
  } else {
    return props.isDarkMode ? '#FFFFFF' : '#141E28';
  }
};

const isActive = (path) => {
  return route.path.startsWith(path)
}

</script>

<style scoped lang="scss">
@import "@/assets/scss/_variables";

#mobile-nav {
  display: grid;
  grid-template-columns: repeat(6, 1fr);

  .nav-item {
    flex-grow: 1;
    display: flex;

    > .router-link-active {
      background: $btn-primary-bg-color-LM;
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
      font-family: $medium;
      font-size: 9px;
      line-height: 11px;
      color: $text-color-white;
      margin-top: 8px;
    }
  }

  &.light-mode {
    .nav-item {
      flex-grow: 1;
      display: flex;

      > .router-link-active {
        background: $btn-primary-bg-color-LM;
        border-radius: 8px;
      }
    }
  }
}
</style>