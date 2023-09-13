<template>
  <button @click="toggleTheme" class="toggle-btn">
    <SunIcon
        v-if="isDarkTheme"
        :strokeColor="strokeColor"
        :width="iconSize"
        :height="iconSize"
    />
<!--    <img v-if="isDarkTheme" :src="config.themes.find(item => item.key === 'dark').icon.icon" alt="">-->
<!--    <img v-else :src="config.themes.find(item => item.key === 'light').icon.icon" alt="">-->
    <MoonIcon
        v-else
        :strokeColor="strokeColor"
        :width="iconSize"
        :height="iconSize"
    />
  </button>
</template>

<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useStore } from 'vuex';
import MoonIcon from "@/shared/components/svg-icons/MoonIcon.vue";
import SunIcon from "@/shared/components/svg-icons/SunIcon.vue";
import config from '@/config/siteConfig.json'

const isDarkTheme = ref(false);
const store = useStore();

const props = defineProps({
  strokeColor: String,
  iconSize: String,
  moonSize: String
})



const darkThemeStoreValue = computed(() => store.getters.getTheme)

onBeforeMount(() => {
  if (darkThemeStoreValue.value) {
    isDarkTheme.value = darkThemeStoreValue.value
  }
})
console.log('darkThemeValue', darkThemeStoreValue.value);
const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  store.dispatch('setTheme', isDarkTheme.value);
  // localStorage.setItem('theme', themeClass.value);
};

const themeClass = computed(() => {
  return isDarkTheme.value ? 'dark-mode' : 'light-mode';
});

</script>

<style scoped lang="scss">
.toggle-btn {
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.moon-btn {
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
}
</style>