<template>
  <div id="user-profile">
    <div class="background-block" :style="{ 'background-image': `url(${require('@/assets/images/user/cover.png')})` }">
      <div class="buttons">
        <button class="btn"><img :src="notificationIcon" alt=""></button>
        <ToggleTheme class="btn" />
      </div>
    </div>
    <div class="user-info">
      <div class="user-image-wrapper">
        <div class="user-image">
          <img src="../../assets/images/user/avatar.png" alt="">
        </div>
      </div>
      <div class="user-name">{{ member.name }}</div>
      <div class="pro-label">pro</div>
      <div class="info-block">
        <ProfileInfoCircleProgress
            :color="'#BEE9F3'"
            :title="'Total game'"
            :completed-steps="2000"
            :total-steps="6000"
        />
        <ProfileInfoCircleProgress
            :color="'#8749DC'"
            :title="'Points'"
            :completed-steps="1200"
            :total-steps="10000"
        />
        <ProfileInfoCircleProgress
            :color="'#6FCF97'"
            :title="'win'"
            :completed-steps="85"
            :total-steps="100"
            :is-percents="true"
        />
        <ProfileInfoCircleProgress
            :color="'#EB5757'"
            :title="'lose'"
            :completed-steps="15"
            :total-steps="100"
            :is-percents="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import notificationIcon from '@/assets/icons/user-info/notification.png';
import sunIcon from '@/assets/icons/user-info/sun.png';
import { computed } from 'vue';
import { useStore } from 'vuex';
import ProfileInfoCircleProgress from './ProfileInfoCircleProgress';
import ToggleTheme from '@/shared/components/ToggleTheme.vue';

const store = useStore();

const member = computed(() => store.getters.getMember);

</script>

<style lang="scss">
@import "src/assets/scss/_variables";

#user-profile {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: inherit;

  .background-block {
    display: flex;
    flex-direction: column;
    position: relative;
    height: 24%;
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .buttons {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 12px;

      .btn {
        padding: 10px;
        border-radius: 5px;
        border: 1px solid rgba(230, 230, 230, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;

        > img {
          width: 16px;
          height: 16px;
        }
      }
    }
  }

  .user-info {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 42px;

    .user-image-wrapper {
      position: absolute;
      top: -68px;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: $purple;
      display: flex;
      align-items: center;
      justify-content: center;

      .user-image {
        width: 92px;
        height: 92px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        border: 4px solid $border-dark;
        background-color: $body-text-color;
      }
    }

    .user-name {
      font-style: normal;
      font-weight: 700;
      font-size: 14px;
      line-height: 17px;
      color: $sidebar-text-color;
    }

    .pro-label {
      margin-top: 5px;
      border-radius: 5px;
      text-transform: uppercase;
      background: $purple;
      color: $main-text-color-white;
      padding: 0 10px;
      font-weight: 700;
      font-size: 10px;
      line-height: 12px;
    }

    .info-block {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, minmax(0, 1fr));
      gap: 41px 16px;
      margin-top: 50px;
    }
  }
}
</style>