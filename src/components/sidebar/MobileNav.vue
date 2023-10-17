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
              :strokeColor="isActive(item.to) ? '#FFFFFF' : (isDarkMode ? '#FFFFFF' : '#141E28')"
          />
        </div>
        <span v-if="isActive(item.to)" class="item-name">{{ item.name }}</span>
      </router-link>
    </CNavItem>
  </div>

</template>

<script setup>
import { CNavItem } from '@coreui/vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { computed, onMounted, ref, watch } from 'vue';
import getSidebarNav from './sidebarNav';

const route = useRoute();
const props = defineProps({
  isDarkMode: Boolean
})
const store = useStore()

const configFile = computed(() => store.getters.getConfigFile);
const sidebarNav = ref([])

watch(configFile, (val) => {
  sidebarNav.value = getSidebarNav(val)
})


onMounted(() => {
  if (!sidebarNav.value.length && configFile.value) {
    sidebarNav.value = getSidebarNav(configFile.value);
  }
})

const getIconStrokeColor = (item) => {
  if (route.path.startsWith(item.to)) {
    return props.isDarkMode ? '#FFFFFF' : '#141E28';
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
      background: $btn-primary-bg-color-LM;
      border-radius: 8px;
    }
  }

  .nav-item.active {
    background: $btn-primary-bg-color-LM;
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
      border-radius: 8px;

      > .router-link-active {
        background: $btn-primary-bg-color-LM;
        border-radius: 8px;
      }
    }
  }
}
</style>