<template>
  <button @click="toggleTheme" >
    <SunIcon
        v-if="isDarkTheme"
        :strokeColor="strokeColor"
        :width="iconSize"
        :height="iconSize"
    />
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
.moon-btn {
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
}
</style>