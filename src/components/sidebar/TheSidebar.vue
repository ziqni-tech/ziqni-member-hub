<template>
  <CSidebar visible :class="isDarkMode ? 'sidebar-dark-mode ': 'sidebar-light-mode'">
    <div class="brand">
      <div class="logo-wrapper">
        <img
            class="logo"
            :src="require(`../../assets/icons/${logoName}.svg`)"
            alt="logo"
        />
      </div>
    </div>
    <CSidebarNav>
      <SidebarItems :nav-items="sidebarNav"/>
    </CSidebarNav>
    <button @click="logOut" class="log-out-btn">Log Out</button>
  </CSidebar>
</template>

<script setup>
import { CSidebar, CSidebarNav } from '@coreui/vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { computed } from 'vue';

import SidebarItems from './SidebarItems';
import sidebarNav from './sidebarNav';

const router = useRouter();
const store = useStore();
const emit = defineEmits(['logOut']);

const isDarkMode = computed(() => store.getters.getTheme);

const logoName = computed(() => {
  return store.getters.getTheme
      ? 'logo-dark'
      : 'logo-light';
});

const logOut = () => emit('logOut');


</script>

<style lang="scss">
@import '../../assets/scss/utils/vars';

.log-out-btn {
  padding: 20px 50px;
  text-align: start;
  background-color: inherit;
  outline: none;
  border: none;
  color: $txt-secondary;

  &:hover {
    color: $txt-primary-violet;
  }
}
</style>