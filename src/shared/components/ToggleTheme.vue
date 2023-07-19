<template>
  <button @click="toggleTheme">
    <SunIcon
        v-if="isDarkTheme"
        :strokeColor="strokeColor"
        :width="'40'"
        :height="'40'"
    />
    <MoonIcon
        v-else
        :strokeColor="strokeColor"
        :width="'20'"
        :height="'20'"
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
  strokeColor: String
})

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