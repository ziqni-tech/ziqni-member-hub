<template>
<div class="mobile-sidebar">
  <div class="mob-sidebar-wrapper" :class="isClicked ? 'mob-sidebar-wrapper__active' : ''">
    <div class="sidebar-menu-btn" @click="handleClickBtn" :class="isClicked ? 'sidebar-menu-btn__active' : ''">
      <img src="../../assets/icons/sidebar/mob-menu-btn.png" alt="">
    </div>
    <MobileSidebarItems v-if="isClicked" :nav-items="$options.sidebarNav" />
  </div>
</div>
</template>

<script>
import { ref } from 'vue';
import sidebarNav from './sidebarNav';
import MobileSidebarItems from './MobileSidebarItems';

export default {
  name: 'MobileSidebar',
  components: { MobileSidebarItems },
  sidebarNav,
  setup() {
    const isClicked = ref(false);

    const handleClickBtn = () => {
      isClicked.value = !isClicked.value
    }

    return {
      isClicked,
      handleClickBtn
    }
  }

};
</script>

<style lang="scss">
.mobile-sidebar {
  position: fixed;
  width: 76px;
  top: 114px;
  right: 0;
  z-index: 10;

  .mob-sidebar-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: center;
    padding-top: 80px;

    &__active {
      height: 641px;
      background: linear-gradient(146.22deg, rgba(199, 197, 221, 0.7) 9.7%, rgba(248, 251, 255, 0.7) 86.02%);
      box-shadow: 5.09091px 5.09091px 12.7273px rgba(142, 155, 174, 0.2), inset -0.28866px -0.57732px 0px rgba(255, 255, 255, 0.6);
      border-radius: 38px;
    }

    .sidebar-menu-btn {
      position: absolute;
      top: 0;
      left: 0;
      transition: all .2s ease-in-out;

      &__active {
        & > img {
          transform: rotate(45deg) translateX(-5px);
        }
      }
    }
  }
}
</style>