<template>
  <div id="app-header">
    <div
        class="go-back"
        @click="$router.go(-1)"
        v-if="isGoBackBtn"
    >
      <img src="../assets/icons/back_arrow.png" alt="">
    </div>
    <div class="user-actions">
      <div class="header-btns">
        <button class="btn"><img :src="notificationIcon" alt=""></button>
        <ToggleTheme class="btn" />
      </div>
      <div class="user-actions-profile">
        <span class="user-name">{{ member.name }}</span>
        <div class="user-image">
          <img src="@/assets/images/user/avatar.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import notificationIcon from '@/assets/icons/user-info/notification.png';
import sunIcon from '@/assets/icons/user-info/sun.png';
import ToggleTheme from '@/shared/components/ToggleTheme.vue';

const store = useStore();
const member = computed(() => store.getters.getMember);

const router = useRouter();
const isGoBackBtn = computed(() => {
  const pathLength = router.currentRoute.value.path.split('/').length;

  return !!(router.currentRoute.value.params.id || pathLength > 2);
});

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

  .go-back {
    margin-right: auto;
    border-radius: $border-radius-sm;
    border: 1px solid $border-dark;
    margin-left: 10px;
    padding: 7px 15px;
    cursor: pointer;

  }

  .user-actions {
    display: flex;
    margin-left: auto;

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

    .user-actions-profile {
      font-family: $semi-bold;
      display: flex;
      align-items: center;

      .user-name {
        font-size: 16px;
        color: $text-color-white;
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
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
  }
}

</style>