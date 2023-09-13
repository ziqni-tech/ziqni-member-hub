<template>
  <div id="mobile-nav" :class="{'light-mode': !isDarkMode}">
    <CNavItem
        v-for="(item, index) in sidebarNav"
        :key="index"
        @click="paginationClear"
        :class="{active: isActive(item.to)}"
    >
      <router-link :to="item.to" class="mob-nav-item">
        <div class="icon-wrapper">
          <component
              class="icon"
              :is="item.icon"
              :strokeColor="isActive(item.to) ? '#FFFFFF' : (isDarkMode ? '#FFFFFF' : '#4A6382')"
          />
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
import { useStore } from 'vuex';
import { computed } from 'vue';

const route = useRoute();
const props = defineProps({
  isDarkMode: Boolean
})
const store = useStore()

const isActive = (path) => {
  return route.path.startsWith(path)
}

const paginationClear = () => {
  store.dispatch('setCurrentPage', 1)
  store.dispatch('setCurrentTab', '')
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
    border-radius: 8px;

    > .router-link-active {
      background: linear-gradient(180deg, #F0047F 0%, #A14B9D 100%);
      border-radius: 8px;
    }
  }

  .nav-item.active {
    background: linear-gradient(180deg, #F0047F 0%, #A14B9D 100%);
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
        background: linear-gradient(180deg, #F0047F 0%, #A14B9D 100%);
        border-radius: 8px;
      }
    }
  }
}
</style>