<template>
  <button class="btn" @click="toggleTheme">
    <img :src="themeIcon" alt="">
  </button>
</template>

<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useStore } from 'vuex';

import sunIcon from '@/assets/icons/user-info/sun.png';
import moonIcon from '@/assets/icons/user-info/moon.png';

const isDarkTheme = ref(false);
const store = useStore();

onBeforeMount(() => {
  if (!localStorage.getItem('theme')) {
    localStorage.setItem('theme', 'dark-mode');
  } else if (localStorage.getItem('theme')) {
    isDarkTheme.value = localStorage.getItem('theme') === 'dark-mode';
    store.dispatch('setTheme', isDarkTheme.value);
  }
})

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;

  store.dispatch('setTheme', isDarkTheme.value);
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