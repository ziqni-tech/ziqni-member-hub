<template>
 <div class="notification-item" :class="{'light-mode': !isDarkMode}">
   <div class="icon">
     <img src="@/assets/icons/logo.svg" alt="" />
   </div>
   <div class="notification-data">
     <span class="notification-text">Some text notification</span>
     <span class="notification-date">2 hours ago</span>
   </div>
 </div>
</template>

<script setup>

const props = defineProps({
  isDarkMode: Boolean
})

</script>

<style scoped lang="scss">
@import "src/assets/scss/_variables";
.notification-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;

  .icon {
    height: 22px;
    width: 22px;
  }

  .notification-data {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 11px;

    .notification-text {
      font-size: 12px;
      font-family: $mainFont;
      color: $btn-primary-color-LM;
    }

    .notification-date {
      font-size: 10px;
      font-family: $medium;
      color: #CCC;
    }
  }

  &.light-mode {
    .notification-data {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 10px 11px;

      .notification-text {
        font-size: 12px;
        font-family: $mainFont;
        color: #080D12;
      }

      .notification-date {
        font-size: 10px;
        font-family: $medium;
        color: #223241;
      }
    }
  }
}

</style>