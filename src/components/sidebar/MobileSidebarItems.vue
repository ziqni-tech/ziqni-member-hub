<template>
  <CNavItem v-for="(item, index) in navItems" :key="index" class="mob-nav-item">
    <router-link :to="item.to" class="mob-item-link" :style="{'--itemBg': `url(${bgImg})`}">
      <div class="mob-icon-wrapper" :style="{'--itemEllipse': `url(${itemEllipse})`}">
        <img class="mob-icon" :src="item.icon" :alt="item.name" >
      </div>
    </router-link>
  </CNavItem>
</template>

<script setup>
import { CNavItem } from '@coreui/vue';
import bgImg from '../../assets/icons/sidebar/mob-select-item.png';
import itemEllipse from '../../assets/icons/icon-Siri.png';

const props = defineProps({ navItems: Array });

</script>

<style scoped lang="scss">
@import 'src/assets/scss/_variables.scss';

.mob-nav-item {
  height: 120px;

  > .router-link-active {
    position: relative;
    padding: 0;

    &:after {
      content: '';
      position: absolute;
      width: 97px;
      height: 120px;
      background-image: var(--itemBg);
      background-size: contain;
      background-repeat: no-repeat;
      top: -56%;
      left: 0;
      transition: all 1s;
      z-index: 1;
    }
  }

  > .router-link-active .mob-icon-wrapper {
    &:before {
      content: '';
      position: absolute;
      width: 84px;
      height: 84px;
      background-image: var(--itemEllipse);
      background-size: contain;
      background-repeat: no-repeat;
      top: 60%;
      left: 55%;
      transform: translate(-50%, -50%);
      transition: all 1s;
      z-index: 3;
    }
  }

  .mob-item-link {
    display: flex;
    justify-content: flex-start;
    width: 100%;

    .mob-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      object-fit: cover;
      position: relative;
      background: #FAFBFC;
      border: 2px solid #FAFBFC;
      box-shadow: 0 10px 15px rgba(207, 217, 230, 0.3), inset 0 11px 13px rgba(230, 236, 242, 0.4);

      .mob-icon {
        width: 30px;
        height: 45px;
        z-index: 5;
      }
    }
  }
}
</style>