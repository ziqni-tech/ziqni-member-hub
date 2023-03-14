<template>
  <div class="game-mode-switch">
    <span class="label">Dark Mode {{ darkMode ? 'On' : 'Off' }}</span>
    <CFormSwitch @change="toggleTheme" v-model="darkMode"/>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { CFormSwitch } from '@coreui/vue';
import { useStore } from 'vuex';

const darkMode = ref(false);
const darkClass = 'dark-mode';
const store = useStore()

const toggleTheme = (value) => {
  const body = document.querySelector('body');
  
  if (value) {
    body.classList.add(darkClass);
    localStorage.setItem('darkMode', true);
    store.dispatch('setTheme', darkMode.value)
  } else {
    body.classList.remove(darkClass);
    localStorage.setItem('darkMode', false);
    store.dispatch('setTheme', darkMode.value)
  }
};

onMounted(() => {
  const storedValue = localStorage.getItem('darkMode');
  if (storedValue) {
    darkMode.value = storedValue === 'true';
  }
  toggleTheme(darkMode.value);
});

watch(darkMode, toggleTheme);

</script>

<style lang="scss">
@import '../../assets/scss/variables';

.game-mode-switch {
  display: flex;
  align-items: center;

  .label {
    padding: 0 10px;
    font-family: 'Poppins', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    text-align: center;
    letter-spacing: -0.408px;
    color: $nav-text-color;
  }

  .form-check-input {
    min-width: 51px;
    height: 31px;
    //background: linear-gradient(180deg, #ABA7D9 0%, #E1E8F1 95.16%);
    box-shadow: inset 0px -0.5px 0px #FFFFFF;
  }
}
</style>