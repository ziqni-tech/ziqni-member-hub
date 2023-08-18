<template>
  <div id="app-header" :class="{'light-mode': !isDarkMode}">
    <div
        class="go-back"
        @click="$router.go(-1)"
        v-if="isGoBackBtn"
    >
      <ArrowLeft :strokeColor="getIconStrokeColor()" />
    </div>
    <div class="user-actions">
      <div class="header-btns">
        <button class="btn" @click="openNotifications">
          <NotificationIcon
              :strokeColor="getIconStrokeColor()"
              :width="'40'"
              :height="'40'"
          />
        </button>
        <ToggleTheme
            class="btn"
            :stroke-color="getIconStrokeColor()"
            :iconSize="'40'"
        />
      </div>
      <div class="user-actions-profile">
        <span class="user-name">{{ member.name }}</span>
        <div class="user-image">
          <img :src="member.iconLink ? member.iconLink : memberDefaultIcon" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import ToggleTheme from '@/shared/components/ToggleTheme.vue';
import memberDefaultIcon from '@/assets/images/user/avatar.png'
import ArrowLeft from "@/shared/components/svg-icons/ArrowLeft.vue";
import NotificationIcon from "@/shared/components/svg-icons/NotificationIcon.vue";

const store = useStore();
const member = computed(() => store.getters.getMember);
const isDarkMode = computed(() => store.getters.getTheme);

const emit = defineEmits(['openNotifications'])

const openNotifications = () => {
  emit('openNotifications')
}

const getIconStrokeColor = () => {
  return isDarkMode.value ? '#FFFFFF' : '#080D12'
};

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
  background-color: $main-bg-DM;
  border-bottom: 1px solid $border-color-DM;
  position: fixed;
  z-index: 5;

  display: flex;
  align-items: center;

  .go-back {
    margin-right: auto;
    border-radius: $border-radius-sm;
    border: 1px solid $btn-border-grey;
    margin-left: 10px;
    padding: 7px 12px;
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
        border: 1px solid $btn-border-grey;
        padding: 0;

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
        border: 1px solid $btn-border-grey;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border: none;
        }
      }
    }
  }
  &.light-mode {
    background-color: $bg-body-LM;
    border-bottom: 1px solid $main-border-color-LM;

    .go-back {
      border: 1px solid $main-border-color-LM;
    }

    .header-btns {
      display: flex;
      align-items: center;
      margin-right: 30px;

      .btn {
        border: 1px solid $main-border-color-LM;
      }
    }

    .user-actions-profile {
      font-family: $semi-bold;
      display: flex;
      align-items: center;

      .user-name {
        font-size: 16px;
        color: $section-title-color-LM;
        margin-right: 10px;
      }

      .user-image {
        width: 37px;
        height: 37px;
        border-radius: $border-radius-round;
        border: 1px solid $main-border-color-LM;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border: none;
        }
      }
    }
  }
}

</style>