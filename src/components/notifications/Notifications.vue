<template>
  <div class="notifications-block" :class="{'light-mode': !isDarkMode}">
    <div class="notifications-block_header">
      <div class="close-btn" @click="closeNotifications">
        <ArrowLeft :strokeColor="getIconStrokeColor()"/>
      </div>
    </div>
    <div class="notifications-block_list">
      <span class="title">Notification</span>
    </div>
  </div>
</template>

<script setup>

import ArrowLeft from '@/shared/components/svg-icons/ArrowLeft.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();
const isDarkMode = computed(() => store.getters.getTheme);

const emit = defineEmits(['closeNotifications']);

const closeNotifications = () => {
  emit('closeNotifications');
};

const getIconStrokeColor = () => {
  return isDarkMode.value ? '#FFFFFF' : '#080D12';
};

</script>

<style scoped lang="scss">
@import "src/assets/scss/_variables";

.notifications-block {
  display: flex;
  flex-direction: column;
  background-color: $secondary-bg-DM;
  width: 100%;
  height: 100%;
  max-width: 370px;


  &_header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 12px;

    .close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      border: 1px solid rgba(230, 230, 230, 0.20);
      width: 40px;
      height: 40px;
    }
  }

  &_list {
    display: flex;
    flex-direction: column;
    padding: 2px 12px;
    align-items: flex-start;

    .title {
      font-size: 20px;
      font-family: $bold;
      color: $white-color-DM;
    }
  }

  &.light-mode {
    background-color: $bg-secondary-LM;

    .notifications-block_header {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 12px;

      .close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        border: 1px solid #B9CEDF;
        width: 40px;
        height: 40px;
      }
    }

    .notifications-block_list {
      display: flex;
      flex-direction: column;
      padding: 2px 12px;
      align-items: flex-start;

      .title {
        font-size: 20px;
        font-family: $bold;
        color: $section-title-color-LM;
      }
    }
  }
}
</style>