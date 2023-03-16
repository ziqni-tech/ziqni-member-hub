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
@import '../../assets/scss/utils/vars';

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
  }

  .form-check-input {
    min-width: 51px;
    height: 31px;
    box-shadow: inset 0px -0.5px 0px $g-0;
  }

  .form-switch .form-check-input:checked {
    background-color: $blue ;
  }
}
</style>