<template>
  <button class="btn" @click="toggleTheme">
    <img :src="themeIcon" alt="">
  </button>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

import sunIcon from '@/assets/icons/user-info/sun.png';
import moonIcon from '@/assets/icons/user-info/moon.png';

const isDarkTheme = ref(false);
const store = useStore()

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
};

const themeClass = computed(() => {
  return isDarkTheme.value ? 'dark-theme' : 'light-theme';
});

const themeIcon = computed(() => {
  return isDarkTheme.value ? sunIcon : moonIcon;
});

</script>

<style scoped lang="scss">

</style>