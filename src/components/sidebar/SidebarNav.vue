<template>
  <CNavItem
      v-for="(item, index) in navItems"
      :key="index"
      @click="paginationClear"
      :class="{active: isActive(item.to)}"
  >
    <router-link :to="item.to" class="nav-item" :class="{'light-mode': !isDarkMode}">
      <div class="nav-item__icon-wrapper">
        <component
            class="icon"
            :is="item.icon"
            :strokeColor="isActive(item.to) ? '#FFFFFF' : (isDarkMode ? '#FFFFFF' : '#141E28')"
        />
      </div>
      <span class="nav-item__title" :class="{'light-mode': !isDarkMode}">{{ item.name }}</span>
    </router-link>
  </CNavItem>
</template>

<script setup>
import { CNavItem } from '@coreui/vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
const props = defineProps({ navItems: Array, isDarkMode: Boolean });
const store = useStore()
const route = useRoute();
const getIconStrokeColor = (item) => {
  if (route.path.startsWith(item.to)) {
    return props.isDarkMode ? '#FFFFFF' : '#141E28'
  }
};

const isActive = (path) => {
  return route.path.startsWith(path)
}

const paginationClear = () => {
  store.dispatch('setCurrentPage', 1)
  store.dispatch('setCurrentTab', '')
}

</script>

<style lang="scss" scoped>
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
    color: $nav-active-item-color-LM;

    &.light-mode {
      color: $nav-item-color-LM;
    }
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
    font-size: 16px;
  }

  > .router-link-active {
    color: $text-color-white;
    font-family: $semi-bold;
    background-color: $btn-primary-bg-color-LM;

    &.light-mode {
      color: $nav-active-item-color-LM;
    }

    &:before {
      left: -20px;
      content: "";
      position: absolute;
      width: 56px;
      height: 95px;
      background-image: radial-gradient(84.48% 157.68% at 50.5% 101.43%, rgb(127, 33, 255) 0%, rgba(41, 24, 79, 0) 66.15%, rgba(19, 22, 33, 0) 100%);
      opacity: 0.2;
      transform: rotate(90deg);
    }
  }
}

.nav-item.active {
  background: $btn-primary-bg-color-LM;
}

@media screen and (max-width: 1200px) {
  .nav-item {
    padding: 11px 8px;

    &__icon-wrapper {
      margin-right: 8px;
    }
  }
}

@media screen and (max-width: 980px) {
  .nav-item {
    padding: 10px 5px;

    &__icon-wrapper {
      margin-right: 5px;
    }
  }
}
</style>