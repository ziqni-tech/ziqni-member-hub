<template>
  <div id="app-header">
    <div class="header-btns">
      <button class="btn"><img :src="notificationIcon" alt=""></button>
      <button class="btn"><img :src="sunIcon" alt=""></button>
    </div>
    <div class="user-profile">
      <span class="user-name">{{ member.name }}</span>
      <div class="user-image">
        <img src="../assets/images/user/avatar.png" alt="">
      </div>
    </div>
  </div>
</template>

<script setup>
import notificationIcon from '@/assets/icons/user-info/notification.png';
import sunIcon from '@/assets/icons/user-info/sun.png';
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();
const member = computed(() => store.getters.getMember);

</script>

<style lang="scss" scoped>
@import 'src/assets/scss/_variables';

#app-header {
  width: 85%;
  padding: 15px;
  background-color: $dark-grey;
  border-bottom: 1px solid $border-dark;
  position: fixed;
  z-index: 5;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  .header-btns {
    display: flex;
    align-items: center;
    margin-right: 30px;

    .btn {
      border-radius: $border-radius-sm;
      border: 1px solid $border-dark;

      &:nth-child(n + 2) {
        margin-left: 10px;
      }
    }
  }

  .user-profile {
    display: flex;
    align-items: center;

    .user-name {
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      color: $main-text-color-white;
      margin-right: 10px;
    }

    .user-image {
      width: 37px;
      height: 37px;
      border-radius: $border-radius-round;
      display: flex;
      align-items: center;
      justify-content: center;

      & > img {
        width: inherit;
        height: inherit;
      }
    }
  }
}

</style>