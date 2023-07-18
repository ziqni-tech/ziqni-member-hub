<template>
  <button class="btn" @click="toggleTheme">
    <img :src="themeIcon" alt="">
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

import sunIcon from '@/assets/icons/user-info/sun.png';
import moonIcon from '@/assets/icons/user-info/moon.png';

const isDarkTheme = computed(() => {
  if (localStorage.getItem('theme')) {
    return localStorage.getItem('theme') === 'dark-mode'
  } else {
    return false
  }
});
const store = useStore()


const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  store.dispatch('setTheme', themeClass.value)
  localStorage.setItem('theme', themeClass.value);
};

const themeClass = computed(() => {
  return isDarkTheme.value ? 'dark-mode' : 'light-mode';
});

const themeIcon = computed(() => {
  return isDarkTheme.value ? sunIcon : moonIcon;
});

</script>

<style scoped lang="scss">

</style>