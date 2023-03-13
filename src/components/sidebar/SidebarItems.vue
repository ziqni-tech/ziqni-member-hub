<template>
  <CNavItem
      v-for="(item, index) in navItems"
      :key="index"
  >
    <router-link :to="item.to" class="item-link" :style="{'--itemBg': `url(${bgImg})`}">
      <div class="icon-wrapper" :style="{'--itemEllipse': `url(${itemEllipse})`}">
        <img class="icon" :src="item.icon" :alt="item.name" >
      </div>
      <span class="link-text">{{ item.name }}</span>
    </router-link>
  </CNavItem>
</template>

<script setup>
import { CNavItem } from '@coreui/vue';
import bgImg from '../../assets/icons/Sellectio_blue.svg';
import itemEllipse from '../../assets/icons/icon_siri.svg';

const props = defineProps({ navItems: Array })

</script>

<style lang="scss">
@import 'src/assets/scss/_variables.scss';

.nav-item {
  & a {
    text-decoration: none;
    color: $sidebar-link-color;
  }

  & a:hover {
    color: $sidebar-active-link-color;
  }

  > .router-link-active {
    color: $sidebar-active-link-color;
  }

  > .router-link-active {
    padding: 49px 0;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      width: 116px;
      height: 169px;
      background-image: var(--itemBg);
      background-size: contain;
      background-repeat: no-repeat;
      top: -15px;
      left: 0;
      transition: all 1s;
      z-index: 1;
    }
  }

  > .router-link-active .icon-wrapper {
    margin-right: 28px;

    &:before {
      content: '';
      position: absolute;
      width: 107px;
      height: 107px;
      background-image: var(--itemEllipse);
      background-size: contain;
      background-repeat: no-repeat;
      top: -26px;
      left: -34px;
      transition: all 1s;
      z-index: 3;
    }
  }

  .item-link {
    display: flex;
    justify-content: flex-start;
    width: 100%;

    .icon-wrapper {
      width: 30px;
      object-fit: cover;
      position: relative;
      margin-left: 57px;

      .icon {
        position: absolute;
        top: 33%;
        left: 45%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        z-index: 5;
      }
    }

    .link-text {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      text-transform: capitalize;
      padding-top: 10px;
      padding-bottom: 35px;
      padding-left: 16px;
    }
  }
}
</style>