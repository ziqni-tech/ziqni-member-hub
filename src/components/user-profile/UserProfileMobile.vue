<template>
  <div id="user-profile-mobile" :class="{ open: isProfileInfo }">
    <div class="background-block" :style="{ 'background-image': `url(${require('@/assets/images/user/cover.png')})` }">
      <div class="buttons">
        <ToggleTheme class="btn" />
        <button class="btn" v-if="isMobile" @click="closeProfileInfo">
          <img src="@/assets/icons/user-info/close.png" alt="">
        </button>
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
    <div class="border-block"></div>
    <button
        class="logout-mobile-btn"
        @click="logOut"
    >
      logout
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import ProfileInfoCircleProgress from './ProfileInfoCircleProgress';
import ToggleTheme from '@/shared/components/ToggleTheme.vue';
import useMobileDevice from '@/hooks/useMobileDevice';

const store = useStore();
const { isMobile } = useMobileDevice();
const emit = defineEmits(['closeProfileInfo', 'logOut'])

const props = defineProps({
  isProfileInfo: {
    type: Boolean,
    default: false
  }
})

const closeProfileInfo = () => {
  emit('closeProfileInfo')
}

const logOut = () => {
  emit('logOut')
}

const member = computed(() => store.getters.getMember);

</script>

<style lang="scss">
@import "src/assets/scss/_variables";

#user-profile-mobile {
  display: flex;
  flex-direction: column;
  background-color: $light-grey;
  position: fixed;
  top: 0;
  right: -100%;
  width: 100%;
  height: 100%;
  transition: right 0.3s ease-in-out;

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
      color: $text-color-white;
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
      margin-bottom: 20px;
    }
  }

  .border-block {
    height: 0;
    width: 90%;
    margin: auto;
    border-bottom: 1px solid $border-dark;
  }

  .logout-mobile-btn {
    width: 320px;
    margin: 0 auto 20px;
    padding: 10px;
    border-radius: $border-radius;
    border: 1px solid $purple;
    background: none;

    font-weight: 700;
    font-size: 12px;
    line-height: 14px;

    color: $text-color-white;
  }
}

#user-profile-mobile.open {
  right: 0;
}
</style>